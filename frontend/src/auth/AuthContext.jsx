import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'admin_token_v1';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY) || '');
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (token) {
            localStorage.setItem(STORAGE_KEY, token);
            // Optionally fetch user info
            fetch(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
                .then(r => r.ok ? r.json() : Promise.reject())
                .then(data => setUser(data.user))
                .catch(() => setUser(null));
        } else {
            localStorage.removeItem(STORAGE_KEY);
            setUser(null);
        }
    }, [token]);

    const value = useMemo(() => ({ token, setToken, user, API_BASE, logout: () => setToken('') }), [token, user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}


