import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CreateMaterialPage from './pages/CreateMaterialPage';
import ContentEditPage from './pages/ContentEditPage';
import LayoutPreviewPage from './pages/LayoutPreviewPage';
import MyMaterialsPage from './pages/MyMaterialsPage';
import ImportCenterPage from './pages/ImportCenterPage';

import TemplateManager from './pages/admin/TemplateManager';
import DataSourceManager from './pages/admin/DataSourceManager';
import AdminTasks from './pages/admin/AdminTasks';
import AdminUsers from './pages/admin/AdminUsers';
import AdminLogs from './pages/admin/AdminLogs';
import AdminSettings from './pages/admin/AdminSettings';
import AdminDashboard from './pages/admin/AdminDashboard';
import ImportManager from './pages/admin/ImportManager';
import TemplateReview from './pages/admin/TemplateReview';
import SimilarityLogs from './pages/admin/SimilarityLogs';
import Layout from './components/Layout';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="create" element={<CreateMaterialPage />} />
            <Route path="edit" element={<ContentEditPage />} />
            <Route path="preview" element={<LayoutPreviewPage />} />
            <Route path="materials" element={<MyMaterialsPage />} />
            <Route path="import" element={<ImportCenterPage />} />
            
            {/* Admin Routes */}
            <Route path="admin" element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="admin/templates" element={
              <ProtectedRoute adminOnly>
                <TemplateManager />
              </ProtectedRoute>
            } />
            <Route path="admin/sources" element={
              <ProtectedRoute adminOnly>
                <DataSourceManager />
              </ProtectedRoute>
            } />
            <Route path="admin/tasks" element={
              <ProtectedRoute adminOnly>
                <AdminTasks />
              </ProtectedRoute>
            } />
            <Route path="admin/users" element={
              <ProtectedRoute adminOnly>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="admin/logs" element={
              <ProtectedRoute adminOnly>
                <AdminLogs />
              </ProtectedRoute>
            } />
            <Route path="admin/settings" element={
              <ProtectedRoute adminOnly>
                <AdminSettings />
              </ProtectedRoute>
            } />
            <Route path="admin/imports" element={
              <ProtectedRoute adminOnly>
                <ImportManager />
              </ProtectedRoute>
            } />
            <Route path="admin/templates-review" element={
              <ProtectedRoute adminOnly>
                <TemplateReview />
              </ProtectedRoute>
            } />
            <Route path="admin/similarity-logs" element={
              <ProtectedRoute adminOnly>
                <SimilarityLogs />
              </ProtectedRoute>
            } />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
