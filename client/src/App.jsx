import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import EmployeeHub from './pages/EmployeeHub';
import BoardTab from './pages/BoardTab';
import RoutinesTab from './pages/RoutinesTab';
import LeavesTab from './pages/LeavesTab';
import TeamCapacityTab from './pages/TeamCapacityTab';
import OverviewTab from './pages/OverviewTab';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
              fontSize: '13px',
              fontWeight: 500,
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />

        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected Application Layout */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* 1. Employee Hub (Exact screenshot view!) */}
            <Route index element={<EmployeeHub />} />

            {/* 2. Task Board & Backlog */}
            <Route path="board" element={<BoardTab />} />

            {/* 3. Daily Routines Master */}
            <Route path="routines" element={<RoutinesTab />} />

            {/* 4. Calendar & Leaves */}
            <Route path="leaves" element={<LeavesTab />} />

            {/* 5. Team & Capacity */}
            <Route path="team" element={<TeamCapacityTab />} />

            {/* 6. Manager Overview */}
            <Route path="overview" element={<OverviewTab />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
