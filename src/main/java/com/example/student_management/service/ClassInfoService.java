package com.example.student_management.service;

import com.example.student_management.entity.ClassInfo;
import com.example.student_management.repository.ClassInfoRepository;
import com.example.student_management.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ClassInfoService {
    private static final Logger logger = LoggerFactory.getLogger(ClassInfoService.class);
    private final ClassInfoRepository classInfoRepository;
    private final StudentRepository studentRepository;

    public ClassInfoService(ClassInfoRepository classInfoRepository, StudentRepository studentRepository) {
        this.classInfoRepository = classInfoRepository;
        this.studentRepository = studentRepository;
    }

    // 获取所有班级
    public List<ClassInfo> getAllClasses() {
        return classInfoRepository.findAll();
    }

    // 添加班级
    public ClassInfo addClass(ClassInfo classInfo) {
        return classInfoRepository.save(classInfo);
    }

    // 更新班级
    public ClassInfo updateClass(ClassInfo classInfo) {
        if (classInfoRepository.existsById(classInfo.getId())) {
            return classInfoRepository.save(classInfo);
        }
        return null;
    }

    // 删除班级
    public void deleteClass(String id) {
        logger.info("收到删除班级请求，ID: {}", id);
        try {
            classInfoRepository.deleteById(id);
            logger.info("班级删除成功，ID: {}", id);
        } catch (Exception e) {
            logger.error("班级删除失败，ID: {}", id, e);
        }
    }

    // 更新所有班级的学生数量
    public void updateAllClassStudentCounts() {
        try {
            logger.info("开始更新所有班级的学生数量");

            // 获取每个班级的学生数量
            List<StudentRepository.ClassStudentCount> classStudentCounts = studentRepository.countStudentsByClass();

            // 转换为Map以便快速查找
            Map<String, Long> studentCountMap = classStudentCounts.stream()
                    .collect(Collectors.toMap(
                            StudentRepository.ClassStudentCount::getClassId,
                            StudentRepository.ClassStudentCount::getStudentCount
                    ));

            // 获取所有班级
            List<ClassInfo> allClasses = classInfoRepository.findAll();

            // 更新每个班级的学生数量
            for (ClassInfo classInfo : allClasses) {
                String classId = classInfo.getId();
                Long studentCount = studentCountMap.getOrDefault(classId, 0L);
                classInfo.setStudentCount(studentCount.intValue());
                classInfoRepository.save(classInfo);
                logger.info("班级 {} ({} 班) 人数更新为: {}", classId, classInfo.getName(), studentCount);
            }

            logger.info("所有班级学生数量更新完成");
        } catch (Exception e) {
            logger.error("更新班级学生数量失败", e);
            throw new RuntimeException("更新班级学生数量失败", e);
        }
    }

    // 更新单个班级的学生数量
    public ClassInfo updateClassStudentCount(String classId) {
        int studentCount = studentRepository.countByClas(classId);
        ClassInfo classInfo = classInfoRepository.findById(classId).orElse(null);
        if (classInfo != null) {
            classInfo.setStudentCount(studentCount);
            return classInfoRepository.save(classInfo);
        }
        return null;
    }
}