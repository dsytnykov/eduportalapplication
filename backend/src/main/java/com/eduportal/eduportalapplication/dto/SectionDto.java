package com.eduportal.eduportalapplication.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SectionDto {
    private UUID id;
    private String contentfulId;
    private String title;
    private JsonNode content;
    private Integer orderIndex;
    private List<LessonDto> lessons;
    private LocalDateTime createdAt;
    private UUID courseId;
    private boolean completed;
    private SectionNavigation prevSection;
    private SectionNavigation nextSection;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SectionNavigation {
        private UUID id;
        private String title;
    }
}

