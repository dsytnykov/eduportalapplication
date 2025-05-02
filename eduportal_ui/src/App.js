import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { NotesProvider } from "./contexts/NotesContext";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Loader from "./components/common/Loader";
import PrivateRoute from "./components/common/PrivateRoute";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faGraduationCap,
  faChartLine,
  faNoteSticky,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

library.add(faGraduationCap, faChartLine, faNoteSticky, faArrowRight);

const HomePage = React.lazy(() => import("./pages/HomePage"));
const CoursesPage = React.lazy(() => import("./pages/CoursesPage"));
const CourseDetailPage = React.lazy(() => import("./pages/CourseDetailPage"));
const LessonPage = React.lazy(() => import("./pages/LessonPage"));
const NotesPage = React.lazy(() => import("./pages/NotesPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const RegisterPage = React.lazy(() => import("./pages/RegisterPage"));
const SectionView = React.lazy(() =>
  import("./components/sections/SectionView")
);

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <NotesProvider>
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-full">
                <Loader />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:courseId" element={<CourseDetailPage />} />
              {/* Section view (primary content view) */}
              <Route
                path="/courses/:courseId/sections/:sectionId"
                element={<SectionView />}
              />

              {/* Keep lesson view for specific lessons */}
              <Route
                path="/courses/:courseId/sections/:sectionId/lessons/:lessonId"
                element={<LessonPage />}
              />

              <Route
                path="/notes"
                element={
                  <PrivateRoute>
                    <NotesPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </Suspense>
        </NotesProvider>
      </main>
      <Footer />
    </div>
  );
}

export default App;
