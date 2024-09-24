import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../../features/auth/authSlice';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { user, role, error, status } = useSelector((state) => state.auth);

    // Manejar el envío del formulario de inicio de sesión
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    // Limpiar el mensaje de error
    const handleClearError = () => {
        dispatch(clearError());
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                />
                <button type="submit" className="submit-btn">
                    {status === 'loading' ? 'Iniciando...' : 'Iniciar Sesión'}
                </button>
            </form>

            {error && (
                <div className="error-message">
                    {/* Convertir el error en string si es necesario */}
                    <p>Error: {typeof error === 'string' ? error : 'Ocurrió un error inesperado'}</p>
                    <button onClick={handleClearError}>Limpiar Error</button>
                </div>
            )}
            {/* Mostrar datos del usuario cuando se ha iniciado sesión */}
            {user && (
                <div className="user-info">
                    <p>Bienvenido, {user.nombre}</p>
                    {role && <p>Rol: {role}</p>}
                </div>
            )}
        </div>
    );
};

export default Login;
