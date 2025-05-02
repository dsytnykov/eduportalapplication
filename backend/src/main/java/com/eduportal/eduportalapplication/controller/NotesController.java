package com.eduportal.eduportalapplication.controller;

import com.eduportal.eduportalapplication.dto.UserNoteDto;
import com.eduportal.eduportalapplication.service.UserNoteService;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/notes")
@RequiredArgsConstructor
public class NotesController {

    private final UserNoteService userNoteService;

    @GetMapping
    public ResponseEntity<List<UserNoteDto>> getUserNotes() {
        String userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).body(null);
        }

        List<UserNoteDto> notes = userNoteService.getUserNotes(userId);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/entry/{contentfulEntryId}")
    public ResponseEntity<List<UserNoteDto>> getUserNotesForEntry(@PathVariable String contentfulEntryId) {
        String userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).body(null);
        }

        List<UserNoteDto> notes = userNoteService.getUserNotesForEntry(userId, contentfulEntryId);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserNoteDto> getNoteById(@PathVariable UUID id) {
        String userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).body(null);
        }

        try {
            UserNoteDto note = userNoteService.getNoteById(id, userId);
            return ResponseEntity.ok(note);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<UserNoteDto> createNote(@Valid @RequestBody CreateNoteRequest request) {
        String userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).body(null);
        }

        UserNoteDto note = userNoteService.createNote(
                userId,
                request.getContentfulEntryId(),
                request.getContent());

        return ResponseEntity.status(HttpStatus.CREATED).body(note);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserNoteDto> updateNote(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateNoteRequest request) {

        String userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).body(null);
        }

        try {
            UserNoteDto note = userNoteService.updateNote(id, userId, request.getContent());
            return ResponseEntity.ok(note);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable UUID id) {
        String userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).body(null);
        }

        try {
            userNoteService.deleteNote(id, userId);
            return ResponseEntity.noContent().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(null);
        }
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() &&
                !authentication.getPrincipal().equals("anonymousUser")) {
            return authentication.getName();
        }
        return null;
    }

    @Setter
    @Getter
    public static class CreateNoteRequest {
        private String contentfulEntryId;
        private String content;

    }

    @Setter
    @Getter
    public static class UpdateNoteRequest {
        private String content;

    }
}

