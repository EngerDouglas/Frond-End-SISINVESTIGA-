import axios from 'axios';

const API_URL = 'http://localhost:3005/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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