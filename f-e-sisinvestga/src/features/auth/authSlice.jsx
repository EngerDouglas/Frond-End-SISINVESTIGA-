import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, logout, getSession } from '../../services/apiServices';

const initialState = {
    user: null,
    token: null,
    role: null,
    error: null,
    status: 'idle',
  };
  
  export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, thunkAPI) => {
    try {
      const response = await login(credentials);
      return response; // Retorna los datos del usuario
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error desconocido');
    }
  });
  
  export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, thunkAPI) => {
    try {
      await logout();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error desconocido');
    }
  });
  
  const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      loadSessionFromCookies(state) {
        const { token, role } = getSession(); // Obtener token y rol de las cookies
        if (token) {
          state.token = token;
          state.role = role;
        }
      },
      clearError(state) {
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(loginUser.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.role = action.payload.user.role;
          state.error = null;
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
        .addCase(logoutUser.fulfilled, (state) => {
          state.user = null;
          state.token = null;
          state.role = null;
          state.status = 'idle';
        });
    },
  });
  
  export const { loadSessionFromCookies, clearError } = authSlice.actions;
  export default authSlice.reducer;