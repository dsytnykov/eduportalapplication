package com.eduportal.eduportalapplication.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseProgressDto {
    private UUID courseId;
    private int totalSections;
    private int completedSections;
    private double progressPercentage;
    private Map<String, SectionProgressDto> sectionProgresses;
}

