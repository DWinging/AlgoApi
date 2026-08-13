package com.algo_api.backend.problem.dto;

import java.time.LocalDate;
import java.util.Set;

public record ProblemHistoryResponse(
        LocalDate allocatedDate,
        Long id,
        String platform,
        Long number,
        String title,
        String level,
        String url,
        Set<String> algorithms
) {
}
