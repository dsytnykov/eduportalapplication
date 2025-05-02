package com.eduportal.eduportalapplication.service;

import com.contentful.java.cda.CDAArray;
import com.contentful.java.cda.CDAClient;
import com.contentful.java.cda.CDAEntry;
import com.contentful.java.cda.CDAResource;
import com.eduportal.eduportalapplication.model.CourseReference;
import com.eduportal.eduportalapplication.model.LessonReference;
import com.eduportal.eduportalapplication.model.SectionReference;
import com.eduportal.eduportalapplication.model.Tag;
import com.eduportal.eduportalapplication.repository.CourseReferenceRepository;
import com.eduportal.eduportalapplication.repository.LessonReferenceRepository;
import com.eduportal.eduportalapplication.repository.SectionReferenceRepository;
import com.eduportal.eduportalapplication.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContentfulSyncService {

    private final CDAClient contentfulClient;
    private final CourseReferenceRepository courseRepository;
    private final SectionReferenceRepository sectionRepository;
    private final LessonReferenceRepository lessonRepository;
    private final TagRepository tagRepository;
    private final CacheManager cacheManager;

    @Scheduled(cron = "${contentful.sync.cron}")
    @Transactional
    public void synchronizeContent() {
        log.info("Starting Contentful content synchronization");

        try {
            CDAArray courseEntries = contentfulClient.fetch(CDAEntry.class)
                    .withContentType("course")
                    .include(3) // Include 3 levels of linked entries (course -> sections -> lessons)
                    .all();

            log.info("Fetched {} courses from Contentful", courseEntries.items().size());

            for (CDAResource resource : courseEntries.items()) {
                if (resource instanceof CDAEntry) {
                    synchronizeCourse((CDAEntry) resource);
                }
            }
            clearCaches();
            log.info("Contentful synchronization completed successfully");
        } catch (Exception e) {
            log.error("Error during Contentful synchronization: {}", e.getMessage(), e);
        }
    }

    @Transactional
    public Map<String, Object> triggerSync() {
        int newCourses = 0;
        int updatedCourses = 0;

        try {
            CDAArray courseEntries = contentfulClient.fetch(CDAEntry.class)
                    .withContentType("course")
                    .include(3)
                    .all();

            log.info("Fetched {} courses from Contentful", courseEntries.items().size());

            for (CDAResource resource : courseEntries.items()) {
                if (resource instanceof CDAEntry courseEntry) {
                    String contentfulId = courseEntry.id();

                    boolean exists = courseRepository.findByContentfulId(contentfulId).isPresent();
                    synchronizeCourse(courseEntry);

                    if (exists) {
                        updatedCourses++;
                    } else {
                        newCourses++;
                    }
                }
            }
            clearCaches();
            return Map.of(
                    "success", true,
                    "newCourses", newCourses,
                    "updatedCourses", updatedCourses,
                    "totalProcessed", newCourses + updatedCourses
            );
        } catch (Exception e) {
            log.error("Error during Contentful synchronization: {}", e.getMessage(), e);
            return Map.of(
                    "success", false,
                    "error", e.getMessage()
            );
        }
    }

    @Transactional
    protected void synchronizeCourse(CDAEntry courseEntry) {
        String contentfulId = courseEntry.id();
        String title = courseEntry.getField("title");
        Boolean published = courseEntry.getField("published");
        Boolean featured = courseEntry.getField("featured");

        CourseReference courseRef = courseRepository.findByContentfulId(contentfulId)
                .orElse(new CourseReference());
        courseRef.setContentfulId(contentfulId);
        courseRef.setTitle(title);
        courseRef.setPublished(published != null && published);
        courseRef.setFeatured(featured != null && featured);
        courseRef = courseRepository.save(courseRef);

        processCourseTags(courseRef, courseEntry);
        processSections(courseRef, courseEntry);
    }

    @Transactional
    protected void processCourseTags(CourseReference courseRef, CDAEntry courseEntry) {
        List<String> tagNames = courseEntry.getField("tags");

        if (tagNames != null && !tagNames.isEmpty()) {
            courseRef.getTags().clear();
            for (String tagName : tagNames) {
                Tag tag = tagRepository.findByNameIgnoreCase(tagName)
                        .orElseGet(() -> {
                            Tag newTag = new Tag();
                            newTag.setName(tagName);
                            return tagRepository.save(newTag);
                        });

                courseRef.addTag(tag);
            }

            courseRepository.save(courseRef);
        }
    }

    @Transactional
    protected void processSections(CourseReference courseRef, CDAEntry courseEntry) {
        List<CDAEntry> sectionEntries = courseEntry.getField("sections");

        if (sectionEntries != null) {
            Map<String, SectionReference> existingSections = new HashMap<>();
            for (SectionReference section : courseRef.getSectionReferences()) {
                existingSections.put(section.getContentfulId(), section);
            }
            for (int i = 0; i < sectionEntries.size(); i++) {
                CDAEntry sectionEntry = sectionEntries.get(i);
                String sectionContentfulId = sectionEntry.id();
                String sectionTitle = sectionEntry.getField("title");

                SectionReference sectionRef = existingSections.containsKey(sectionContentfulId)
                        ? existingSections.get(sectionContentfulId)
                        : new SectionReference();

                sectionRef.setContentfulId(sectionContentfulId);
                sectionRef.setTitle(sectionTitle);
                sectionRef.setOrderIndex(i);
                sectionRef.setCourse(courseRef);
                sectionRef = sectionRepository.save(sectionRef);

                processLessons(sectionRef, sectionEntry);
            }

            Set<String> currentSectionIds = new HashSet<>();
            for (CDAEntry sectionEntry : sectionEntries) {
                currentSectionIds.add(sectionEntry.id());
            }

            courseRef.getSectionReferences().removeIf(section ->
                    !currentSectionIds.contains(section.getContentfulId()));

            courseRepository.save(courseRef);
        }
    }

    @Transactional
    protected void processLessons(SectionReference sectionRef, CDAEntry sectionEntry) {
        List<CDAEntry> lessonEntries = sectionEntry.getField("lessons");

        if (lessonEntries != null) {
            Map<String, LessonReference> existingLessons = new HashMap<>();
            for (LessonReference lesson : sectionRef.getLessonReferences()) {
                existingLessons.put(lesson.getContentfulId(), lesson);
            }
            for (int i = 0; i < lessonEntries.size(); i++) {
                CDAEntry lessonEntry = lessonEntries.get(i);
                String lessonContentfulId = lessonEntry.id();
                String lessonTitle = lessonEntry.getField("title");

                LessonReference lessonRef = existingLessons.containsKey(lessonContentfulId)
                        ? existingLessons.get(lessonContentfulId)
                        : new LessonReference();

                lessonRef.setContentfulId(lessonContentfulId);
                lessonRef.setTitle(lessonTitle);
                lessonRef.setOrderIndex(i);
                lessonRef.setSection(sectionRef);

                lessonRepository.save(lessonRef);
            }

            Set<String> currentLessonIds = new HashSet<>();
            for (CDAEntry lessonEntry : lessonEntries) {
                currentLessonIds.add(lessonEntry.id());
            }

            sectionRef.getLessonReferences().removeIf(lesson ->
                    !currentLessonIds.contains(lesson.getContentfulId()));

            sectionRepository.save(sectionRef);
        }
    }

    private void clearCaches() {
        cacheManager.getCacheNames().forEach(cacheName -> {
            log.debug("Clearing cache: {}", cacheName);
            Objects.requireNonNull(cacheManager.getCache(cacheName)).clear();
        });
    }
}

