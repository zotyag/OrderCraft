package com.gombar.OrderCraft.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

// Fontos: OncePerRequestFilter használata a sima Filter helyett (jobb a Springnek)
@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;

    public JwtTokenFilter(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String authHeader = request.getHeader("Authorization");
            String token = null;
            String username = null;

            // 1. Token kinyerése
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                if (tokenProvider.validateToken(token)) {
                    username = tokenProvider.getUsernameFromToken(token);
                    String role = tokenProvider.getRoleFromToken(token);

                    // 2. Jogosultság (Authority) létrehozása
                    // FIGYELEM: Ha a tokenben "ADMIN" van, ez "ADMIN" authority lesz.
                    // Ha a SecurityConfigban .hasRole("ADMIN") van, akkor ide "ROLE_ADMIN" kellene!
                    // Mivel te .hasAuthority("ADMIN")-t használsz, ez így jó:
                    List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(role));

                    // 3. Authentication objektum létrehozása
                    // (Nem hívjuk be a DB-t feleslegesen, mert minden infó a tokenben van)
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            username,
                            null, // credentials nem kell már
                            authorities
                    );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // 4. A LÉNYEG: Beletesszük a Context-be!
                    // Ez hiányzott nálad. Enélkül a Spring nem tudja, ki vagy.
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception ex) {
            // Logolhatod a hibát, de ne állítsd meg a filter láncot
            System.err.println("Hiba a user autentikáció beállításakor: " + ex.getMessage());
        }

        // Továbbengedjük a kérést
        filterChain.doFilter(request, response);
    }
}