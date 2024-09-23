
import GestionPermisos from './views/Seguridad/GestionPermisos';
import RegistroInvestigador from '../src/components/GestionProyectos/RegistroInvestigador'; 
import React from 'react';
import {BrowserRouter, Routes,Route} from "react-router-dom";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<GestionPermisos/>} />
        <Route path="/registro" element={<RegistroInvestigador />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;