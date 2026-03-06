import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { CoinScanner } from './pages/CoinScanner';
import { Portfolio } from './pages/Portfolio';
import { Reports } from './pages/Reports';
import { AIAssistant } from './pages/AIAssistant';
import { LearningHub } from './pages/LearningHub';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scanner" element={<CoinScanner />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="/learning" element={<LearningHub />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
}
