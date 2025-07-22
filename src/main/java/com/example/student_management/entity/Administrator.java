package com.example.student_management.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Administrator {
    @Id
    private String uid;
    private String upass;

    public Administrator() {
    }

    public Administrator(String uid, String upass) {
        this.uid = uid;
        this.upass = upass;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getUpass() {
        return upass;
    }

    public void setUpass(String upass) {
        this.upass = upass;
    }
}