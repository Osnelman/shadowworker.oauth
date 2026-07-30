import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Course from '../pages/Course'
import Quiz from '../pages/Quiz'
import Result from '../pages/Result'
import Mission from '../pages/Mission'
import Progress from '../pages/Progress'
import Badges from '../pages/Badges'
import NotFound from '../pages/NotFound'
import ProtectedRoute from '../components/ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/course/:lessonId" element={<ProtectedRoute><Course /></ProtectedRoute>} />
      <Route path="/quiz/:lessonId" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
      <Route path="/mission/:sectionId" element={<ProtectedRoute><Mission /></ProtectedRoute>} />
      <Route path="/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
      <Route path="/badges" element={<ProtectedRoute><Badges /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
