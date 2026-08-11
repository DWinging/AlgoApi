package com.algo_api.backend.global.exception;

public class LoginFailedException extends RuntimeException{

    public LoginFailedException() {
        super("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
}
