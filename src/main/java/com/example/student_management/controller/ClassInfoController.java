package com.example.student_management.controller;

import com.example.student_management.entity.ClassInfo;
import com.example.student_management.service.ClassInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClassInfoController {
    private final ClassInfoService classInfoService;

    // 必须通过构造函数注入Service（确保Spring能自动装配）
    public ClassInfoController(ClassInfoService classInfoService) {
        this.classInfoService = classInfoService;
    }


    // 获取所有班级
    @GetMapping
    public List<ClassInfo> getAllClasses() {
        return classInfoService.getAllClasses();
    }

    // 添加班级
    @PostMapping
    public ClassInfo addClass(@RequestBody ClassInfo classInfo) {
        return classInfoService.addClass(classInfo);
    }

    // 更新班级
    @PutMapping("/{id}")
    public ResponseEntity<ClassInfo> updateClass(@PathVariable String id, @RequestBody ClassInfo classInfo) {
        classInfo.setId(id);
        ClassInfo updatedClass = classInfoService.updateClass(classInfo);
        if (updatedClass != null) {
            return ResponseEntity.ok(updatedClass);
        }
        return ResponseEntity.notFound().build();
    }

    // 删除班级
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable String id) {
        classInfoService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }
}