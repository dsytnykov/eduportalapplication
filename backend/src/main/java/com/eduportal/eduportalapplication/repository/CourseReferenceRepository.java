package com.eduportal.eduportalapplication.repository;

import com.eduportal.eduportalapplication.model.CourseReference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseReferenceRepository extends JpaRepository<CourseReference, UUID> {

    List<CourseReference> findByPublishedTrue();

    List<CourseReference> findByPublishedTrueAndFeaturedTrue();

    Optional<CourseReference> findByContentfulId(String contentfulId);

    @Query("SELECT c FROM CourseReference c JOIN c.tags t WHERE t.name = :tagName AND c.published = true")
    List<CourseReference> findPublishedCoursesByTagName(@Param("tagName") String tagName);
}

