//package com.example.student_management.entity;
//
//import jakarta.persistence.Entity;
//import jakarta.persistence.Id;
//
//@Entity
//public class Administrator {
//    @Id
//    private String uid;
//    private String upass;
//
//    public Administrator() {
//    }
//
//    public Administrator(String uid, String upass) {
//        this.uid = uid;
//        this.upass = upass;
//    }
//
//    public String getUid() {
//        return uid;
//    }
//
//    public void setUid(String uid) {
//        this.uid = uid;
//    }
//
//    public String getUpass() {
//        return upass;
//    }
//
//    public void setUpass(String upass) {
//        this.upass = upass;
//    }
//}
package com.example.student_management.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Administrator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String uid;
    private String upass;

    // 构造方法、getter 和 setter
    public Administrator() {}

    public Administrator(String uid, String upass) {
        this.uid = uid;
        this.upass = upass;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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