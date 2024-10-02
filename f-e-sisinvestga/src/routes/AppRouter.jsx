import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router';
import Home from '../views/Home/Home';
import LoginPage from '../views/Seguridad/LoginPage';
import AdminDashboard from '../views/Admin/AdminDashboard';
import InvestDashboard from '../views/Investigadores/InvestDashboard';
import Unauthorized from '../views/Pages/Unauthorized';
import NotFound from '../views/Pages/NotFound';
import ProtectedRoute from '../Context/ProtectedRoute';
import { selectSessionLoaded } from '../features/auth/authSlice';
import ListaProyectos from '../views/Proyectos/ListaProyectos';
import GestionInvestigadores from '../views/Admin/GestionInvestigadores/GestionInvestigadores'
import Publicaciones from "../views/publicaciones/publicacionesViews"
import ProjectDetails from '../views/Proyectos/ProjectDetails';

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
      {/* Rutas Defecto de la pagina */}
      <Route path='/' element={getHome()} />
      <Route path='proyectos/:id' element={<ProjectDetails />} />
      
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
      <Route path='/gestionInvestigadores' element={ 
        <ProtectedRoute roles={['Administrador']}>
          <GestionInvestigadores />
        </ProtectedRoute>
      } />

       {/* Rutas Protegidas para Administrador */}
      <Route path='/publicaciones' element={ 
        <ProtectedRoute roles={['Administrador']}>
          <Publicaciones />
        </ProtectedRoute>
      } />

      {/* Rutas Protegidas para Administrador */}
      <Route path='/listarproyectos' element={ 
        <ProtectedRoute roles={['Administrador', 'Investigador']}>
          <ListaProyectos />
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
