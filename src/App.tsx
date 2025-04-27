import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ControlPage from './pages/ControlPage';
import DisplayPage from './pages/DisplayPage';
import AuthCallback from './pages/AuthCallback';
import Auth from './pages/Auth';
import { isAuthenticated } from './services/auth';
import './App.css'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ControlPage />
            </ProtectedRoute>
          }
        />
        <Route path="/display" element={<DisplayPage />} />
      </Routes>
    </Router>
  );
}

export default App;
