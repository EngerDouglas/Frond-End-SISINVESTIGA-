import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router';
import Home from '../views/Home/Home';
import LoginPage from '../views/Seguridad/LoginPage';
import AdminDashboard from '../views/Admin/AdminDashboard';
import InvestDashboard from '../views/Investigadores/InvestDashboard';
import GestionPermisos from '../views/Seguridad/GestionPermisos';
import RegistroInvestigador from '../../src/components/GestionProyectos/RegistroInvestigador';
import Unauthorized from '../views/Pages/Unauthorized';
import NotFound from '../views/Pages/NotFound';
import ProtectedRoute from '../Context/ProtectedRoute';
import { selectSessionLoaded } from '../features/auth/authSlice';

const AppRouter = () => {

  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);
  const sessionLoaded = useSelector(selectSessionLoaded);

  if (!sessionLoaded) {
    return <p>Cargando sesión...</p>; // Mostrar indicador de carga mientras no se haya cargado la sesión
  }

  const getHome = () => {
    if (token) {
      switch (role) {
        case 'Administrador':
          return <Navigate to='/admin' />;
        case 'Investigador':
          return <Navigate to="/invest" />;      
        default:
          return <Home />;
      }
    }
    else {
      return <Home />;
    }
  }

  return (
    <Routes>
      {/* Rutas Publicas */}
      <Route path='/login' element={<LoginPage />} />
      <Route path='/registro' element={<RegistroInvestigador />} />

      {/* Rutas Defecto de la pagina */}
      <Route path='/' element={getHome()} />
      
      {/* Rutas Protegidas para Investigador */}
      <Route path='/invest' element={ 
        <ProtectedRoute roles={['Investigador']}>
          <InvestDashboard />
        </ProtectedRoute>
      } />

      {/* Rutas Protegidas para Administrador */}
      <Route path='/admin' element={ 
        <ProtectedRoute roles={['Administrador']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Rutas Protegidas para Administrador */}
      <Route path='/gestion' element={ 
        <ProtectedRoute roles={['Administrador']}>
          <GestionPermisos />
        </ProtectedRoute>
      } />

      {/* Rutas Protegidas no Autorizado */}
      <Route path='/unauthorized' element={<Unauthorized />} />

      {/* Ruta por defecto: Not Found */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter;
