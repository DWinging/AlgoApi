package com.algo_api.backend.problem.controller;

import com.algo_api.backend.auth.entity.ApiKey;
import com.algo_api.backend.auth.repository.ApiKeyRepository;
import com.algo_api.backend.auth.type.ApiKeyRole;
import com.algo_api.backend.problem.dto.ProblemCreateRequest;
import com.algo_api.backend.problem.dto.ProblemResponse;
import com.algo_api.backend.problem.service.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemService problemService;
    private final ApiKeyRepository apiKeyRepository;

    @GetMapping("/recommand")
    public ResponseEntity<ProblemResponse> recommend(
            Authentication authentication
    ) {
        Long userId = Long.valueOf(authentication.getName());

        ApiKey apiKey = apiKeyRepository
                .findByUser_IdAndActiveTrueAndRole(userId, ApiKeyRole.USER)
                .orElseThrow(() ->
                        new IllegalStateException("활성 API Key가 없습니다.")
                );

        return ResponseEntity.ok(
                problemService.recommend(apiKey)
        );
    }
}
