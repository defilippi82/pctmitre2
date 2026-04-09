import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../Services/UserContext'; // Ajusta esta ruta según donde guardes el archivo

export const RutasPrivadas = ({ rolRequerido }) => {
    const { userData } = useContext(UserContext);

    // 1. Si no hay usuario logueado (el guardia no ve credencial), lo mandamos al Login
    if (!userData) {
        return <Navigate to="/login" replace />; 
    }

    // 2. Si la ruta es solo para Administradores, revisamos su rol.
    // (Usamos userData.rol?.valor como lo tenés en tu Navbar)
    if (rolRequerido === 'administrador' && userData.rol?.valor !== 'administrador') {
        return <Navigate to="/" replace />; // Lo devolvemos al inicio porque no tiene permiso
    }

    // 3. Si todo está bien, lo dejamos pasar a la ruta solicitada
    return <Outlet />;
};