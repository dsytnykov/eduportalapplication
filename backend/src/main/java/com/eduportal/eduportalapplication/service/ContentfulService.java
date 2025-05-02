package com.eduportal.eduportalapplication.service;


import com.contentful.java.cda.CDAArray;
import com.contentful.java.cda.CDAClient;
import com.contentful.java.cda.CDAEntry;
import com.eduportal.eduportalapplication.exception.ResourceNotFoundException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContentfulService {

    private final CDAClient contentfulClient;
    private final ObjectMapper objectMapper;

    @Cacheable(value = "courses", key = "#contentfulId")
    public CDAEntry getCourse(String contentfulId) {
        try {
            return contentfulClient.fetch(CDAEntry.class)
                    .where("sys.id", contentfulId)
                    .include(3)
                    .one(contentfulId);
        } catch (Exception e) {
            log.error("Error fetching course from Contentful: {}", e.getMessage());
            throw new ResourceNotFoundException("Course", "contentfulId", contentfulId);
        }
    }

    @Cacheable(value = "sections", key = "#contentfulId")
    public CDAEntry getSection(String contentfulId) {
        try {
            return contentfulClient.fetch(CDAEntry.class)
                    .where("sys.id", contentfulId)
                    .include(2)
                    .one(contentfulId);
        } catch (Exception e) {
            log.error("Error fetching section from Contentful: {}", e.getMessage());
            throw new ResourceNotFoundException("Section", "contentfulId", contentfulId);
        }
    }

    @Cacheable(value = "lessons", key = "#contentfulId")
    public CDAEntry getLesson(String contentfulId) {
        try {
            return contentfulClient.fetch(CDAEntry.class)
                    .where("sys.id", contentfulId)
                    .include(1)
                    .one(contentfulId);
        } catch (Exception e) {
            log.error("Error fetching lesson from Contentful: {}", e.getMessage());
            throw new ResourceNotFoundException("Lesson", "contentfulId", contentfulId);
        }
    }

    public List<CDAEntry> getAllPublishedCourses() {
        CDAArray array = contentfulClient.fetch(CDAEntry.class)
                .withContentType("course")
                .where("fields.published", String.valueOf(true))
                .include(1)
                .all();

        List<CDAEntry> courses = new ArrayList<>();
        array.items().forEach(item -> {
            if (item instanceof CDAEntry) {
                courses.add((CDAEntry) item);
            }
        });

        return courses;
    }

    public List<CDAEntry> searchCourses(String query) {
        CDAArray array = contentfulClient.fetch(CDAEntry.class)
                .withContentType("course")
                .where("fields.published", String.valueOf(true))
                .where("query", query)
                .include(1)
                .all();

        List<CDAEntry> courses = new ArrayList<>();
        array.items().forEach(item -> {
            if (item instanceof CDAEntry) {
                courses.add((CDAEntry) item);
            }
        });

        return courses;
    }

    public JsonNode entryToJsonNode(CDAEntry entry) {
        return objectMapper.valueToTree(entry.rawFields());
    }

    public JsonNode getEntryContent(CDAEntry entry, String fieldName) {
        Map<String, Object> fields = entry.rawFields();
        if (fields.containsKey(fieldName)) {
            return objectMapper.valueToTree(fields.get(fieldName));
        }
        return null;
    }
}

