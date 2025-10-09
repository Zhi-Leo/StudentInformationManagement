package com.example.student_management.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "class_info") // 明确匹配表名
public class ClassInfo {
    @Id
    private String id; // 假设id字段名与数据库一致

    @Column(name = "name") // 若数据库有name字段，显式映射
    private String name;

    // 关键：强制映射到数据库的headTeacher字段（无下划线）
    @Column(name = "headTeacher")
    private String headTeacher;

    // 关键：强制映射到数据库的studentCount字段（无下划线）
    // 改为 Integer 类型，可处理 NULL 值
    @Column(name = "studentCount")
    private Integer studentCount;

    // 无参构造函数（必须有，JPA要求）
    public ClassInfo() {
    }

    // 全参构造函数（可选）
    public ClassInfo(String id, String name, String headTeacher, Integer studentCount) {
        this.id = id;
        this.name = name;
        this.headTeacher = headTeacher;
        this.studentCount = studentCount;
    }

    // Getters 和 Setters（必须有，否则JSON序列化失败）
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

    public String getHeadTeacher() {
        return headTeacher == null ? "暂无" : headTeacher;
    }

    public void setHeadTeacher(String headTeacher) {
        this.headTeacher = headTeacher;
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public Integer getStudentCount() {
        return studentCount == null ? 0 : studentCount;
    }

    public void setStudentCount(Integer studentCount) {
        this.studentCount = studentCount;
    }
}