package com.example.student_management.controller;

import com.example.student_management.entity.Student;
import com.example.student_management.service.ClassInfoService;
import com.example.student_management.service.StudentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {
    private static final Logger logger = LoggerFactory.getLogger(StudentController.class); // 新增日志，便于排查问题

    @Autowired
    private StudentService studentService;
    @Autowired
    private ClassInfoService classInfoService;

    // 获取所有学生（不变）

//    @GetMapping
//    public List<Student> getAllStudents() {
//        return studentService.getAllStudents();
//    }
@GetMapping
public Page<Student> getStudents(
        @RequestParam(defaultValue = "0") int page,  // 页码（从0开始）
        @RequestParam(defaultValue = "10") int size, // 每页条数
        @RequestParam(required = false) String name  // 可选搜索条件
) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());

    if (name != null && !name.isEmpty()) {
        return studentService.findByNameContaining(name, pageable);
    } else {
        return studentService.findAll(pageable);
    }
}

    // 根据 ID 获取学生（不变）
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable String id) {
        Student student = studentService.getStudentById(id);
        if (student != null) {
            return new ResponseEntity<>(student, HttpStatus.OK);
        } else {
            logger.warn("查询学生失败：ID={} 不存在", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 添加学生（优化：补充classId判空）
    @PostMapping
    public ResponseEntity<Student> addStudent(@RequestBody Student student) {
        Student savedStudent = studentService.addStudent(student);
        // 仅当班级ID非空时，才更新班级人数
        if (savedStudent.getClas() != null && !savedStudent.getClas().trim().isEmpty()) {
            classInfoService.updateClassStudentCount(savedStudent.getClas());
        } else {
            logger.warn("新增学生未分配班级，跳过班级人数更新：学生ID={}", savedStudent.getId());
        }
        return new ResponseEntity<>(savedStudent, HttpStatus.CREATED);
    }

    // 更新学生（优化：补充classId判空+旧班级人数回滚）
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable String id, @RequestBody Student student) {
        student.setId(id);
        // 1. 查询旧学生信息（用于更新旧班级的人数）
        Student oldStudent = studentService.getStudentById(id);
        Student updatedStudent = studentService.updateStudent(student);

        if (updatedStudent != null) {
            // 2. 若学生班级有变更，先更新旧班级的人数
            if (oldStudent != null && oldStudent.getClas() != null && !oldStudent.getClas().trim().isEmpty()) {
                classInfoService.updateClassStudentCount(oldStudent.getClas());
            }
            // 3. 再更新新班级的人数（判空处理）
            if (updatedStudent.getClas() != null && !updatedStudent.getClas().trim().isEmpty()) {
                classInfoService.updateClassStudentCount(updatedStudent.getClas());
            } else {
                logger.warn("更新后学生未分配班级，跳过新班级人数更新：学生ID={}", updatedStudent.getId());
            }
            return new ResponseEntity<>(updatedStudent, HttpStatus.OK);
        } else {
            logger.warn("更新学生失败：ID={} 不存在", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 删除学生（核心修复：调整顺序+classId判空）
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable String id) {
        // 1. 先查询学生（确认存在）
        Student student = studentService.getStudentById(id);
        if (student == null) {
            logger.warn("删除学生失败：ID={} 不存在", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // 2. 先删除学生（关键：删除后再更新人数，确保统计准确）
        studentService.deleteStudent(id);
        logger.info("删除学生成功：ID={}，姓名={}", id, student.getName());

        // 3. 仅当班级ID非空时，更新班级人数（避免空ID报错）
        String classId = student.getClas();
        if (classId != null && !classId.trim().isEmpty()) {
            classInfoService.updateClassStudentCount(classId);
            logger.info("更新班级人数：班级ID={}，学生ID={}", classId, id);
        } else {
            logger.warn("删除的学生未分配班级，跳过班级人数更新：学生ID={}", id);
        }

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}