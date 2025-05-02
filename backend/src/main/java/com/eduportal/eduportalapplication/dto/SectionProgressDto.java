package com.eduportal.eduportalapplication.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SectionProgressDto {
    private String sectionId;
    private boolean completed;
    private long completedAt;
}
