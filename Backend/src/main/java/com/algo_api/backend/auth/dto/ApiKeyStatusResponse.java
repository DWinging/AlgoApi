package com.algo_api.backend.auth.dto;

import java.time.LocalDateTime;

public record ApiKeyStatusResponse(
        boolean issued,
        boolean active,
        LocalDateTime issuedAt,
        LocalDateTime expiresAt
) {
}
