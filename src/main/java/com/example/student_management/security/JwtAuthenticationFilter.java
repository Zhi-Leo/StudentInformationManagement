package com.example.student_management.security;

import com.example.student_management.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 从请求头中获取Authorization信息
        String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String token = null;

        // 检查Authorization头是否存在且格式正确（Bearer token）
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            // 提取JWT令牌
            token = authorizationHeader.substring(7);
            try {
                // 从令牌中提取用户名
                username = jwtUtil.extractUsername(token);
            } catch (Exception e) {
                // 令牌无效，记录日志但不中断请求
                logger.error("JWT令牌验证失败: {}", e.getMessage());
            }
        }

        // 如果令牌有效且用户尚未认证
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // 验证令牌
            if (jwtUtil.validateToken(token)) {
                // 创建认证对象
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        username, null, null);
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                // 设置认证信息到安全上下文
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        // 继续过滤链
        filterChain.doFilter(request, response);
    }
}