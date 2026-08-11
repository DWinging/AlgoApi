package com.algo_api.backend.auth.service;

import com.algo_api.backend.auth.dto.LoginRequest;
import com.algo_api.backend.auth.dto.LoginResponse;
import com.algo_api.backend.auth.dto.SignupRequest;
import com.algo_api.backend.auth.entity.User;
import com.algo_api.backend.auth.repository.UserRepository;
import com.algo_api.backend.global.exception.DuplicateEmailException;
import com.algo_api.backend.global.exception.LoginFailedException;
import com.algo_api.backend.global.security.JwtProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public void signup(@Valid SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException();
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);
    }

    public LoginResponse login(@Valid LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(LoginFailedException::new);

        if(!user.isActive()) {
            throw new LoginFailedException();
        }

        if(!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            throw new LoginFailedException();
        }

        String accessToken = jwtProvider.createToken(user.getId());

        return new LoginResponse(
                user.getId(),
                accessToken
        );
    }
}
