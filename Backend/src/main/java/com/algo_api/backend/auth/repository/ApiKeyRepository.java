package com.algo_api.backend.auth.repository;

import com.algo_api.backend.auth.entity.ApiKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {

    boolean existsByApiKey(String apiKey);
    
    Optional<ApiKey> findByUser_IdAndActiveTrue(Long userId);
}
