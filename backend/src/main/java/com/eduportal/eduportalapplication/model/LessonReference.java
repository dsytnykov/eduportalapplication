package com.eduportal.eduportalapplication.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "lesson_references")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LessonReference {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "section_id", nullable = false)
    private SectionReference section;

    @Column(name = "contentful_id", nullable = false, unique = true)
    private String contentfulId;

    @Column(nullable = false)
    private String title;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}

