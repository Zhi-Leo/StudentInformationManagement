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

    public ClassInfoController(ClassInfoService classInfoService) {
        this.classInfoService = classInfoService;
    }

    // 获取所有班级
    @GetMapping
    public ResponseEntity<List<ClassInfo>> getAllClasses() {
        List<ClassInfo> classes = classInfoService.getAllClasses();
        return ResponseEntity.ok(classes);
    }

    // 添加班级
    @PostMapping
    public ResponseEntity<ClassInfo> addClass(@RequestBody ClassInfo classInfo) {
        ClassInfo savedClass = classInfoService.addClass(classInfo);
        return ResponseEntity.ok(savedClass);
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

    // 更新单个班级的学生数量
    @PutMapping("/{id}/updateStudentCount")
    public ResponseEntity<ClassInfo> updateClassStudentCount(@PathVariable String id) {
        ClassInfo updatedClass = classInfoService.updateClassStudentCount(id);
        if (updatedClass != null) {
            return ResponseEntity.ok(updatedClass);
        }
        return ResponseEntity.notFound().build();
    }

    // 更新所有班级的学生数量
    @PutMapping("/updateAllStudentCounts")
    public ResponseEntity<Void> updateAllClassStudentCounts() {
        classInfoService.updateAllClassStudentCounts();
        return ResponseEntity.noContent().build();
    }
}