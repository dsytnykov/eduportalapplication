package com.eduportal.eduportalapplication.service;

import com.eduportal.eduportalapplication.dto.UserNoteDto;
import com.eduportal.eduportalapplication.exception.ResourceNotFoundException;
import com.eduportal.eduportalapplication.model.UserNote;
import com.eduportal.eduportalapplication.repository.UserNoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserNoteService {

    private final UserNoteRepository userNoteRepository;

    public List<UserNoteDto> getUserNotes(String userId) {
        List<UserNote> notes = userNoteRepository.findByFirebaseUserId(userId);
        return notes.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<UserNoteDto> getUserNotesForEntry(String userId, String contentfulEntryId) {
        List<UserNote> notes = userNoteRepository.findByFirebaseUserIdAndContentfulEntryId(userId, contentfulEntryId);
        return notes.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public UserNoteDto getNoteById(UUID id, String userId) {
        UserNote note = userNoteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note", "id", id));

        if (!note.getFirebaseUserId().equals(userId)) {
            throw new SecurityException("User is not authorized to access this note");
        }

        return mapToDto(note);
    }

    @Transactional
    public UserNoteDto createNote(String userId, String contentfulEntryId, String content) {
        UserNote note = new UserNote();
        note.setFirebaseUserId(userId);
        note.setContentfulEntryId(contentfulEntryId);
        note.setContent(content);

        UserNote savedNote = userNoteRepository.save(note);
        return mapToDto(savedNote);
    }

    @Transactional
    public UserNoteDto updateNote(UUID id, String userId, String content) {
        UserNote note = userNoteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note", "id", id));

        if (!note.getFirebaseUserId().equals(userId)) {
            throw new SecurityException("User is not authorized to update this note");
        }

        note.setContent(content);
        UserNote updatedNote = userNoteRepository.save(note);
        return mapToDto(updatedNote);
    }

    @Transactional
    public void deleteNote(UUID id, String userId) {
        UserNote note = userNoteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note", "id", id));

        if (!note.getFirebaseUserId().equals(userId)) {
            throw new SecurityException("User is not authorized to delete this note");
        }

        userNoteRepository.delete(note);
    }

    private UserNoteDto mapToDto(UserNote note) {
        return UserNoteDto.builder()
                .id(note.getId())
                .contentfulEntryId(note.getContentfulEntryId())
                .content(note.getContent())
                .createdAt(note.getCreatedAt())
                .updatedAt(note.getUpdatedAt())
                .build();
    }
}

