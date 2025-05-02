package com.eduportal.eduportalapplication.service;

import com.eduportal.eduportalapplication.dto.CourseProgressDto;
import com.eduportal.eduportalapplication.dto.SectionProgressDto;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.database.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class FirebaseService {

    private final FirebaseAuth firebaseAuth;
    private final FirebaseDatabase firebaseDatabase;

    /**
     * Verify a Firebase JWT token and extract the user ID.
     */
    public String verifyToken(String token) throws FirebaseAuthException {
        FirebaseToken decodedToken = firebaseAuth.verifyIdToken(token);
        return decodedToken.getUid();
    }

    /**
     * Mark a section as complete for a user.
     */
    public void markSectionComplete(String userId, String courseId, String sectionId) {
        DatabaseReference progressRef = firebaseDatabase.getReference()
                .child("progress")
                .child(userId)
                .child(courseId)
                .child(sectionId);

        Map<String, Object> updateData = new HashMap<>();
        updateData.put("completed", true);
        updateData.put("completedAt", ServerValue.TIMESTAMP);

        progressRef.updateChildren(updateData, (error, ref) -> {
            if (error != null) {
                log.error("Error marking lesson as complete: {}", error.getMessage());
            } else {
                log.debug("Successfully marked lesson {} as complete for user {}", "lessonId", userId);
            }
        });
    }

    /**
     * Check if a specific section is completed by a user.
     */
    public CompletableFuture<Boolean> isSectionCompleted(String userId, String courseId, String sectionId) {
        DatabaseReference sectionRef = firebaseDatabase.getReference()
                .child("progress")
                .child(userId)
                .child(courseId)
                .child(sectionId)
                .child("completed");

        CompletableFuture<Boolean> future = new CompletableFuture<>();

        sectionRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                Boolean completed = snapshot.exists() ? snapshot.getValue(Boolean.class) : false;
                future.complete(completed != null && completed);
            }

            @Override
            public void onCancelled(DatabaseError error) {
                log.error("Error checking section completion: {}", error.getMessage());
                future.complete(false);
            }
        });

        return future;
    }

    /**
     * Get the overall course progress for a user.
     */
    public CompletableFuture<CourseProgressDto> getUserCourseProgress(String userId, String courseId) {
        DatabaseReference progressRef = firebaseDatabase.getReference()
                .child("progress")
                .child(userId)
                .child(courseId);

        CompletableFuture<CourseProgressDto> future = new CompletableFuture<>();

        progressRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                CourseProgressDto progress = processProgressData(snapshot, courseId);
                future.complete(progress);
            }

            @Override
            public void onCancelled(DatabaseError error) {
                log.error("Error fetching progress: {}", error.getMessage());
                future.completeExceptionally(new RuntimeException("Error fetching progress: " + error.getMessage()));
            }
        });

        return future;
    }

    /**
     * Process Firebase data into a CourseProgressDto.
     */
    private CourseProgressDto processProgressData(DataSnapshot snapshot, String courseId) {
        Map<String, SectionProgressDto> sectionProgresses = new HashMap<>();
        int totalSections = 0;
        int completedSections = 0;

        for (DataSnapshot sectionSnapshot : snapshot.getChildren()) {
            totalSections++;

            String sectionId = sectionSnapshot.getKey();
            Boolean completed = false;
            Long completedAt = 0L;

            if (sectionSnapshot.hasChild("completed")) {
                completed = sectionSnapshot.child("completed").getValue(Boolean.class);
                if (completed != null && completed) {
                    completedSections++;
                    if (sectionSnapshot.hasChild("completedAt")) {
                        completedAt = sectionSnapshot.child("completedAt").getValue(Long.class);
                    }
                }
            }

            SectionProgressDto sectionProgress = SectionProgressDto.builder()
                    .sectionId(sectionId)
                    .completed(completed != null && completed)
                    .completedAt(completedAt != null ? completedAt : 0L)
                    .build();

            sectionProgresses.put(sectionId, sectionProgress);
        }

        double progressPercentage = totalSections > 0
                ? ((double) completedSections / totalSections) * 100
                : 0;

        return CourseProgressDto.builder()
                .courseId(java.util.UUID.fromString(courseId))
                .totalSections(totalSections)
                .completedSections(completedSections)
                .progressPercentage(progressPercentage)
                .sectionProgresses(sectionProgresses)
                .build();
    }
}

