import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ThemeProvider } from './components/layout/ThemeProvider'
import { AssignmentsPage } from './pages/AssignmentsPage'
import { CalendarPage } from './pages/CalendarPage'
import { ClassesPage } from './pages/ClassesPage'
import { ExamsPage } from './pages/ExamsPage'
import { LoginPage } from './pages/LoginPage'
import { OverviewPage } from './pages/OverviewPage'
import { SettingsPage } from './pages/SettingsPage'
import { UploadsPage } from './pages/UploadsPage'

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/uploads" element={<UploadsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
