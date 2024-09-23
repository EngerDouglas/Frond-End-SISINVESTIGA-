import Login from './components/Seguridad/LoginInvestigadores';
import Investigadores from './components/GestionProyectos/Investigadores';
import RegistroInvestigador from '../src/components/GestionProyectos/RegistroInvestigador'; 
import React from 'react';
import {BrowserRouter, Routes,Route} from "react-router-dom";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Login/>} />\
        <Route path="/investigadores" element={<Investigadores/>} />
        <Route path="/registro" element={<RegistroInvestigador />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;