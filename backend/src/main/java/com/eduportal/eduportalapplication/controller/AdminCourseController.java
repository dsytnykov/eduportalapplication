package com.eduportal.eduportalapplication.controller;

import com.contentful.java.cda.CDAEntry;
import com.eduportal.eduportalapplication.model.CourseReference;
import com.eduportal.eduportalapplication.model.Tag;
import com.eduportal.eduportalapplication.repository.CourseReferenceRepository;
import com.eduportal.eduportalapplication.repository.TagRepository;
import com.eduportal.eduportalapplication.service.ContentfulService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin/courses")
public class AdminCourseController {

    private final ContentfulService contentfulService;
    private final CourseReferenceRepository courseRepository;
    private final TagRepository tagRepository;

    public AdminCourseController(ContentfulService contentfulService,
                                 CourseReferenceRepository courseRepository,
                                 TagRepository tagRepository) {
        this.contentfulService = contentfulService;
        this.courseRepository = courseRepository;
        this.tagRepository = tagRepository;
    }

    @PostMapping("/sync/{contentfulId}")
    public ResponseEntity<?> syncCourse(@PathVariable String contentfulId) {
        CDAEntry courseEntry = contentfulService.getCourse(contentfulId);
        if (courseEntry == null) {
            return ResponseEntity.notFound().build();
        }
        Optional<CourseReference> existingCourse = courseRepository.findByContentfulId(contentfulId);

        CourseReference courseRef;
        if (existingCourse.isPresent()) {
            courseRef = existingCourse.get();
        } else {
            courseRef = new CourseReference();
            courseRef.setContentfulId(contentfulId);
        }

        String title = courseEntry.getField("title");
        Boolean published = courseEntry.getField("published");
        Boolean featured = courseEntry.getField("featured");

        courseRef.setTitle(title);
        courseRef.setPublished(published != null && published);
        courseRef.setFeatured(featured != null && featured);
        courseRef = courseRepository.save(courseRef);

        List<String> tags = courseEntry.getField("tags");
        if (tags != null && !tags.isEmpty()) {
            courseRef.getTags().clear();
            for (String tagName : tags) {
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

        return ResponseEntity.ok(Map.of(
                "message", "Course synchronized successfully",
                "courseId", courseRef.getId()
        ));
    }

    @PostMapping("/sync-all")
    public ResponseEntity<?> syncAllCourses() {
        List<CDAEntry> courses = contentfulService.getAllPublishedCourses();
        int count = 0;

        for (CDAEntry courseEntry : courses) {
            String contentfulId = courseEntry.id();
            Optional<CourseReference> existingCourse = courseRepository.findByContentfulId(contentfulId);

            CourseReference courseRef;
            if (existingCourse.isPresent()) {
                courseRef = existingCourse.get();
            } else {
                courseRef = new CourseReference();
                courseRef.setContentfulId(contentfulId);
                count++;
            }

            String title = courseEntry.getField("title");
            Boolean published = courseEntry.getField("published");
            Boolean featured = courseEntry.getField("featured");

            courseRef.setTitle(title);
            courseRef.setPublished(published != null && published);
            courseRef.setFeatured(featured != null && featured);

            courseRepository.save(courseRef);
        }

        return ResponseEntity.ok(Map.of(
                "message", "All courses synchronized successfully",
                "newCoursesAdded", count,
                "totalCourses", courses.size()
        ));
    }
}
