/*
 Navicat Premium Dump SQL

 Source Server         : 笔记本
 Source Server Type    : MySQL
 Source Server Version : 90300 (9.3.0)
 Source Host           : 192.168.5.37:3306
 Source Schema         : student

 Target Server Type    : MySQL
 Target Server Version : 90300 (9.3.0)
 File Encoding         : 65001

 Date: 15/01/2026 15:06:08
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for administrator
-- ----------------------------
DROP TABLE IF EXISTS `administrator`;
CREATE TABLE `administrator`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `uid` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `upass` varchar(128) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of administrator
-- ----------------------------
INSERT INTO `administrator` VALUES (1, '1', '1');
INSERT INTO `administrator` VALUES (2, 'root', 'root');
INSERT INTO `administrator` VALUES (7, 'a2222', '200212d');

-- ----------------------------
-- Table structure for class_info
-- ----------------------------
DROP TABLE IF EXISTS `class_info`;
CREATE TABLE `class_info`  (
  `id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `headTeacher` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `studentCount` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of class_info
-- ----------------------------
INSERT INTO `class_info` VALUES ('001', '21 软件工程 B1 班', '未设置', 6);
INSERT INTO `class_info` VALUES ('002', '22 软件工程 B1 班', '未设置', 11);
INSERT INTO `class_info` VALUES ('003', '23 软件工程 B1 班', '未设置', 6);
INSERT INTO `class_info` VALUES ('004', '24 软件工程 B1 班', '未设置', 0);

-- ----------------------------
-- Table structure for student
-- ----------------------------
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `clas` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `age` int NULL DEFAULT NULL,
  `sex` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `grade` double NULL DEFAULT NULL,
  `class_info_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `class_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of student
-- ----------------------------
INSERT INTO `student` VALUES ('2024200005', '李浩然', '22 软件工程 B1 班', 25, '男', 81.4, NULL, NULL);
INSERT INTO `student` VALUES ('2023200007', '吴明宇', '22 软件工程 B1 班', 20, '男', 73.2, NULL, NULL);
INSERT INTO `student` VALUES ('2025200008', '郑嘉怡', '22 软件工程 B1 班', 24, '女', 88.9, NULL, NULL);
INSERT INTO `student` VALUES ('2022200009', '徐梓豪', '22 软件工程 B1 班', 16, '男', 68.7, NULL, NULL);
INSERT INTO `student` VALUES ('2024200010', '孙雨桐', '23 软件工程 B1 班', 25, '女', 99.2, NULL, NULL);
INSERT INTO `student` VALUES ('2021200011', '赵宇航', '21 软件工程 B1 班', 19, '男', 77.5, NULL, NULL);
INSERT INTO `student` VALUES ('2023200012', '钱诗涵', '23 软件工程 B1 班', 21, '女', 84.1, NULL, NULL);
INSERT INTO `student` VALUES ('2025200013', '孙浩然', '22 软件工程 B1 班', 22, '男', 91.3, NULL, NULL);
INSERT INTO `student` VALUES ('2022200014', '李梦琪', '22 软件工程 B1 班', 18, '女', 70.8, NULL, NULL);
INSERT INTO `student` VALUES ('2024200015', '周宇轩', '21 软件工程 B1 班', 20, '男', 86.4, NULL, NULL);
INSERT INTO `student` VALUES ('2023200017', '郑子豪', '23 软件工程 B1 班', 23, '男', 75.6, NULL, NULL);
INSERT INTO `student` VALUES ('2022200019', '陈嘉俊', '22 软件工程 B1 班', 16, '男', 63.3, NULL, NULL);
INSERT INTO `student` VALUES ('2024200020', '林雨彤', '22 软件工程 B1 班', 19, '女', 97.5, NULL, NULL);
INSERT INTO `student` VALUES ('2025200023', '许浩然', '23 软件工程 B1 班', 18, '男', 85, NULL, NULL);
INSERT INTO `student` VALUES ('2022200024', '杨雨欣', '22 软件工程 B1 班', 20, '女', 93.6, NULL, NULL);
INSERT INTO `student` VALUES ('2024200025', '郭宇航', '21 软件工程 B1 班', 17, '男', 71.4, NULL, NULL);
INSERT INTO `student` VALUES ('2021200026', '何佳怡', '21 软件工程 B1 班', 25, '女', 98.8, NULL, NULL);
INSERT INTO `student` VALUES ('2023200027', '罗子豪', '23 软件工程 B1 班', 19, '男', 69.5, NULL, NULL);
INSERT INTO `student` VALUES ('2025200028', '邓雨桐', '22 软件工程 B1 班', 23, '女', 87.3, NULL, NULL);
INSERT INTO `student` VALUES ('2022200029', '宋浩然', '22 软件工程 B1 班', 16, '男', 74.9, NULL, NULL);
INSERT INTO `student` VALUES ('2024200030', '唐欣怡', '21 软件工程 B1 班', 24, '女', 96.1, NULL, NULL);
INSERT INTO `student` VALUES ('2023200022', '刘思涵', '23 软件工程 B1 班', 22, '女', 79.7, NULL, NULL);
INSERT INTO `student` VALUES ('2021200021', '张昊天', '21 软件工程 B1 班', 21, '男', 82.2, NULL, NULL);

-- ----------------------------
-- Table structure for teacher
-- ----------------------------
DROP TABLE IF EXISTS `teacher`;
CREATE TABLE `teacher`  (
  `id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `age` int NULL DEFAULT NULL,
  `sex` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `teaching` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `clas` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id` DESC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of teacher
-- ----------------------------
INSERT INTO `teacher` VALUES ('2020187006', '赵老师', 31, '男', '学术指导', '21 软件工程 B1 班');
INSERT INTO `teacher` VALUES ('2020187003', '张老师', 30, '女', '学科辅导', '22 软件工程 B1 班');
INSERT INTO `teacher` VALUES ('2020180001', '雷老师', 28, '女', '日语', '21 软件工程 B1 班');
INSERT INTO `teacher` VALUES ('2019102125', '徐老师', 22, '女', '离散数学', '22 软件工程 B1 班');

SET FOREIGN_KEY_CHECKS = 1;
