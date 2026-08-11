package com.algo_api.backend.auth.service;

import com.algo_api.backend.auth.entity.ApiKey;
import com.algo_api.backend.auth.entity.User;
import com.algo_api.backend.auth.repository.ApiKeyRepository;
import com.algo_api.backend.auth.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.HexFormat;
import java.util.UUID;

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
        String key = generateUniqueKey();

        ApiKey apiKey = ApiKey.builder()
                .apiKey(key)
                .user(user)
                .build();

        apiKeyRepository.save(apiKey);

        return key;
    }

    private String generateUniqueKey() {
        String key;

        do {
            byte[] bytes = new byte[32];
            secureRandom.nextBytes(bytes);

            key = HexFormat.of().formatHex(bytes);
        } while (apiKeyRepository.existsByApiKey(key));

        return key;
    }
}
