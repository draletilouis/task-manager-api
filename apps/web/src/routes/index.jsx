import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import PrivateRoute from './PrivateRoute';
import Navbar from '../components/layout/Navbar';
import Toast from '../components/common/Toast';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContextDefinition';
import { Box } from '@mui/material';

// Page imports
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import WorkspacesPage from '../pages/workspaces/WorkspacesPage';
import WorkspaceDetail from '../pages/workspaces/WorkspaceDetail';
import ProjectDetail from '../pages/projects/ProjectDetail';
import TaskDetail from '../pages/tasks/TaskDetail';
import UserProfile from '../pages/profile/UserProfile';
import SettingsPage from '../pages/settings/SettingsPage';

// Layout for authenticated pages
const AuthenticatedLayout = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'grey.50', overflow: 'auto' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

// Root layout that provides AuthContext to all routes
const RootLayout = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <AuthenticatedLayout />
        <Toast />
      </ToastProvider>
    </AuthProvider>
  );
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public routes - accessible without authentication
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      
      // Redirect root to login
      {
        path: '/',
        element: <Navigate to="/login" replace />
      },

      // Protected routes - require authentication
      {
        element: <PrivateRoute />,
        children: [
          {
            path: '/workspaces',
            element: <WorkspacesPage />
          },
          {
            path: '/workspaces/:workspaceId',
            element: <WorkspaceDetail />
          },
          {
            path: '/workspaces/:workspaceId/projects/:projectId',
            element: <ProjectDetail />
          },
          {
            path: '/workspaces/:workspaceId/projects/:projectId/tasks/:taskId',
            element: <TaskDetail />
          },
          {
            path: '/profile',
            element: <UserProfile />
          },
          {
            path: '/settings',
            element: <SettingsPage />
          }
        ]
      },

      // 404 fallback - redirect to login
      {
        path: '*',
        element: <Navigate to="/login" replace />
      }
    ]
  }
]);