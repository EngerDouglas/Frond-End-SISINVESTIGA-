import React from 'react';
import { Route,Routes } from 'react-router';
import Home from '../views/Home/Home';
import LoginPage from '../views/Seguridad/LoginPage';
import GestionPermisos from '../views/Seguridad/GestionPermisos';
import RegistroInvestigador from '../../src/components/GestionProyectos/RegistroInvestigador';
import Unauthorized from '../views/Pages/Unauthorized';
import NotFound from '../views/Pages/NotFound';
import ProtectedRoute from '../Context/ProtectedRoute';

const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas Publicas */}
      <Route path='/login' element={<LoginPage />} />
      <Route path='/' element={<Home />} />
      <Route path='/registro' element={<RegistroInvestigador />} />

      {/* Rutas Protegidas para Investigador */}
      <Route path='/gestion' element={ 
        <ProtectedRoute requiredRole='Investigador'>
          <GestionPermisos />
        </ProtectedRoute>
      } />

      {/* Rutas Protegidas no Autorizadoo */}
      <Route path='/unauthorized' element={<Unauthorized />} />

      {/* Rutas Protegidas no Autorizadoo */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter;