package com.example.student_management.entity;

import java.util.Map;

/**
 * 统一API响应格式
 */
public class ApiResponse<T> {

    // 响应码
    private int code;
    
    // 响应消息
    private String message;
    
    // 响应数据
    private T data;
    
    // 其他附加信息
    private Map<String, Object> meta;

    // 构造方法
    public ApiResponse() {
    }

    public ApiResponse(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public ApiResponse(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public ApiResponse(int code, String message, T data, Map<String, Object> meta) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.meta = meta;
    }

    // 成功响应的静态方法
    public static <T> ApiResponse<T> success() {
        return new ApiResponse<>(200, "操作成功");
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(200, "操作成功", data);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(200, message, data);
    }

    // 失败响应的静态方法
    public static <T> ApiResponse<T> fail() {
        return new ApiResponse<>(500, "操作失败");
    }

    public static <T> ApiResponse<T> fail(String message) {
        return new ApiResponse<>(500, message);
    }

    public static <T> ApiResponse<T> fail(int code, String message) {
        return new ApiResponse<>(code, message);
    }

    // Getter和Setter方法
    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public Map<String, Object> getMeta() {
        return meta;
    }

    public void setMeta(Map<String, Object> meta) {
        this.meta = meta;
    }
}