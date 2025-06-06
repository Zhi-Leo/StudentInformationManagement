package com.example.student_management.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class ClassInfo {
    @Id
    private String id; // 班级ID
    private String name; // 班级名称

    // 无参构造函数
    public ClassInfo() {}

    // 全参构造函数
    public ClassInfo(String id, String name) {
        this.id = id;
        this.name = name;
    }

    // Getters 和 Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "ClassInfo{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}