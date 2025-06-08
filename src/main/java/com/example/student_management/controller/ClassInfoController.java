package com.example.student_management.controller;

import com.example.student_management.entity.ClassInfo;
import com.example.student_management.service.ClassInfoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/classes")
public class ClassInfoController {
    private static final Logger logger = LoggerFactory.getLogger(ClassInfoController.class);
    @Autowired
    private ClassInfoService classInfoService;


    // 获取所有班级
    @GetMapping
    public ResponseEntity<List<ClassInfo>> getAllClasses() {
        List<ClassInfo> classes = classInfoService.getAllClasses();
        return new ResponseEntity<>(classes, HttpStatus.OK);
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

    @PostMapping
    public ResponseEntity<?> addClass(@RequestBody ClassInfo classInfo) {
        try {
            ClassInfo savedClass = classInfoService.saveClass(classInfo);
            logger.info("班级添加成功: {}", savedClass);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "success", true,
                    "message", "班级添加成功",
                    "data", savedClass
            ));
        } catch (IllegalArgumentException e) {
            // ID已存在
            logger.warn("添加班级失败: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        } catch (RuntimeException e) {
            // 其他业务异常
            logger.error("添加班级失败: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
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
        logger.info("Received delete class request for ID: {}", id);
        classInfoService.deleteClass(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}