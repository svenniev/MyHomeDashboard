import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { RequireAuth } from './auth/RequireAuth';
import AppLayout from './layout/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import GoalsPage from './pages/GoalsPage';
import BodyCompositionPage from './pages/BodyCompositionPage';
import TrainingPage from './pages/TrainingPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/*" element={
            <RequireAuth>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/goals" element={<GoalsPage />} />
                  <Route path="/body" element={<BodyCompositionPage />} />
                  <Route path="/training" element={<TrainingPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </AppLayout>
            </RequireAuth>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
