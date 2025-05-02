package com.eduportal.eduportalapplication.controller;

import com.eduportal.eduportalapplication.dto.LessonDto;
import com.eduportal.eduportalapplication.dto.SectionDto;
import com.eduportal.eduportalapplication.service.CourseService;
import com.eduportal.eduportalapplication.service.FirebaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/courses/{courseId}/sections/{sectionId}/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final CourseService courseService;
    private final FirebaseService firebaseService;

    @GetMapping
    public ResponseEntity<SectionDto> getSectionLessons(
            @PathVariable UUID courseId,
            @PathVariable UUID sectionId) {

        String userId = getCurrentUserId();
        SectionDto section = courseService.getSectionById(sectionId, userId);
        return ResponseEntity.ok(section);
    }

    @GetMapping("/{lessonId}")
    public ResponseEntity<LessonDto> getLessonById(
            @PathVariable UUID courseId,
            @PathVariable UUID sectionId,
            @PathVariable UUID lessonId) {

        String userId = getCurrentUserId();
        LessonDto lesson = courseService.getLessonById(lessonId, userId);
        return ResponseEntity.ok(lesson);
    }

    /**
     * This endpoint now marks the entire section as complete instead of an individual lesson.
     * This maintains backward compatibility while using the new section-based progress tracking.
     */
    @PostMapping("/{lessonId}/complete")
    public ResponseEntity<?> markLessonComplete(
            @PathVariable UUID courseId,
            @PathVariable UUID sectionId,
            @PathVariable UUID lessonId) {

        String userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).body("Authentication required");
        }

        firebaseService.markSectionComplete(userId, courseId.toString(), sectionId.toString());
        return ResponseEntity.ok().build();
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