import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3005/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


//  ------------------ Accesos de las Cookies ------------------------ //

// Guardar token y rol en las cookies
export const saveSession = (token, role) => {
  if (!token) {
    console.error("Token no válido o faltante:", token);
    return false;
  }

  // Guarda la cookie y verifica si se guarda correctamente
  Cookies.set('ucsd_session', token, {
    expires: 1, // Cambia la expiración a 1 día para pruebas
    path: '/',
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production'
  });
  
  Cookies.set('role', role, {
    expires: 1,
    path: '/',
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production'
  });

  console.log("Token guardado en cookies:", Cookies.get('ucsd_session'));
  console.log("Role guardado en cookies:", Cookies.get('role'));
  return true;
};


// Borrar la sesión
export const deleteSession = () => {
  Cookies.remove('ucsd_session');
  Cookies.remove('role');
};

// Obtener la sesión desde las cookies
export const getSession = () => {
  const token = Cookies.get('ucsd_session');
  const role = Cookies.get('role');
  if (!token || !role) {
    console.error("No se encontraron cookies de sesión válidas");
    return { token: null, role: null }; // Return default values if cookies are missing
  }
  console.log("Obtenido desde las cookies:", { token, role });
  return { token, role };
};

//  -------------------------------- END ---------------------------- //

//  ------------------ Sesiones ------------------------ //

// Función para iniciar sesión
export const login = async (credentials) => {
  try {
    const response = await api.post('/users/login', credentials);
    const { user, token } = response.data;

    if (!token) {
      console.error('El token no se recibió correctamente');
      return;
    }

    // Guardar el token y el rol en las cookies
    saveSession(token, user.role);

    return { user, token };
  } catch (error) {
    console.log('Error en el inicio de sesión:', error.response?.data || error.message);
    throw error;
  }
};

// Función para cerrar sesión
export const logout = async () => {
  try {
    await api.post('/users/logout');
    deleteSession();
  } catch (error) {
    console.log('Error al cerrar sesión:', error.response?.data || error.message);
    throw error;
  }
};

//  -------------------------------- END ---------------------------- //

// GET //
export const getData = async (endpoint) => {
  try {
    const response = await api.get(`/${endpoint}`);
    return response.data;
  } catch (error) {
    console.log('Error en GET:' ,error);
    throw error;
  }
};

// POST
export const postData = async (endpoint, body) => {
  try {
    const response = await api.post(`/${endpoint}`, body);
    return response.data;
  } catch (error) {
    console.log('Error en POST:', error);
    throw error;
  }
}

// PUT
export const putData = async (endpoint, body) => {
  try {
    const response = await api.put(`/${endpoint}`, body);
    return response.data;
  } catch (error) {
    console.log('Error en PUT:', error);
    throw error;
  }
}

// DELETE
export const deleteData = async (endpoint) => {
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    console.log('Error en DELETE:', error);
    throw error;
  }
}