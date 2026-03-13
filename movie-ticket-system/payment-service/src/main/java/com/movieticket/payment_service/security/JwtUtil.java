package com.movieticket.payment_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    private final String SECRET = "supersecretkey_movie_ticket_system";

    public Claims validateToken(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(SECRET.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();

    }

}