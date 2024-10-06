import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router';
import Home from '../views/Home/Home';
import LoginPage from '../views/Seguridad/LoginPage';
import RegisterPage from '../views/Seguridad/RegisterPage';
import AdminDashboard from '../views/Admin/AdminDashboard';
import InvestDashboard from '../views/Investigadores/InvestDashboard';
import InvProjectView from '../views/Investigadores/InvProjectView';
import InvPublicationView from '../views/Investigadores/InvPublicationView';
import InvInformeView from '../views/Investigadores/InvInformeView';
import InvRequestView from '../views/Investigadores/InvRequestView';
import InvProfileView from '../views/Investigadores/InvProfileView';
import Unauthorized from '../views/Pages/Unauthorized';
import NotFound from '../views/Pages/NotFound';
import ProtectedRoute from '../Context/ProtectedRoute';
import { selectSessionLoaded } from '../features/auth/authSlice';
import ListaProyectos from '../views/Proyectos/ListaProyectos';
import GestionInvestigadores from '../views/Admin/GestionInvestigadores/GestionInvestigadores'
import Publicaciones from "../views/publicaciones/publicacionesViews"
import ProjectDetails from '../views/Proyectos/ProjectDetails';
import PublicationDetails from '../views/publicaciones/PublicationDetails';
import AddProjectView from '../views/Investigadores/AddProjectView';
import EditProjectView from '../views/Investigadores/EditProjectView';
import AddPublicationView from '../views/Investigadores/AddPublicationView';
import EditPublicationView from '../views/Investigadores/EditPublicationView';

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
      <Route path='/register' element={<RegisterPage />} />
      {/* Rutas Defecto de la pagina */}
      <Route path='/' element={getHome()} />
      <Route path='proyectos/:id' element={<ProjectDetails />} />
      <Route path='publicaciones/:id' element={<PublicationDetails />} />
      
      {/* Rutas Protegidas para Investigador */}
      <Route path='/invest' element={ 
        <ProtectedRoute roles={['Investigador']}>
          <InvestDashboard />
        </ProtectedRoute>
      } />

      <Route path='/invest/proyectos' element={
        <ProtectedRoute roles={['Investigador']}>
          <InvProjectView />
        </ProtectedRoute>
      } />

      <Route path='/invest/proyectos/agregar' element={
        <ProtectedRoute roles={['Investigador']}>
          <AddProjectView />
        </ProtectedRoute>
      } />

      <Route path='/invest/proyectos/editar/:id' element={
        <ProtectedRoute roles={['Investigador']}>
          <EditProjectView />
        </ProtectedRoute>
      } />

      <Route path='/invest/publicaciones' element={
        <ProtectedRoute roles={['Investigador']}>
          <InvPublicationView />
        </ProtectedRoute>
      } />

      <Route path='/invest/publicaciones/agregar' element={
        <ProtectedRoute roles={['Investigador']}>
          <AddPublicationView />
        </ProtectedRoute>
      } />

      <Route path='/invest/publicaciones/editar/:id' element={
        <ProtectedRoute roles={['Investigador']}>
          <EditPublicationView />
        </ProtectedRoute>
      } />

      <Route path='/invest/informes' element={
        <ProtectedRoute roles={['Investigador']}>
          <InvInformeView />
        </ProtectedRoute>
      } />

      <Route path='/invest/solicitudes' element={
        <ProtectedRoute roles={['Investigador']}>
          <InvRequestView />
        </ProtectedRoute>
      } />

      <Route path='/invest/perfil-investigador' element={
        <ProtectedRoute roles={['Investigador']}>
          <InvProfileView />
        </ProtectedRoute>
      } />


      {/* Rutas Protegidas para Administrador */}
      <Route path='/admin' element={ 
        <ProtectedRoute roles={['Administrador']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path='/admin/gestionInvestigadores' element={ 
        <ProtectedRoute roles={['Administrador']}>
          <GestionInvestigadores />
        </ProtectedRoute>
      } />

      <Route path='/admin/publicaciones' element={ 
        <ProtectedRoute roles={['Administrador']}>
          <Publicaciones />
        </ProtectedRoute>
      } />

      <Route path='/admin/listarproyectos' element={ 
        <ProtectedRoute roles={['Administrador']}>
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
