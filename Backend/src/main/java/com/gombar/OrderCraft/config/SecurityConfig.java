package com.gombar.OrderCraft.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/menu", "/menu/available", "/menu/category/**", "/menu/popular").permitAll()

                        // Admin only endpoints
                        .requestMatchers("/menu/**").hasRole("ADMIN")  // Create, update, delete menu items
                        .requestMatchers("/orders/status/**").hasRole("ADMIN")  // View by status
                        .requestMatchers("/orders").hasRole("ADMIN")  // View all orders

                        // Authenticated endpoints
                        .requestMatchers("/orders/**").authenticated()  // Users can create/view their orders

                        .anyRequest().authenticated()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}