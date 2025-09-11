package com.example.student_management.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity // 声明为 JPA 实体
public class Student {
    @Id // 声明为主键
    private String id; // 学号
    private String name; // 姓名
    private int age; // 年龄
    private String sex; // 性别
    private double grade; // 成绩
    private String clas; // 班级

    // 无参构造函数（必须）
    public Student() {
    }

    // 全参构造函数（可选）
    public Student(String id, String name, int age, String sex, double grade, String clas) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.sex = sex;
        this.grade = grade;
        this.clas = clas;
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

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public double getGrade() {
        return grade;
    }

    public void setGrade(double grade) {
        this.grade = grade;
    }

    public String getClas() { // 添加 getClas 方法
        return clas;
    }

    public void setClas(String clas) {
        this.clas = clas;
    }

    // toString() 方法（可选）
    @Override
    public String toString() {
        return "Student{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", age=" + age +
                ", sex='" + sex + '\'' +
                ", grade=" + grade +
                ", clas='" + clas + '\'' +
                '}';
    }
}