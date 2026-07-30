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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/course/:lessonId" element={<Course />} />
      <Route path="/quiz/:lessonId" element={<Quiz />} />
      <Route path="/mission/:sectionId" element={<Mission />} />
      <Route path="/result" element={<Result />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/badges" element={<Badges />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
