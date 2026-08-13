package com.algo_api.backend.auth.repository;

import com.algo_api.backend.auth.entity.ApiKey;
import com.algo_api.backend.auth.type.ApiKeyRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {

    boolean existsByApiKeyHash(String apiKeyHash);
    
    Optional<ApiKey> findByUser_IdAndActiveTrueAndRole(Long userId, ApiKeyRole role);

    Optional<ApiKey> findByApiKeyHash(String apiKeyHash);

    Optional<ApiKey> findFirstByUser_IdOrderByIssuedAtDescIdDesc(Long userId);
}
