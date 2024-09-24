import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, logout, logoutAll, getSession } from "../../services/apiServices";

const initialState = {
  user: null,
  token: null,
  role: null,
  error: null,
  status: "idle",
  sessionLoaded: false,
};

// Cargar la sesión desde localStorage al iniciar la aplicación
export const loadSessionFromLocalStorage = () => {
  const { token, role } = getSession(); // Obtener token y rol desde localStorage
  if (token && role) {
    return {
      token,
      role,
    };
  }
  return {
    token: null,
    role: null,
  };
};

// Async thunk para el inicio de sesión
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await login(credentials);
      return response; // Retorna los datos del usuario
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk para el cierre de sesión
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await logout();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error desconocido"
      );
    }
  }
);

// Async thunk para cerrar todas las sesiones
export const logoutAllUser = createAsyncThunk(
  "auth/logoutAllUser",
  async (_, thunkAPI) => {
    try {
      await logoutAll();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error desconocido");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadSession(state) {
      const session = loadSessionFromLocalStorage(); // Cargar desde localStorage
      state.token = session.token;
      state.role = session.role;
      state.sessionLoaded = true;  // Indicar que la sesión fue cargada
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.sessionLoaded = true;  // Establecer que la sesión está cargada
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.role = null;
        state.sessionLoaded = true;  // Asegurarse de que la sesión se ha limpiado
        state.status = "idle";
      })
      .addCase(logoutAllUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.role = null;
        state.sessionLoaded = true;  // Asegurarse de que la sesión se ha limpiado
        state.status = "idle";
      })
      .addCase(logoutAllUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { loadSession, clearError } = authSlice.actions;

export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRole = (state) => state.auth.role;
export const selectSessionLoaded = (state) => state.auth.sessionLoaded;

export default authSlice.reducer;
