package com.example.student_management.service;

import com.example.student_management.entity.ClassInfo;
import com.example.student_management.repository.ClassInfoRepository;
import com.example.student_management.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ClassInfoService {
    private static final Logger logger = LoggerFactory.getLogger(ClassInfoService.class);
    private final ClassInfoRepository classInfoRepository; // 统一使用ClassInfoRepository
    private final StudentRepository studentRepository;

    // 构造器注入（无需额外@Autowired）
    public ClassInfoService(ClassInfoRepository classInfoRepository, StudentRepository studentRepository) {
        this.classInfoRepository = classInfoRepository;
        this.studentRepository = studentRepository;
    }

    // 【修正1】分页查询所有班级（返回Page<ClassInfo>，使用classInfoRepository）
    public Page<ClassInfo> findAll(Pageable pageable) {
        return classInfoRepository.findAll(pageable);
    }

    // 【修正2】带条件的分页查询（按班级名称模糊查询）
    public Page<ClassInfo> findByClassNameContaining(String className, Pageable pageable) {
        return classInfoRepository.findByNameContaining(className, pageable);
    }

    // 获取所有班级（保留，供需要全量数据的场景）
    public List<ClassInfo> getAllClasses() {
        return classInfoRepository.findAll();
    }

    // 添加班级
    public ClassInfo addClass(ClassInfo classInfo) {
        return classInfoRepository.save(classInfo);
    }

    // 更新班级（按ID）
    public ClassInfo updateClass(ClassInfo classInfo) {
        if (classInfoRepository.existsById(classInfo.getId())) {
            return classInfoRepository.save(classInfo);
        }
        logger.warn("更新班级失败：ID={} 不存在", classInfo.getId());
        return null;
    }

    // 删除班级（按ID）
    public void deleteClass(String id) {
        logger.info("收到删除班级请求，ID: {}", id);
        try {
            classInfoRepository.deleteById(id);
            logger.info("班级删除成功，ID: {}", id);
        } catch (Exception e) {
            logger.error("班级删除失败，ID: {}", id, e);
            throw new RuntimeException("班级删除失败：" + e.getMessage(), e);
        }
    }

    // 更新所有班级的学生数量（基于班级名称）
    public void updateAllClassStudentCounts() {
        try {
            logger.info("开始更新所有班级的学生数量（基于名称）");

            // 1. 按班级名称统计学生数量（s.clas是学生表中的班级名称字段）
            List<StudentRepository.ClassStudentCount> classStudentCounts = studentRepository.countStudentsByClass();

            // 2. 转换为Map：key=班级名称，value=学生数量
            Map<String, Long> studentCountMap = classStudentCounts.stream()
                    .collect(Collectors.toMap(
                            StudentRepository.ClassStudentCount::getClassName,
                            StudentRepository.ClassStudentCount::getStudentCount
                    ));

            // 3. 遍历所有班级，按名称匹配并更新人数
            List<ClassInfo> allClasses = classInfoRepository.findAll();
            for (ClassInfo classInfo : allClasses) {
                String className = classInfo.getName(); // 班级名称（ClassInfo的name字段）
                Long studentCount = studentCountMap.getOrDefault(className, 0L);
                classInfo.setStudentCount(studentCount.intValue());
                classInfoRepository.save(classInfo);
                logger.info("班级【{}】人数更新为: {}", className, studentCount);
            }

            logger.info("所有班级学生数量更新完成");
        } catch (Exception e) {
            logger.error("更新班级学生数量失败", e);
            throw new RuntimeException("更新班级学生数量失败：" + e.getMessage(), e);
        }
    }

    // 更新单个班级的学生数量（基于班级名称）
    public ClassInfo updateClassStudentCount(String className) {
        if (className == null || className.trim().isEmpty()) {
            logger.warn("更新班级人数失败：班级名称为null或空字符串");
            return null;
        }

        try {
            // 1. 按班级名称统计学生数量（clas是学生表的字段）
            long studentCount = studentRepository.countByClas(className);
            logger.debug("统计班级人数：班级名称={}，人数={}", className, studentCount);

            // 2. 按班级名称查询班级（ClassInfoRepository需实现findByName方法）
            ClassInfo classInfo = classInfoRepository.findByName(className).orElse(null);
            if (classInfo != null) {
                classInfo.setStudentCount((int) studentCount);
                ClassInfo updatedClass = classInfoRepository.save(classInfo);
                logger.debug("更新班级人数成功：班级名称={}，新人数={}", className, studentCount);
                return updatedClass;
            } else {
                logger.warn("更新班级人数失败：班级名称={} 不存在", className);
                return null;
            }
        } catch (Exception e) {
            logger.error("更新班级人数异常：班级名称={}", className, e);
            throw new RuntimeException("更新班级人数异常：" + e.getMessage(), e);
        }
    }
}