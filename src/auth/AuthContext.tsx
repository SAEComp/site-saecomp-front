import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import authService from '../services/auth.service';
import { decodeGoogleToken, decodeAccessToken } from './decodeToken';
import { verifyLogin } from './verifyLogin';
import { IUser, IAuthContext } from './auth.interface';
import { saveUser } from './userService';
import useGoogle from './useGoogle';


const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const google = useGoogle();
    const [user, setUser] = useState<IUser | null>(null);
    const silentCallback = useRef<boolean>(false);
    const [googleInitialized, setGoogleInitialized] = useState<boolean>(false);

    const logout = async () => {
        const resp = await authService.logout();
        if (!resp) {
            throw new Error("Failed to logout");
        }
        saveUser(null);
        setUser(null);
    };

    const checkLogin = async () => {
        try {
            const nUser = await verifyLogin();
            setUser(nUser);
        } catch (error) {
            setUser(null);
            throw error;
        }
    }

    const effectCheck = async () => {
        try {
            await checkLogin();
        } catch (error) {
            setUser(null);
        }
    }

    const login = async (googleCredential: google.accounts.id.CredentialResponse) => {
        const accessToken = await authService.googleLogin(googleCredential.credential);
        if (!accessToken) {
            throw new Error("Failed to login with Google");
        }
        const googleUser = decodeGoogleToken(googleCredential);
        const accessUser = decodeAccessToken(accessToken);
        const newUser: IUser = {
            id: Number(accessUser.sub),
            role: accessUser.role as 'admin' | 'user',
            googleId: googleUser.sub,
            name: googleUser.name,
            email: googleUser.email,
            picture: googleUser.picture,
            googleToken: googleCredential.credential,
            accessToken: accessToken
        }
        saveUser(newUser);
        setUser(newUser);
    };

    const handleCallbackResponse = useCallback(async (response: google.accounts.id.CredentialResponse) => {
        silentCallback.current = true;

        try {
            const newUser = await verifyLogin();
            newUser.googleToken = response.credential;
            saveUser(newUser);
            setUser(newUser);
            return;
        } catch (error) {
        }
        
        try {
            await login(response);

        } catch (error) {
            return;
        }
    }, []);

    useEffect(() => {
        if (!google) return;
        google.accounts!.id.initialize({
            client_id:
                import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
            callback: handleCallbackResponse
        });
        setGoogleInitialized(true);
        const timer = setTimeout(() => {
            if (!silentCallback.current) effectCheck();
        }, 500);
        return () => clearTimeout(timer);
    }, [google]);

    return (
        <AuthContext.Provider value={{ user, login, checkLogin, logout, isAuthenticated: !!user, googleInitialized }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside AuthProvider');
    return context;
};
