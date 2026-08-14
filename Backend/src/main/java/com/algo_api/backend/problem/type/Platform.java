package com.algo_api.backend.problem.type;

import com.algo_api.backend.global.exception.BusinessException;
import com.algo_api.backend.global.exception.ErrorCode;
import lombok.Getter;

import java.util.Arrays;

@Getter
public enum Platform {

    BAEKJOON("백준"),
    PROGRAMMERS("프로그래머스"),
    LEETCODE("LeetCode"),
    SWEA("SWEA");

    private final String displayName;

    Platform(String displayName) {
        this.displayName = displayName;
    }

    public static Platform fromDisplayName(String displayName) {
        return Arrays.stream(values())
                .filter(value -> value.getDisplayName().equals(displayName))
                .findFirst()
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.INVALID_PLATFORM)
                );
    }
}
