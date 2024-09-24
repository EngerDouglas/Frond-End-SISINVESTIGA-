import React, { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { Provider, useDispatch } from "react-redux";
import store from "./store";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { loadSessionFromCookies } from "./features/auth/authSlice"; // Importa la acción para cargar la sesión

const App = () => {
  const dispatch = useDispatch();

  // Cargar sesión al inicio de la aplicación
  useEffect(() => {
    dispatch(loadSessionFromCookies()); // Cargar sesión desde las cookies al inicio
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

const AppWrapper = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default AppWrapper;