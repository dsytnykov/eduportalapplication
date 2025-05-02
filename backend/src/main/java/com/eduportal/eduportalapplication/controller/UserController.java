package com.eduportal.eduportalapplication.controller;

import com.eduportal.eduportalapplication.dto.CourseProgressDto;
import com.eduportal.eduportalapplication.service.FirebaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final FirebaseService firebaseService;

    @GetMapping("/progress/{courseId}")
    public CompletableFuture<ResponseEntity<CourseProgressDto>> getUserCourseProgress(@PathVariable UUID courseId) {
        String userId = getCurrentUserId();
        if (userId == null) {
            return CompletableFuture.completedFuture(ResponseEntity.status(401).body(null));
        }

        return firebaseService.getUserCourseProgress(userId, courseId.toString())
                .thenApply(ResponseEntity::ok)
                .exceptionally(ex -> {
                    return ResponseEntity.status(500).body(null);
                });
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

