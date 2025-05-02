package com.eduportal.eduportalapplication.repository;

import com.eduportal.eduportalapplication.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TagRepository extends JpaRepository<Tag, UUID> {

    Optional<Tag> findByNameIgnoreCase(String name);

    @Query("SELECT t FROM Tag t JOIN t.courses c WHERE c.id = :courseId")
    List<Tag> findByCourseId(@Param("courseId") UUID courseId);
}

