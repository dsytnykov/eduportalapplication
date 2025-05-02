package com.eduportal.eduportalapplication.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonDto {
    private UUID id;
    private String contentfulId;
    private String title;
    private JsonNode content;
    private Integer orderIndex;
    private UUID sectionId;
    private LocalDateTime createdAt;
    private boolean completed;
    private LessonNavigation prevLesson;
    private LessonNavigation nextLesson;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LessonNavigation {
        private UUID id;
        private String title;
    }
}

