import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import authService from '../services/auth.service';
import { decodeGoogleToken, decodeAccessToken } from './decodeToken';
import { verifyLogin } from './verifyLogin';
import { IUser, IAuthContext } from './auth.interface';
import { saveUser } from './userService';


const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const silentCallback = useRef<boolean>(false);

    const logout = async () => {
        console.log("logout func")
        const resp = await authService.logout();
        if (!resp) {
            console.error("Failed to logout");
            throw new Error("Failed to logout");
        }
        saveUser(null);
        setUser(null);
    };

    const checkLogin = async () => {
        try {
            console.log('check login provider:')
            const nUser = await verifyLogin();
            console.log('check login provider new user:', nUser)
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
            console.log('effect check error', error)
            setUser(null);
        }
    }

    const login = async (googleCredential: google.accounts.id.CredentialResponse) => {
        console.log('login func');

        const accessToken = await authService.googleLogin(googleCredential.credential);
        if (!accessToken) {
            console.error("Failed to login with Google");
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
        console.log('initialized google callback function');

        try {
            const newUser = await verifyLogin();
            newUser.googleToken = response.credential;
            saveUser(newUser);
            setUser(newUser);
            return;
        } catch (error) {
            console.log('refreshToken expired, trying to login with google');
        }
        
        try {
            await login(response);

        } catch (error) {
            console.error("Login failed:", error);
            return;
        }
    }, []);

    useEffect(() => {
        google.accounts!.id.initialize({
            client_id:
                import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
            callback: handleCallbackResponse
        });
        const timer = setTimeout(() => {
            if (!silentCallback.current) effectCheck();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, checkLogin, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside AuthProvider');
    return context;
};
