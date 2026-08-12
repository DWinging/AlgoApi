package com.algo_api.backend.auth.service;

import com.algo_api.backend.auth.entity.ApiKey;
import com.algo_api.backend.auth.entity.User;
import com.algo_api.backend.auth.repository.ApiKeyRepository;
import com.algo_api.backend.auth.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final UserRepository userRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public String issue(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow();

        if (apiKeyRepository.findByUser_IdAndActiveTrue(userId).isPresent()) {
            throw new IllegalStateException("이미 활성 API Key가 존재합니다.");
        }

        return createApiKey(user);
    }

    @Transactional
    public String reissue(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow();

        ApiKey currentKey = apiKeyRepository
                .findByUser_IdAndActiveTrue(userId)
                .orElseThrow();

        currentKey.deactivate();

        return createApiKey(user);
    }

    private String createApiKey(User user) {
        String rawKey = generateUniqueKey();
        String hashedKey = hash(rawKey);

        ApiKey apiKey = ApiKey.builder()
                .apiKey(hashedKey)
                .user(user)
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
