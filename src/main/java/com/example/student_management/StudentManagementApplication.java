package com.example.student_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class StudentManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentManagementApplication.class, args);
        System.out.println("(♥◠‿◠)ﾉﾞ  学生信息管理系统启动成功   ლ(´ڡ`ლ)ﾞ  \n" +
                "_      ______  ____    \n"+
                "| |    |  ____|/ __ \\    \n"+
                "| |    | |__  | |  | |     \n"+
                "| |    |  __| | |  | |     \n"+
                "| |___ | |____| |__| |     \n"+
                "|_____||______|\\____/    \n");
    }

    @Bean
    public WebMvcConfigurer forwardToIndex() {
        return new WebMvcConfigurer() {
            @Override
            public void addViewControllers(ViewControllerRegistry registry) {
                // 使用forward前缀直接转发到静态资源
                registry.addViewController("/").setViewName("forward:/html/login.html");
            }

            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                // 确保静态资源能够被正确访问
                registry.addResourceHandler("/**")
                        .addResourceLocations("classpath:/static/")
                        .setCachePeriod(0); // 开发环境禁用缓存
            }
        };
    }
}