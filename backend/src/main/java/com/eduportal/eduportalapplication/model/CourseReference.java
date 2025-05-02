package com.eduportal.eduportalapplication.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "course_references")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseReference {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "contentful_id", nullable = false, unique = true)
    private String contentfulId;

    @Column(nullable = false)
    private String title;

    @Column
    private boolean published = false;

    @Column
    private boolean featured = false;

    @OneToMany(mappedBy = "course")
    private Set<SectionReference> sectionReferences = new HashSet<>();

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "course_tags",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public void addSection(SectionReference section) {
        sectionReferences.add(section);
        section.setCourse(this);
    }

    public void removeSection(SectionReference section) {
        sectionReferences.remove(section);
        section.setCourse(null);
    }

    public void addTag(Tag tag) {
        tags.add(tag);
        tag.getCourses().add(this);
    }

    public void removeTag(Tag tag) {
        tags.remove(tag);
        tag.getCourses().remove(this);
    }
}

