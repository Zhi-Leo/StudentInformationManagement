package com.example.student_management.controller;

import com.example.student_management.entity.ClassInfo;
import com.example.student_management.service.ClassInfoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin(origins = "*")
public class ClassInfoController {

    // 只保留ClassInfoService的构造器注入（删除错误的ClassService）
    private final ClassInfoService classInfoService;

    public ClassInfoController(ClassInfoService classInfoService) {
        this.classInfoService = classInfoService;
    }

    // 删除重复的@GetMapping（旧的获取所有班级的方法）

    // 分页查询班级列表（修正类名引用）
    @GetMapping
    public Page<ClassInfo> getClasses(  // 此处修改为Page<ClassInfo>
                                        @RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "10") int size,
                                        @RequestParam(required = false) String className
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());

        if (className != null && !className.isEmpty()) {
            // 调用ClassInfoService的分页查询方法（确保Service中已实现）
            return classInfoService.findByClassNameContaining(className, pageable);
        } else {
            return classInfoService.findAll(pageable);  // 确保Service中已实现
        }
    }

    // 以下方法保持不变（已正确使用ClassInfo）
    @PostMapping
    public ResponseEntity<ClassInfo> addClass(@RequestBody ClassInfo classInfo) {
        ClassInfo savedClass = classInfoService.addClass(classInfo);
        return ResponseEntity.ok(savedClass);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassInfo> updateClass(@PathVariable String id, @RequestBody ClassInfo classInfo) {
        classInfo.setId(id);
        ClassInfo updatedClass = classInfoService.updateClass(classInfo);
        if (updatedClass != null) {
            return ResponseEntity.ok(updatedClass);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable String id) {
        classInfoService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/updateStudentCount")
    public ResponseEntity<ClassInfo> updateClassStudentCount(@PathVariable String id) {
        ClassInfo updatedClass = classInfoService.updateClassStudentCount(id);
        if (updatedClass != null) {
            return ResponseEntity.ok(updatedClass);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/updateAllStudentCounts")
    public ResponseEntity<Void> updateAllClassStudentCounts() {
        classInfoService.updateAllClassStudentCounts();
        return ResponseEntity.noContent().build();
    }
}