package com.algo_api.backend.problem.controller;

import com.algo_api.backend.auth.entity.ApiKey;
import com.algo_api.backend.problem.dto.ProblemCreateRequest;
import com.algo_api.backend.problem.dto.ProblemResponse;
import com.algo_api.backend.problem.service.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/problems")
public class ProblemApiController {

    private final ProblemService problemService;

    @PostMapping
    public ResponseEntity<ProblemResponse> create(
            @RequestBody ProblemCreateRequest request
    ) {
        return ResponseEntity.ok(problemService.create(request));
    }

    @GetMapping("/recommend")
    public ResponseEntity<ProblemResponse> recommend(
            Authentication authentication
    ) {
        ApiKey apiKey = (ApiKey) authentication.getPrincipal();

        return ResponseEntity.ok(
                problemService.recommend(apiKey.getUser().getId())
        );
    }
}
