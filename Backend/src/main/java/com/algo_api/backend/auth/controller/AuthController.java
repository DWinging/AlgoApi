package com.algo_api.backend.auth.controller;

import com.algo_api.backend.auth.dto.LoginRequest;
import com.algo_api.backend.auth.dto.LoginResponse;
import com.algo_api.backend.auth.dto.SignupRequest;
import com.algo_api.backend.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(
            @Valid @RequestBody SignupRequest request
            ) {
        authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request
            ) {
        return ResponseEntity.ok(authService.login(request));
    }
}
