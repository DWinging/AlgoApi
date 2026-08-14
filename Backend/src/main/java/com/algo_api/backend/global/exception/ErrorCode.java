package com.algo_api.backend.global.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {

    DUPLICATE_EMAIL(
            HttpStatus.CONFLICT,
            "이미 사용 중인 이메일입니다."
    ),

    LOGIN_FAILED(
            HttpStatus.UNAUTHORIZED,
            "아이디 또는 비밀번호가 올바르지 않습니다."
    ),

    USER_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "사용자를 찾을 수 없습니다."
    ),

    // API Key
    INVALID_API_KEY(
            HttpStatus.UNAUTHORIZED,
            "유효하지 않은 API Key 입니다."
    ),
    API_KEY_ALREADY_ISSUED(
            HttpStatus.CONFLICT,
            "이미 활성 API Key가 존재합니다."
    ),

    // Problem
    PROBLEM_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "문제를 찾을 수 없습니다."
    ),
    NO_AVAILABLE_PROBLEM(
            HttpStatus.CONFLICT,
            "추천 가능한 문제가 없습니다."
    ),

    //Platform
    INVALID_PLATFORM(
            HttpStatus.BAD_REQUEST,
            "지원하지 않는 플랫폼입니다."
    ),
    INVALID_ALGORITHM(
            HttpStatus.BAD_REQUEST,
            "등록되어있지 않는 알고리즘입니다."
    );

    private final HttpStatus status;
    private final String message;

    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}
