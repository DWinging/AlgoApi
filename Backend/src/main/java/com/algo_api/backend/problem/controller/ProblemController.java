package com.algo_api.backend.problem.controller;

import com.algo_api.backend.problem.dto.ProblemHistoryResponse;
import com.algo_api.backend.problem.dto.ProblemResponse;
import com.algo_api.backend.problem.service.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemService problemService;

    @GetMapping("/recommend")
    public ResponseEntity<ProblemResponse> recommend(
            Authentication authentication
    ) {
        Long userId = Long.valueOf(authentication.getName());
        return ResponseEntity.ok(
                problemService.recommend(userId)
        );
    }

    @GetMapping("/history")
    public ResponseEntity<List<ProblemHistoryResponse>> getHistory(
            Authentication authentication
    ) {
        Long userId = Long.valueOf(authentication.getName());
        return ResponseEntity.ok(
                problemService.getHistory(userId)
        );
    }
}
