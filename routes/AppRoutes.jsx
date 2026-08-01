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
import DailyMission from '../pages/DailyMission'
import NotFound from '../pages/NotFound'
import Profile from '../pages/Profile'
import Settings from '../pages/Settings'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/course/:lessonId" element={<Course />} />
      <Route path="/quiz/:lessonId" element={<Quiz />} />
      <Route path="/mission/:sectionId" element={<Mission />} />
      <Route path="/result" element={<Result />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/badges" element={<Badges />} />
      <Route path="/daily-mission" element={<DailyMission />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
