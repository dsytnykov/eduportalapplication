package com.eduportal.eduportalapplication.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDto {
    private UUID id;
    private String contentfulId;
    private String title;
    private String description;
    private JsonNode content;
    private boolean published;
    private boolean featured;
    private List<SectionDto> sections;
    private Set<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer totalSections;
    private Integer completedSections;
}
