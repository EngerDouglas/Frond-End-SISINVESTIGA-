import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError, loadSessionFromCookies } from '../../../features/auth/authSlice';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { user, token, role, error, status } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(loadSessionFromCookies()); // Carga la sesión desde las cookies
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

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
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                />
                <button type="submit">Iniciar Sesión</button>
            </form>

            {status === 'loading' && <p>Cargando...</p>}
            {error && (
                <div>
                    <p>Error: {error.message}</p>
                    <button onClick={handleClearError}>Limpiar Error</button>
                </div>
            )}
            {user && <p>Bienvenido, {user.name}</p>}
            {token && <p>Token: {token}</p>}
            {role && <p>Rol: {role}</p>}
        </div>
    );
};

export default Login;