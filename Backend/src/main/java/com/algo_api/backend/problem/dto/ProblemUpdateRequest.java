package com.algo_api.backend.problem.dto;

import java.util.Set;

public record ProblemUpdateRequest(
        String platform,
        Long number,
        String title,
        String level,
        String url,
        Set<String> algorithms
) {
}
