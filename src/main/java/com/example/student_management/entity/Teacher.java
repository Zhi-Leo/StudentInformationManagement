package com.example.student_management.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Teacher {
    @Id
    private String id; // 教工号
    private String name; // 姓名
    private int age; // 年龄
    private String sex; // 性别
    private String teaching; // 教学内容

    // 构造函数、Getters 和 Setters
    public Teacher() {}

    public Teacher(String id, String name, int age, String sex, String teaching) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.sex = sex;
        this.teaching = teaching;
    }

    // Getters 和 Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public String getSex() { return sex; }
    public void setSex(String sex) { this.sex = sex; }
    public String getTeaching() { return teaching; }
    public void setTeaching(String teaching) { this.teaching = teaching; }

    @Override
    public String toString() {
        return "Teacher{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", age=" + age +
                ", sex='" + sex + '\'' +
                ", teaching='" + teaching + '\'' +
                '}';
    }
}