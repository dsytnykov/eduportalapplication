package com.eduportal.eduportalapplication.repository;

import com.eduportal.eduportalapplication.model.UserNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserNoteRepository extends JpaRepository<UserNote, UUID> {

    List<UserNote> findByFirebaseUserId(String firebaseUserId);

    List<UserNote> findByFirebaseUserIdAndContentfulEntryId(String firebaseUserId, String contentfulEntryId);
}

