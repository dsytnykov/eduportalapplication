package com.eduportal.eduportalapplication.controller;

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
@RequestMapping("/courses/{courseId}/sections")
@RequiredArgsConstructor
public class SectionController {

    private final CourseService courseService;
    private final FirebaseService firebaseService;

    @GetMapping("/{sectionId}")
    public ResponseEntity<SectionDto> getSectionById(
            @PathVariable UUID courseId,
            @PathVariable UUID sectionId) {

        String userId = getCurrentUserId();
        SectionDto section = courseService.getSectionById(sectionId, userId);
        return ResponseEntity.ok(section);
    }

    @PostMapping("/{sectionId}/complete")
    public ResponseEntity<?> markSectionComplete(
            @PathVariable UUID courseId,
            @PathVariable UUID sectionId) {

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
