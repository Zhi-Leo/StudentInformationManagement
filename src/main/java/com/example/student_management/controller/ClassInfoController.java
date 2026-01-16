package com.example.student_management.controller;

import com.example.student_management.entity.ApiResponse;
import com.example.student_management.entity.ClassInfo;
import com.example.student_management.service.ClassInfoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<ApiResponse<Page<ClassInfo>>> getClasses(  // 此处修改为Page<ClassInfo>
                                        @RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "10") int size,
                                        @RequestParam(required = false) String className
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());

        Page<ClassInfo> classes;
        if (className != null && !className.isEmpty()) {
            // 调用ClassInfoService的分页查询方法（确保Service中已实现）
            classes = classInfoService.findByClassNameContaining(className, pageable);
        } else {
            classes = classInfoService.findAll(pageable);  // 确保Service中已实现
        }
        return ResponseEntity.ok(ApiResponse.success(classes));
    }

    // 以下方法保持不变（已正确使用ClassInfo）
    @PostMapping
    public ResponseEntity<ApiResponse<ClassInfo>> addClass(@RequestBody ClassInfo classInfo) {
        ClassInfo savedClass = classInfoService.addClass(classInfo);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("班级添加成功", savedClass));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClassInfo>> updateClass(@PathVariable String id, @RequestBody ClassInfo classInfo) {
        classInfo.setId(id);
        ClassInfo updatedClass = classInfoService.updateClass(classInfo);
        if (updatedClass != null) {
            return ResponseEntity.ok(ApiResponse.success("班级更新成功", updatedClass));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.fail(404, "班级不存在"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteClass(@PathVariable String id) {
        classInfoService.deleteClass(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.success("班级删除成功"));
    }

    @PutMapping("/{id}/updateStudentCount")
    public ResponseEntity<ApiResponse<ClassInfo>> updateClassStudentCount(@PathVariable String id) {
        ClassInfo updatedClass = classInfoService.updateClassStudentCount(id);
        if (updatedClass != null) {
            return ResponseEntity.ok(ApiResponse.success("班级人数更新成功", updatedClass));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.fail(404, "班级不存在"));
    }

    @PutMapping("/updateAllStudentCounts")
    public ResponseEntity<ApiResponse<String>> updateAllClassStudentCounts() {
        classInfoService.updateAllClassStudentCounts();
        return ResponseEntity.ok(ApiResponse.success("所有班级人数更新成功"));
    }
}