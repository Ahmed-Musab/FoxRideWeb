'use client';

import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children, initialUser, initialRole }) {
    const [user, setUser] = useState(initialUser || null);
    const [role, setRole] = useState(initialRole || null);

    const login = async (userData) => {
        const currentUser = userData?.user || userData;
        setUser({
            _id: currentUser?._id,
            name: currentUser?.name,
            email: currentUser?.email,
            role: currentUser?.role
        });
        if (currentUser?.role) {
            setRole(currentUser.role);
        }
    }

    const logout = async () => {
        try {
            await fetch('/api/auth/logoutUser', { method: 'POST' });
        } catch (error) {
            console.error('Failed to clear session on logout:', error);
        }
        localStorage.removeItem('token');
        setUser(null);
        setRole(null);
    }

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, role, setRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}