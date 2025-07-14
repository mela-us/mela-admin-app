import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loading from './components/Loading';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

// Auth pages
const LoginPage = React.lazy(() => import('./pages/public/Login'));
// Common pages
const CommonDashboard = React.lazy(() => import('./pages/protected/Dashboard'));
const CommonReport = React.lazy(() => import('./pages/protected/Report'));
const CommonLevelsPage = React.lazy(() => import('./pages/protected/Levels'));
const CommonTopicsPage = React.lazy(() => import('./pages/protected/Topics'));
const CommonLecturesPage = React.lazy(() => import('./pages/protected/Lectures'));
const CommonLectureCreatePage = React.lazy(() => import('./pages/protected/LectureCreate'));
const CommonLectureEditPage = React.lazy(() => import('./pages/protected/LectureEdit'));
const CommonLectureDetailPage = React.lazy(() => import('./pages/protected/LectureDetail'));
const CommonExercisesPage = React.lazy(() => import('./pages/protected/Exercises'));
const CommonExerciseCreatePage = React.lazy(() => import('./pages/protected/ExerciseCreate'));
const CommonExerciseEditPage = React.lazy(() => import('./pages/protected/ExerciseEdit'));
const CommonExerciseDetailPage = React.lazy(() => import('./pages/protected/ExerciseDetail'));
const CommonUsersPage = React.lazy(() => import('./pages/protected/Users'));
const CommonUserCreatePage = React.lazy(() => import('./pages/protected/UserCreate'));
const CommonUserEditPage = React.lazy(() => import('./pages/protected/UserEdit'));
const CommonUserDetailPage = React.lazy(() => import('./pages/protected/UserDetail'));

export default function App() {
  const { state } = useAuth();

  if (state.isLoading) {
    return <Loading />;
  }

  return (
    <div className="App">
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/login" element={<LoginPage />} />

          {/* Common routes */}
          <>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin', 'contributor']}>
                  <CommonDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CommonReport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/levels"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CommonLevelsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/topics"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CommonTopicsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lectures"
              element={
                <ProtectedRoute allowedRoles={['admin', 'contributor']}>
                  <CommonLecturesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lectures/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'contributor']}>
                  <CommonLectureDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lectures/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['admin', 'contributor']}>
                  <CommonLectureEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lectures/add"
              element={
                <ProtectedRoute allowedRoles={['admin', 'contributor']}>
                  <CommonLectureCreatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exercises"
              element={
                <ProtectedRoute allowedRoles={['admin', 'contributor']}>
                  <CommonExercisesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exercises/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'contributor']}>
                  <CommonExerciseDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exercises/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['admin', 'contributor']}>
                  <CommonExerciseEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exercises/add"
              element={
                <ProtectedRoute allowedRoles={['admin', 'contributor']}>
                  <CommonExerciseCreatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={['admin', 'contributor']}>
                  <CommonUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'contributor']}>
                  <CommonUserDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CommonUserEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/add"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CommonUserCreatePage />
                </ProtectedRoute>
              }
            />
          </>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}
