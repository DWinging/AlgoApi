package com.algo_api.backend.auth.controller;

import com.algo_api.backend.auth.service.ApiKeyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/keys")
@RequiredArgsConstructor
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    @PostMapping("/issue")
    public ResponseEntity<String> issue(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();

        String apiKey = apiKeyService.issue(userId);

        return ResponseEntity.status(HttpStatus.CREATED).body(apiKey);
    }

    @PostMapping("/reissue")
    public ResponseEntity<String> reissue(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();

        String apiKey = apiKeyService.reissue(userId);

        return ResponseEntity.status(HttpStatus.CREATED).body(apiKey);
    }
}
