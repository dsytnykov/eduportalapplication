-- Course references table - stores minimal metadata and Contentful references
CREATE TABLE IF NOT EXISTS course_references (
    id UUID PRIMARY KEY,
    contentful_id VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    published BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                             );

-- Section references table - stores minimal metadata and Contentful references
CREATE TABLE IF NOT EXISTS section_references (
    id UUID PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES course_references(id) ON DELETE CASCADE,
    contentful_id VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                                                                                                               );

-- Lesson references table - stores minimal metadata and Contentful references
CREATE TABLE IF NOT EXISTS lesson_references (
    id UUID PRIMARY KEY,
    section_id UUID NOT NULL REFERENCES section_references(id) ON DELETE CASCADE,
    contentful_id VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                                                                                                                );

-- Tags are still useful to maintain locally for filtering
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                             );

-- Junction table for many-to-many relationship between courses and tags
CREATE TABLE IF NOT EXISTS course_tags (
    course_id UUID NOT NULL REFERENCES course_references(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, tag_id)
    );

-- User notes - stored locally but tied to Firebase user IDs
CREATE TABLE IF NOT EXISTS user_notes (
    id UUID PRIMARY KEY,
    firebase_user_id VARCHAR(128) NOT NULL,
    contentful_entry_id VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                             );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_section_refs_course_id ON section_references(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_refs_section_id ON lesson_references(section_id);
CREATE INDEX IF NOT EXISTS idx_course_refs_published ON course_references(published);
CREATE INDEX IF NOT EXISTS idx_course_refs_featured ON course_references(published, featured) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_user_notes_firebase_user_id ON user_notes(firebase_user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_contentful_entry_id ON user_notes(contentful_entry_id);
CREATE INDEX IF NOT EXISTS idx_course_tags_course_id ON course_tags(course_id);
CREATE INDEX IF NOT EXISTS idx_course_tags_tag_id ON course_tags(tag_id);
