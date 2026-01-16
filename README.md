# 学生信息管理系统 (Student Information Management System)

一个基于 Spring Boot 和 MySQL 的简单学生信息管理系统，用于管理学生、教师和班级信息。

## 功能特点

*   **学生管理**: 添加、编辑、删除和查询学生信息。
*   **教师管理**: 添加、编辑、删除和查询教师信息。
*   **班级管理**: 添加、编辑、删除和查询班级信息，并关联班主任。
*   **数据校验**: 对输入的数据（如年龄、成绩）进行合法性校验。
*   **响应式界面**: 使用 Tailwind CSS 构建，适配不同屏幕尺寸。

## 技术栈

*   **后端**:
    *   Java 17+
    *   Spring Boot 3.5.0
    *   Spring Data JPA
    *   MySQL
*   **前端**:
    *   HTML5
    *   JavaScript
    *   Tailwind CSS
    *   Font Awesome

## 快速开始

### 前提条件

*   JDK 17 或更高版本
*   Maven 3.6+ 或使用 IDE 内置的 Maven
*   MySQL 8.0 或更高版本

### 安装步骤

1.  **克隆仓库**

    ```bash
    git clone https://github.com/your-username/student-management-system.git
    cd student-management-system
    ```

2.  **配置数据库**

    创建一个名为 `student_management` 的 MySQL 数据库。
    打开 `src/main/resources/application.properties` 文件，修改以下配置以匹配你的数据库设置：

    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/student_management?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    spring.datasource.username=root
    spring.datasource.password=your-password
    ```

3.  **构建并运行**

    使用 Maven 命令：

    ```bash
    mvn spring-boot:run
    ```

    或者，你也可以在 IDE（如 IntelliJ IDEA, Eclipse）中直接运行 `StudentManagementApplication.java` 的 main 方法。

4.  **访问系统**

    启动成功后，在浏览器中访问：

    ```
    http://localhost:8080
    ```

    系统会自动跳转到登录页面。

### 使用说明

登录：系统启动后，默认需要登录。（注：实际项目中应实现真实的用户认证，当前版本可能仅做了简单的前端模拟）。
学生管理：在导航栏点击 “学生管理”，可以查看、添加、编辑或删除学生信息。
教师管理：在导航栏点击 “教师管理”，可以查看、添加、编辑或删除教师信息。
班级管理：在导航栏点击 “班级管理”，可以查看、添加、编辑或删除班级信息，并为班级分配班主任。

## 项目结构

```bash
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── example/
│   │           └── student_management/
│   │               ├── StudentManagementApplication.java  # 应用程序入口类
│   │               ├── controller/    # Spring MVC 控制器层
│   │               │   ├── ClassInfoController.java        # 班级信息控制器
│   │               │   ├── LoginController.java            # 登录控制器
│   │               │   ├── RegisterController.java         # 注册控制器
│   │               │   ├── StudentController.java          # 学生信息控制器
│   │               │   └── TeacherController.java          # 教师信息控制器
│   │               ├── entity/        # JPA 实体类层
│   │               │   ├── Administrator.java              # 管理员实体
│   │               │   ├── ApiResponse.java                # API响应统一格式
│   │               │   ├── ClassInfo.java                  # 班级信息实体
│   │               │   ├── Student.java                    # 学生信息实体
│   │               │   └── Teacher.java                    # 教师信息实体
│   │               ├── repository/    # Spring Data JPA 仓库接口层
│   │               │   ├── AdministratorRepository.java     # 管理员数据访问接口
│   │               │   ├── ClassInfoRepository.java         # 班级数据访问接口
│   │               │   ├── StudentRepository.java           # 学生数据访问接口
│   │               │   └── TeacherRepository.java           # 教师数据访问接口
│   │               ├── security/      # 安全配置层
│   │               │   ├── JwtAuthenticationFilter.java     # JWT认证过滤器
│   │               │   └── SecurityConfig.java              # Spring Security配置
│   │               ├── service/       # 业务逻辑层
│   │               │   ├── AdministratorService.java        # 管理员服务
│   │               │   ├── ClassInfoService.java            # 班级服务
│   │               │   ├── PasswordEncoderService.java      # 密码加密服务
│   │               │   ├── StudentService.java              # 学生服务
│   │               │   └── TeacherService.java              # 教师服务
│   │               └── util/          # 工具类层
│   │                   └── JwtUtil.java                     # JWT工具类
│   └── resources/                     # 资源文件
│       ├── static/                    # 前端静态资源
│       │   ├── favicon.ico            # 网站图标
│       │   ├── pink-sweater-girl.jpg  # 页面图片资源
│       │   ├── ponytail-girl.jpg      # 页面图片资源
│       │   ├── css/                   # 样式文件目录
│       │   │   ├── all.css            # 整合所有样式
│       │   │   ├── index.css          # 首页样式
│       │   │   └── style.css          # 公共样式
│       │   ├── html/                  # HTML页面目录
│       │   │   ├── class.html         # 班级管理页面
│       │   │   ├── index.html         # 首页
│       │   │   ├── login.html         # 登录页面
│       │   │   ├── student.html       # 学生管理页面
│       │   │   └── teacher.html       # 教师管理页面
│       │   └── js/                    # JavaScript文件目录
│       │       ├── class.js           # 班级管理脚本
│       │       ├── index.js           # 首页脚本
│       │       ├── login.js           # 登录页面脚本
│       │       ├── student.js         # 学生管理脚本
│       │       ├── style.js           # 样式相关脚本
│       │       ├── teacher.js         # 教师管理脚本
│       │       ├── components/        # 组件目录
│       │       ├── modules/           # 模块目录
│       │       ├── services/          # 服务目录
│       │       │   └── apiService.js  # API服务封装
│       │       └── utils/             # 工具函数目录
│       │           ├── auth.js        # 认证相关工具
│       │           └── notification.js # 通知相关工具
│       └── application.properties     # 应用配置文件
└── test/                              # 单元测试代码
```