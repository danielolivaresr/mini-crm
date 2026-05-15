import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute   from './components/ProtectedRoute';
import Layout           from './components/Layout';
import Login            from './pages/Login';
import Dashboard        from './pages/Dashboard';
import ClientsPage from './pages/clients/ClientsPage';
import LeadsPage from './pages/leads/LeadsPage';
import TasksPage from './pages/tasks/TasksPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas con Layout compartido */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />}   />
            <Route path="/clients"   element={<ClientsPage />} />
            <Route path="/leads"     element={<LeadsPage/>}    />
            <Route path="/tasks"     element={<TasksPage/>}    />
            
          </Route>

          {/* Redirección por defecto: si entras a "/" te lleva al dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Cualquier otra ruta inexistente → dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;