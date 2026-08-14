package com.algo_api.backend.problem.dto;

import java.time.LocalDateTime;
import java.util.Set;

public record ProblemResponse(
        Long id,
        String platform,
        Long number,
        String title,
        String level,
        String url,
        Set<String> algorithms,
        LocalDateTime createdAt
) {

}
