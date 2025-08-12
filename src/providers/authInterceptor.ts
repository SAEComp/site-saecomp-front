import { InternalAxiosRequestConfig } from "axios";
import { redirect } from "react-router";
import { verifyLogin } from "../auth/verifyLogin";


const authInterceptor = (publicRoutes: string[]): (config: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig> => {
    return async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {

        const isPublic = publicRoutes.some((path) =>
            config.url?.includes(path)
        );

        if (isPublic) return config;

        try {
            const user = await verifyLogin();
            config.headers.Authorization = `Bearer ${user.accessToken}`;
            return config;
        } catch (error) {
            redirect('/login');
            return Promise.reject(error);
        }
    }
}

export default authInterceptor;