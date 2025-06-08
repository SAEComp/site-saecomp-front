import axios from "axios";
import interceptor from "./interceptor";


export const teacherEvaluationProvider = axios.create({
    baseURL: import.meta.env.VITE_TEACHER_EVALUATION_API_URL,
});
teacherEvaluationProvider.interceptors.request.use(interceptor([]));

export const authProvider = axios.create({
    baseURL: import.meta.env.VITE_AUTH_API_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true, // enable cookies to be sent with requests
    timeout: 10000
});
authProvider.interceptors.request.use(interceptor(['/google-login', '/logout', '/refresh']));

