package com.algo_api.backend.global.security;

import com.algo_api.backend.auth.entity.ApiKey;
import com.algo_api.backend.auth.service.ApiKeyService;
import com.algo_api.backend.global.exception.BusinessException;
import com.algo_api.backend.global.exception.ErrorResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.json.JsonMapper;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ApiKeyAuthenticationFilter extends OncePerRequestFilter {

    private static final String API_KEY_HEADER = "X-API-Key";

    private final ApiKeyService apiKeyService;
    private final JsonMapper jSonMapper;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return CorsUtils.isPreFlightRequest(request);
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String rawApiKey = request.getHeader(API_KEY_HEADER);

        if (rawApiKey != null
                && !rawApiKey.isBlank()
                && SecurityContextHolder.getContext().getAuthentication() == null) {

            try {
                ApiKey apiKey = apiKeyService.authenticate(rawApiKey);

                String authority = switch (apiKey.getRole()) {
                    case USER -> "ROLE_API_USER";
                    case ADMIN -> "ROLE_API_ADMIN";
                };

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                apiKey,
                                null,
                                List.of(new SimpleGrantedAuthority(authority))
                        );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);

            } catch (BusinessException e) {
                ErrorResponse errorResponse =
                        ErrorResponse.from(e.getErrorCode());

                response.setStatus(e.getErrorCode().getStatus().value());
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");

                jSonMapper.writeValue(
                        response.getWriter(),
                        errorResponse
                );

                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
