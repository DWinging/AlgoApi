package com.algo_api.backend.global.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {

        String bearerScheme = "bearerAuth";
        String apiKeyScheme = "apiKeyAuth";

        return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes(
                                bearerScheme,
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                        )
                        .addSecuritySchemes(
                                apiKeyScheme,
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.APIKEY)
                                        .in(SecurityScheme.In.HEADER)
                                        .name("X-API-Key")
                        )
                )
                .addSecurityItem(
                        new SecurityRequirement().addList(bearerScheme)
                )
                .addSecurityItem(
                        new SecurityRequirement().addList(apiKeyScheme)
                );
    }
}