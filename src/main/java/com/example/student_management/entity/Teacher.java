package com.example.student_management.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Teacher {
    @Id
    private String id;
    private String name;
    private int age;
    private String sex;
    private String teaching;
    private String clas;

    public Teacher() {
    }

    public Teacher(String id, String name, int age, String sex, String teaching, String clas) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.sex = sex;
        this.teaching = teaching;
        this.clas = clas;
    }

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

    public String getTeaching() {
        return teaching;
    }

    public void setTeaching(String teaching) {
        this.teaching = teaching;
    }

    public String getclas() {
        return clas;
    }

    public void setclas(String clas) {
        this.clas = clas;
    }

    @Override
    public String toString() {
        return "Teacher{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", age=" + age +
                ", sex='" + sex + '\'' +
                ", teaching='" + teaching + '\'' +
                ", clas='" + clas + '\'' +
                '}';
    }
}