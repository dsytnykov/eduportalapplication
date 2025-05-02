# Educational Portal Frontend

This is the React frontend for the Educational Portal application, designed to connect with the backend service that integrates with Contentful for content management and Firebase for authentication and user progress tracking.

## Features

- **User Authentication**: Sign up, login, and profile management
- **Course Browsing**: View all courses, filter by tags, and search
- **Course Details**: View course descriptions, structure, and track progress
- **Lesson Viewing**: Access lesson content with rich text and code blocks
- **Progress Tracking**: Mark lessons as complete and track course progress
- **Note Taking**: Create, edit, and organize notes for any lesson
- **Responsive Design**: Fully responsive UI that works on mobile, tablet, and desktop

## Tech Stack

- **React**: Frontend library for building user interfaces
- **React Router**: For navigation and routing
- **Firebase**: Authentication and real-time database
- **Contentful**: Content management and delivery
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Axios**: HTTP client for API requests
- **FontAwesome**: Icon library
- **Prism.js**: Syntax highlighting for code blocks

## Project Structure

```
edu-portal-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── common/      # Generic components like buttons, headers, etc.
│   │   ├── sections/    # Section-related components
│   │   ├── courses/     # Course listing and details components
│   │   ├── lessons/     # Lesson viewing components
│   │   └── notes/       # Note-taking components
│   ├── contexts/        # React contexts for state management
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API service functions
│   ├── pages/           # Page components
│   ├── App.js           # Main app component
│   └── index.js         # Application entry point
└── package.json         # Dependencies and scripts
```

## Setup and Configuration

### Prerequisites

- Node.js and npm
- Firebase project
- Backend service running (see backend README)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
REACT_APP_FIREBASE_DATABASE_URL=your-firebase-database-url
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Building for Production

```bash
npm run build
```

This creates a production-ready build in the `build` directory.

## Deployment

The frontend can be deployed to various hosting services:

- **Firebase Hosting**: Fast and secure hosting with Firebase
- **Netlify**: Easy deployment with continuous integration
- **Vercel**: Optimized for React applications
- **AWS S3 + CloudFront**: Scalable and cost-effective hosting

## Connection with Backend

The frontend connects to the backend through the API service functions in the `services` directory. These functions use Axios to make HTTP requests to the backend API endpoints.

Authentication with the backend is handled automatically by adding the Firebase ID token to the Authorization header of each request.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request
