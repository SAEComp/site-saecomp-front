import axios from "axios";
import authInterceptor from "./authInterceptor";
import errorInterceptor from "./errorInterceptor";


export const teacherEvaluationProvider = axios.create({
    baseURL: import.meta.env.VITE_TEACHER_EVALUATION_API_URL,
});
teacherEvaluationProvider.interceptors.request.use(authInterceptor([]));

export const authProvider = axios.create({
    baseURL: import.meta.env.VITE_AUTH_API_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true, // enable cookies to be sent with requests
    timeout: 10000
});
authProvider.interceptors.request.use(authInterceptor(['/google-login', '/logout', '/refresh']));
authProvider.interceptors.response.use(res => res, errorInterceptor);

