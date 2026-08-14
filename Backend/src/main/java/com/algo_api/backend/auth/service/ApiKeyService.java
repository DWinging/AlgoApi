package com.algo_api.backend.auth.service;

import com.algo_api.backend.auth.dto.ApiKeyStatusResponse;
import com.algo_api.backend.auth.entity.ApiKey;
import com.algo_api.backend.auth.entity.User;
import com.algo_api.backend.auth.repository.ApiKeyRepository;
import com.algo_api.backend.auth.repository.UserRepository;

import com.algo_api.backend.auth.type.ApiKeyRole;
import com.algo_api.backend.global.exception.BusinessException;
import com.algo_api.backend.global.exception.ErrorCode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

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
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_API_KEY));

        if (!apiKey.isActive()
                || !apiKey.getUser().isActive()
                || (apiKey.getExpiresAt() != null
                && apiKey.getExpiresAt().isBefore(LocalDateTime.now()))) {
            throw new BusinessException(ErrorCode.INVALID_API_KEY);
        }

        return apiKey;
    }

    @Transactional
    public String issue(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (apiKeyRepository
                .findByUser_IdAndActiveTrueAndRole(userId, ApiKeyRole.USER)
                .isPresent()) {
            throw new BusinessException(ErrorCode.API_KEY_ALREADY_ISSUED);
        }

        return createApiKey(user);
    }

    @Transactional
    public String reissue(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        ApiKey currentKey = apiKeyRepository
                .findByUser_IdAndActiveTrueAndRole(userId, ApiKeyRole.USER)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_API_KEY));

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
            throw new IllegalStateException("API Key 해시 생성에 실패했습니다.", e);
        }
    }

    private String generateUniqueKey() {
        byte[] bytes = new byte[16];
        secureRandom.nextBytes(bytes);

        return HexFormat.of().formatHex(bytes);
    }

    @Transactional
    public ApiKeyStatusResponse getStatus(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND)
                );

        return apiKeyRepository.findFirstByUser_IdOrderByIssuedAtDescIdDesc(userId)
                .map(apiKey -> new ApiKeyStatusResponse(
                        true,
                        apiKey.isActive(),
                        apiKey.getIssuedAt(),
                        apiKey.getExpiresAt()
                ))
                .orElseGet(() -> new ApiKeyStatusResponse(
                        false,
                        false,
                        null,
                        null
                ));
    }
}
