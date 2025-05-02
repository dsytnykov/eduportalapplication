# Educational Portal Backend

This is the backend service for the Educational Portal, implementing a streamlined approach that leverages Contentful for content management and Firebase for authentication and user progress tracking.

## Architecture Overview

The backend follows a layered architecture:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Implement business logic and integration with external services
- **Repositories**: Manage data access to the PostgreSQL database
- **Models**: Define the data structure

The application integrates with:
- **Contentful CMS**: For educational content management
- **Firebase**: For authentication and user progress tracking
- **PostgreSQL**: For storing reference data and user-generated content

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- PostgreSQL 12 or higher
- Contentful account with API keys
- Firebase project with configuration

## Configuration

### Database Setup

1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE eduportal;
   ```

2. The application will automatically create the required tables using the schema.sql file when it starts with `spring.jpa.hibernate.ddl-auto=validate`.

### Contentful Setup

1. Create a Contentful space with the following content models:
    - Course
    - Section
    - Lesson

2. Get your Contentful Space ID and Access Token.

### Firebase Setup

1. Create a Firebase project
2. Set up Firebase Authentication
3. Set up Firebase Realtime Database
4. Generate a service account key file

### Application Properties

Configure the application by setting the following environment variables:

```
CONTENTFUL_SPACE_ID=your_contentful_space_id
CONTENTFUL_ACCESS_TOKEN=your_contentful_access_token
CONTENTFUL_ENVIRONMENT=master
FIREBASE_SERVICE_ACCOUNT_PATH=path/to/firebase-service-account.json
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

## Running the Application

### Using Maven

```bash
mvn spring-boot:run
```

### Using Java

```bash
mvn clean package
java -jar target/edu-portal-backend-0.0.1-SNAPSHOT.jar
```

### Using Docker

```bash
# Build the Docker image
docker build -t edu-portal-backend .

# Run the container
docker run -p 8080:8080 \
  -e CONTENTFUL_SPACE_ID=your_contentful_space_id \
  -e CONTENTFUL_ACCESS_TOKEN=your_contentful_access_token \
  -e FIREBASE_SERVICE_ACCOUNT_PATH=/app/firebase-service-account.json \
  -e FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com \
  -v path/to/firebase-service-account.json:/app/firebase-service-account.json \
  edu-portal-backend
```

## API Endpoints

### Courses

- `GET /api/courses` - List all published courses
- `GET /api/courses/featured` - List featured courses
- `GET /api/courses/{id}` - Get course details
- `GET /api/courses/tag/{tagName}` - Get courses by tag

### Sections & Lessons

- `GET /api/courses/{courseId}/sections` - List sections for a course
- `GET /api/courses/{courseId}/sections/{sectionId}` - Get section details with lessons
- `GET /api/courses/{courseId}/sections/{sectionId}/lessons/{lessonId}` - Get lesson details
- `POST /api/courses/{courseId}/sections/{sectionId}/lessons/{lessonId}/complete` - Mark lesson as complete

### User Notes

- `GET /api/notes` - Get all notes for the current user
- `GET /api/notes/entry/{contentfulEntryId}` - Get notes for a specific content entry
- `GET /api/notes/{id}` - Get a specific note
- `POST /api/notes` - Create a new note
- `PUT /api/notes/{id}` - Update a note
- `DELETE /api/notes/{id}` - Delete a note

### User Progress

- `GET /api/user/progress/{courseId}` - Get user progress for a course

## Security

The application uses Firebase JWT tokens for authentication. To access protected endpoints:

1. Authenticate with Firebase on the client side
2. Get the JWT token
3. Include the token in the Authorization header:
   ```
   Authorization: Bearer your-firebase-jwt-token
   ```

## Caching

The application uses Caffeine cache to improve performance:

- Course content is cached for 30 minutes
- Section content is cached for 30 minutes
- Lesson content is cached for 30 minutes

## Synchronization with Contentful

The application automatically synchronizes content with Contentful every hour. You can adjust the synchronization interval by changing the `contentful.sync.cron` property.
