import { authProvider } from "../providers";
import { IUserData } from "../interfaces/authService.interface";

class AuthService {
    async googleLogin(googleToken: string): Promise<string | null> {
        try {
            const response = await authProvider.post('/google-login', { idToken: googleToken });
            if (response.status !== 200) return null;
            const { accessToken } = response.data;
            return accessToken;
        }
        catch (error) {
            return null;
        }
    }
    async tokenRefresh(): Promise<string | null> {
        try {
            const response = await authProvider.post('/refresh');
            if (response.status !== 200) return null;
            const { accessToken } = response.data;
            return accessToken;
        }
        catch (error) {
            return null;
        }
    }
    async logout(): Promise<boolean> {
        try {
            const response = await authProvider.post('/logout');
            if (response.status !== 204) return false;
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async changeRole(userId: number, newRole: 'admin' | 'user'): Promise<boolean> {
        try {
            const response = await authProvider.post('/change-role', { newRole, userId });
            if (response.status !== 204) return false;
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async listUsers(): Promise<IUserData[] | null> {
        try {
            const response = await authProvider.get('/users');
            if (response.status !== 200) return null;
            return response.data.result as IUserData[];
        }
        catch (error) {
            return null;
        }
    }
}

export default new AuthService();
