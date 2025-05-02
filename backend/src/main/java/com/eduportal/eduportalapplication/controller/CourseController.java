package com.eduportal.eduportalapplication.controller;

import com.eduportal.eduportalapplication.dto.CourseDto;
import com.eduportal.eduportalapplication.dto.SectionDto;
import com.eduportal.eduportalapplication.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<List<CourseDto>> getAllCourses() {
        List<CourseDto> courses = courseService.getAllPublishedCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<CourseDto>> getFeaturedCourses() {
        List<CourseDto> courses = courseService.getFeaturedCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDto> getCourseById(@PathVariable UUID id) {
        String userId = getCurrentUserId();
        CourseDto course = courseService.getCourseById(id, userId);
        return ResponseEntity.ok(course);
    }

    @GetMapping("/tag/{tagName}")
    public ResponseEntity<List<CourseDto>> getCoursesByTag(@PathVariable String tagName) {
        List<CourseDto> courses = courseService.getCoursesByTag(tagName);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{courseId}/sections")
    public ResponseEntity<List<SectionDto>> getCourseSections(@PathVariable UUID courseId) {
        String userId = getCurrentUserId();
        CourseDto course = courseService.getCourseById(courseId, userId);
        return ResponseEntity.ok(course.getSections());
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() &&
                !authentication.getPrincipal().equals("anonymousUser")) {
            return authentication.getName();
        }
        return null;
    }
}

