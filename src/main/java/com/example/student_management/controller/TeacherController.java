package com.example.student_management.controller;

import com.example.student_management.entity.ApiResponse;
import com.example.student_management.entity.Teacher;
import com.example.student_management.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(origins = "*") // 允许所有域名的跨域请求
public class TeacherController {
    @Autowired
    private TeacherService teacherService;

    // 获取所有教师
    // 分页查询教师列表
    @GetMapping
    public ResponseEntity<ApiResponse<Page<Teacher>>> getTeachers(
            @RequestParam(defaultValue = "0") int page, // 页码（从0开始）
            @RequestParam(defaultValue = "10") int size, // 每页条数
            @RequestParam(required = false) String name // 可选：按教师姓名搜索
    ) {
        // 按教师ID升序排序（可根据需求修改）
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());

        Page<Teacher> teachers;
        if (name != null && !name.isEmpty()) {
            teachers = teacherService.findByNameContaining(name, pageable);
        } else {
            teachers = teacherService.findAll(pageable);
        }
        return ResponseEntity.ok(ApiResponse.success(teachers));
    }

    // 添加教师
    @PostMapping
    public ResponseEntity<ApiResponse<Teacher>> addTeacher(@RequestBody Teacher teacher) {
        Teacher savedTeacher = teacherService.addTeacher(teacher);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("教师添加成功", savedTeacher));
    }

    // 更新教师
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Teacher>> updateTeacher(@PathVariable String id, @RequestBody Teacher teacher) {
        teacher.setId(id);
        Teacher updatedTeacher = teacherService.updateTeacher(teacher);
        if (updatedTeacher != null) {
            return ResponseEntity.ok(ApiResponse.success("教师更新成功", updatedTeacher));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.fail(404, "教师不存在"));
        }
    }

    // 删除教师
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteTeacher(@PathVariable String id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.success("教师删除成功"));
    }
}