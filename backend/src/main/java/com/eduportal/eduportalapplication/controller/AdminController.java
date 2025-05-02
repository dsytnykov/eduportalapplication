package com.eduportal.eduportalapplication.controller;

import com.eduportal.eduportalapplication.service.ContentfulSyncService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final ContentfulSyncService contentfulSyncService;

    public AdminController(ContentfulSyncService contentfulSyncService) {
        this.contentfulSyncService = contentfulSyncService;
    }

    @PostMapping("/sync-content")
    public ResponseEntity<?> syncContent() {
        Map<String, Object> result = contentfulSyncService.triggerSync();
        return ResponseEntity.ok(result);
    }
}
