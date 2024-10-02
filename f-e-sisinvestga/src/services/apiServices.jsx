import axios from 'axios';

// Constante de URL base para la API
const API_URL = 'http://localhost:3005/api';

// Configuración inicial de Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//  ------------------ Accesos al LocalStorage ------------------------ //

// Guardar token y rol en localStorage
export const saveSession = (token, role) => {
  if (!token || !role) {
    console.error("Token o rol no válidos o faltantes:", token, role);
    return false;
  }

  // Guarda el token y el rol en localStorage
  localStorage.setItem('ucsd_session', token);
  localStorage.setItem('role', role);
  return true;
};

// Borrar la sesión
export const deleteSession = () => {
  localStorage.removeItem('ucsd_session');
  localStorage.removeItem('role');
};

// Obtener la sesión desde localStorage
export const getSession = () => {
  const token = localStorage.getItem('ucsd_session');
  const role = localStorage.getItem('role');
  if (!token || !role) {
    return { token: null, role: null };
  }
  return { token, role };
};

// Interceptor para añadir el token en cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ucsd_session');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

//  -------------------------------- END ---------------------------- //

//  ------------------ Sesiones ------------------------ //

// Iniciar sesión
export const login = async (credentials) => {
  try {
    const response = await api.post('/users/login', credentials);
    const { user, token, role } = response.data; // Desestructuramos role y user de la respuesta

    if (!token || !role || !user) {
      console.error('El token, el rol o el usuario no se recibieron correctamente.');
      return;
    }

    // Guardar el token y el rol en localStorage
    saveSession(token, role);

    // Devuelve el token, el rol y el usuario al Redux
    return { user, token, role };
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Error desconocido';
    throw new Error(errorMessage);
  }
};

// Cerrar sesión
export const logout = async () => {
  try {
    await api.post('/users/logout');
    deleteSession();
  } catch (error) {
    console.log('Error al cerrar sesión:', error.response?.data || error.message);
    throw error;
  }
};

// Cerrar todas las sesiones
export const logoutAll = async () => {
  try {
    await api.post('/users/logout-all');
    deleteSession(); 
  } catch (error) {
    console.log('Error al cerrar todas las sesiones:', error.response?.data || error.message);
    throw error;
  }
};

//  -------------------------------- END ---------------------------- //

// GET
export const getData = async (endpoint) => {
  try {
    const response = await api.get(`/${endpoint}`);
    return response.data;
  } catch (error) {
    console.log('Error en GET:', error);
    throw error;
  }
};

// GET con parámetros
export const getDataParams = async (endpoint, params = {}) => {
  try {
    const response = await api.get(`/${endpoint}`, { params });
    return response.data;
  } catch (error) {
    console.log('Error en GET:', error);
    throw error;
  }
};

// Obtener un recurso por ID
export const getDataById = async (endpoint, id) => {
  try {
    const response = await api.get(`/${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error en GET by ID:', error);
    throw error;
  }
};

// Obtener recursos con búsqueda o filtro (ej: buscar proyectos)
export const searchData = async (endpoint, params) => {
  try {
    const response = await api.get(`/${endpoint}/search`, { params });
    return response.data;
  } catch (error) {
    console.log('Error en SEARCH:', error);
    throw error;
  }
};

// Obtener recursos personalizados (ej: obtener publicaciones del usuario)
export const getUserData = async (endpoint) => {
  try {
    const response = await api.get(`/${endpoint}/me`);
    return response.data;
  } catch (error) {
    console.log('Error en GET user data:', error);
    throw error;
  }
};

//  -------------------------------- END ---------------------------- //

// POST
export const postData = async (endpoint, body) => {
  try {
    const response = await api.post(`/${endpoint}`, body);
    return response.data;
  } catch (error) {
    console.log('Error en POST:', error);
    throw error;
  }
};

//  -------------------------------- END ---------------------------- //

// PUT
export const putData = async (endpoint, id, body) => {
  try {
    const response = await api.put(`/${endpoint}/${id}`, body);
    return response.data;
  } catch (error) {
    console.log('Error en PUT:', error);
    throw error;
  }
};

//  -------------------------------- END ---------------------------- //

// DELETE
export const deleteData = async (endpoint, id) => {
  try {
    const response = await api.delete(`/${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error en DELETE:', error);
    throw error;
  }
};

//  -------------------------------- END ---------------------------- //
