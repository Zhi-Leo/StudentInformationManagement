package com.example.student_management.controller;

import com.example.student_management.entity.ClassInfo;
import com.example.student_management.service.ClassInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClassInfoController {
    @Autowired
    private ClassInfoService classInfoService;

    // 获取所有班级
    @GetMapping
    public List<ClassInfo> getAllClasses() {
        return classInfoService.getAllClasses();
    }

    // 根据 ID 获取班级
    @GetMapping("/{id}")
    public ResponseEntity<ClassInfo> getClassById(@PathVariable String id) {
        ClassInfo classInfo = classInfoService.getClassById(id);
        if (classInfo != null) {
            return new ResponseEntity<>(classInfo, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 添加班级
    @PostMapping
    public ResponseEntity<ClassInfo> addClass(@RequestBody ClassInfo classInfo) {
        ClassInfo savedClass = classInfoService.addClass(classInfo);
        return new ResponseEntity<>(savedClass, HttpStatus.CREATED);
    }

    // 更新班级
    @PutMapping("/{id}")
    public ResponseEntity<ClassInfo> updateClass(@PathVariable String id, @RequestBody ClassInfo classInfo) {
        classInfo.setId(id);
        ClassInfo updatedClass = classInfoService.updateClass(classInfo);
        if (updatedClass != null) {
            return new ResponseEntity<>(updatedClass, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 删除班级
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable String id) {
        classInfoService.deleteClass(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}