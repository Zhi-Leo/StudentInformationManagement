package com.example.student_management.service;

import com.example.student_management.entity.ClassInfo;
import com.example.student_management.repository.ClassInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ClassInfoService {
    @Autowired
    private static final Logger logger = LoggerFactory.getLogger(ClassInfoService.class);
    private final ClassInfoRepository classInfoRepository;

    public ClassInfoService(ClassInfoRepository classInfoRepository) {
        this.classInfoRepository = classInfoRepository;
    }

    @Transactional // 确保操作原子性
    public ClassInfo saveClass(ClassInfo classInfo) {
        logger.info("尝试添加班级: {}", classInfo);

        // 1. 手动检查ID是否存在（可选，增强校验）
        if (classInfoRepository.existsById(classInfo.getId())) {
            logger.error("班级ID已存在: {}", classInfo.getId());
            throw new IllegalArgumentException("班级ID已存在");
        }

        try {
            // 2. 执行保存操作
            return classInfoRepository.save(classInfo);
        } catch (DataIntegrityViolationException e) {
            // 3. 捕获数据库约束冲突（如主键重复）
            logger.error("数据库约束冲突，班级ID: {}", classInfo.getId(), e);
            throw new RuntimeException("班级ID已存在或数据格式错误");
        } catch (Exception e) {
            // 4. 捕获其他异常
            logger.error("保存班级失败: {}", classInfo.getId(), e);
            throw new RuntimeException("服务器内部错误，请重试");
        }
    }
    // 获取所有班级
    public List<ClassInfo> getAllClasses() {
        return classInfoRepository.findAll();
    }

    // 根据 ID 获取班级
    public ClassInfo getClassById(String id) {
        Optional<ClassInfo> optional = classInfoRepository.findById(id);
        return optional.orElse(null);
    }

    // 添加班级
    public ClassInfo addClass(ClassInfo classInfo) {
        return classInfoRepository.save(classInfo);
    }

    // 更新班级
    public ClassInfo updateClass(ClassInfo classInfo) {
        logger.info("更新班级 - 检查班级是否存在，ID: {}", classInfo.getId());
        if (classInfoRepository.existsById(classInfo.getId())) {
            logger.info("更新班级 - 班级存在，保存更新信息: {}", classInfo);
            return classInfoRepository.save(classInfo);
        }
        logger.info("更新班级 - 班级不存在，ID: {}", classInfo.getId());
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
}