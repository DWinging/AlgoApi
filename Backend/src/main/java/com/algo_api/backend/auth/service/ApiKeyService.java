package com.algo_api.backend.auth.service;

import com.algo_api.backend.auth.entity.ApiKey;
import com.algo_api.backend.auth.entity.User;
import com.algo_api.backend.auth.repository.ApiKeyRepository;
import com.algo_api.backend.auth.repository.UserRepository;

import com.algo_api.backend.auth.type.ApiKeyRole;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

import java.time.LocalDateTime;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final UserRepository userRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${api-key.expiration-days}")
    private long expirationDays;

    @Transactional
    public ApiKey authenticate(String rawApiKey) {
        String apiKeyHash = hash(rawApiKey);

        ApiKey apiKey = apiKeyRepository.findByApiKeyHash(apiKeyHash)
                .orElseThrow(() ->
                        new IllegalArgumentException("유효하지 않은 API Key입니다.")
                );

        if (!apiKey.isActive()) {
            throw new IllegalStateException("비활성화된 API Key입니다.");
        }

        if (apiKey.getExpiresAt() != null
                && apiKey.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("만료된 API Key입니다.");
        }

        return apiKey;
    }

    @Transactional
    public String issue(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow();

        if (apiKeyRepository
                .findByUser_IdAndActiveTrueAndRole(userId, ApiKeyRole.USER)
                .isPresent()) {
            throw new IllegalStateException("이미 활성 API Key가 존재합니다.");
        }

        return createApiKey(user);
    }

    @Transactional
    public String reissue(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow();

        ApiKey currentKey = apiKeyRepository
                .findByUser_IdAndActiveTrueAndRole(userId, ApiKeyRole.USER)
                .orElseThrow();

        currentKey.deactivate();

        return createApiKey(user);
    }

    private String createApiKey(User user) {
        String rawKey = generateUniqueKey();
        String hashedKey = hash(rawKey);

        ApiKey apiKey = ApiKey.builder()
                .apiKeyHash(hashedKey)
                .user(user)
                .role(ApiKeyRole.USER)
                .active(true)
                .expiresAt(LocalDateTime.now().plusDays(expirationDays))
                .build();

        apiKeyRepository.save(apiKey);

        return rawKey;
    }

    private String hash(String key) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = digest.digest(key.getBytes(StandardCharsets.UTF_8));

            return HexFormat.of().formatHex(hashedBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("API Key 해시 생성에 실패했습니다.");
        }
    }

    private String generateUniqueKey() {
        byte[] bytes = new byte[16];
        secureRandom.nextBytes(bytes);

        return HexFormat.of().formatHex(bytes);
    }
}
