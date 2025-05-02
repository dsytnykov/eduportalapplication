package com.eduportal.eduportalapplication.repository;


import com.eduportal.eduportalapplication.model.LessonReference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LessonReferenceRepository extends JpaRepository<LessonReference, UUID> {

    List<LessonReference> findBySectionIdOrderByOrderIndexAsc(UUID sectionId);

    Optional<LessonReference> findByContentfulId(String contentfulId);

    @Query("SELECT l FROM LessonReference l WHERE l.section.id = :sectionId AND l.orderIndex > :currentOrderIndex ORDER BY l.orderIndex ASC")
    Optional<LessonReference> findNextLesson(@Param("sectionId") UUID sectionId, @Param("currentOrderIndex") Integer currentOrderIndex);

    @Query("SELECT l FROM LessonReference l WHERE l.section.id = :sectionId AND l.orderIndex < :currentOrderIndex ORDER BY l.orderIndex DESC")
    Optional<LessonReference> findPreviousLesson(@Param("sectionId") UUID sectionId, @Param("currentOrderIndex") Integer currentOrderIndex);

    @Query("SELECT COUNT(l) FROM LessonReference l WHERE l.section.id = :sectionId")
    int countLessonsByCourseId(@Param("sectionId") UUID sectionId);
}

