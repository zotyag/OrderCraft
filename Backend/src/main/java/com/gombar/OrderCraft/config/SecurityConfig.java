package com.gombar.OrderCraft.config;

import com.gombar.OrderCraft.security.JwtTokenFilter; // <--- FONTOS IMPORT
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // <--- FONTOS IMPORT
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 1. BE KELL INJEKTÁLNI A SAJÁT FILTERÜNKET
    private final JwtTokenFilter jwtTokenFilter;

    public SecurityConfig(JwtTokenFilter jwtTokenFilter) {
        this.jwtTokenFilter = jwtTokenFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Alapvető beállítások
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())

                // Szabályok
                .authorizeHttpRequests(auth -> auth
                        // Publikus végpontok
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/ws/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/menu/**").permitAll()

                        // Admin végpontok
                        // Mivel a filterben simán "ADMIN"-t mentettünk el (ROLE_ nélkül),
                        // így a .hasAuthority("ADMIN") a helyes beállítás.
                        .requestMatchers("/api/menu/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/orders/status/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/orders").hasAuthority("ADMIN")

                        // User végpontok
                        .requestMatchers("/api/orders/**").authenticated()

                        // Minden más
                        .anyRequest().authenticated()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // --- EZ HIÁNYZOTT EDDIG! ---
                // Itt mondjuk meg a Springnek: "Mielőtt a jelszavakat nézegetnéd,
                // futtasd le a mi kis JWT filterünket, hátha van token a kérésben!"
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000", "http://localhost:3001"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")); // PATCH-et is felvettem
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}