package com.eduportal.eduportalapplication.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "section_references")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SectionReference {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private CourseReference course;

    @Column(name = "contentful_id", nullable = false, unique = true)
    private String contentfulId;

    @Column(nullable = false)
    private String title;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @OneToMany(mappedBy = "section")
    private List<LessonReference> lessonReferences = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public void addLesson(LessonReference lesson) {
        lessonReferences.add(lesson);
        lesson.setSection(this);
    }

    public void removeLesson(LessonReference lesson) {
        lessonReferences.remove(lesson);
        lesson.setSection(null);
    }
}

