package com.ecosphere.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

@EnableMethodSecurity
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                // 🔥 CORS enable
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 🔥 CSRF disable (important for REST APIs)
                .csrf(csrf -> csrf.disable())

                // 🔐 AUTH RULES
                .authorizeHttpRequests(auth -> auth

                        // 🔓 Public auth APIs
                        .requestMatchers("/api/auth/**").permitAll()

                        .requestMatchers("/api/aqi/**").permitAll()

                        // 🔓 Swagger
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        // 🔓 Allow preflight requests (VERY IMPORTANT for CORS)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 🔐 Admin routes
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // 🔐 Everything else secured
                        .anyRequest().authenticated()
                )

                // 🔥 Stateless session (JWT)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 🔥 Auth provider
                .authenticationProvider(authenticationProvider)

                // 🔥 JWT filter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        // 🔥 Frontend URL (React Vite)
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174"

        ));

        // 🔥 IMPORTANT: allow headers used in JWT + JSON
        configuration.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Accept"
        ));

        // 🔥 Methods
        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
        ));

        configuration.setAllowCredentials(true);

        // 🔥 Expose Authorization header (important for JWT)
        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}