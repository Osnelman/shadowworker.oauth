import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Course from '../pages/Course'
import Quiz from '../pages/Quiz'
import Result from '../pages/Result'
import NotFound from '../pages/NotFound'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/course/:lessonId" element={<Course />} />
      <Route path="/quiz/:lessonId" element={<Quiz />} />
      <Route path="/result" element={<Result />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}