package com.algo_api.backend.problem.dto;

import com.algo_api.backend.problem.type.AlgorithmType;
import com.algo_api.backend.problem.type.Platform;

import java.util.Set;

public record ProblemCreateRequest(
        String platform,
        Long number,
        String title,
        String level,
        String url,
        Set<String> algorithms
) {

}
