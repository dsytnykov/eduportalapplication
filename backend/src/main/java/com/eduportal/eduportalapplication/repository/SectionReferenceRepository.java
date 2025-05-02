package com.eduportal.eduportalapplication.repository;

import com.eduportal.eduportalapplication.model.SectionReference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SectionReferenceRepository extends JpaRepository<SectionReference, UUID> {

    List<SectionReference> findByCourseIdOrderByOrderIndexAsc(UUID courseId);

    Optional<SectionReference> findByContentfulId(String contentfulId);
}

