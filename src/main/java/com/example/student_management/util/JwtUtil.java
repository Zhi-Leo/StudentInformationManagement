package com.example.student_management.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    // 从配置文件读取JWT密钥和过期时间
    @Value("${jwt.secret:default-secret-key-change-me-in-production}")
    private String secret;

    @Value("${jwt.expiration:3600000}")
    private long expirationTime;

    // 生成JWT令牌
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // 获取签名密钥
    private javax.crypto.SecretKey getSignKey() {
        byte[] keyBytes = secret.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // 验证JWT令牌
    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(getSignKey()).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 从JWT令牌中提取用户名
    public String extractUsername(String token) {
        return parseSignedClaims(token).getPayload().getSubject();
    }

    // 从JWT令牌中提取过期时间
    public Date extractExpiration(String token) {
        return parseSignedClaims(token).getPayload().getExpiration();
    }

    // 解析JWT令牌
    private io.jsonwebtoken.Jws<Claims> parseSignedClaims(String token) {
        return Jwts.parser().verifyWith(getSignKey()).build().parseSignedClaims(token);
    }

    // 检查JWT令牌是否过期
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}