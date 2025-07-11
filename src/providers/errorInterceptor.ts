import { AxiosError } from "axios";
import { toast } from 'sonner';

interface Issue {
    path?: string;
    message: string;
}

export enum ErrorCode {
    INTERNAL = "INTERNAL_ERROR",
    API = "API_ERROR",
    NUSP = "NUSP_ERROR",
    VALIDATION = "VALIDATION_ERROR",
    UNIQUE = "UNIQUE_VIOLATION",
    FK = "FK_VIOLATION",
    NOT_NULL = "NOT_NULL_VIOLATION",
}

interface ErrorBody {
    code: ErrorCode;
    message: string;
    issues?: Issue[];
}


const errorInterceptor = (error: AxiosError): Promise<never> => {
    const errorData = error.response?.data as ErrorBody;

    if (errorData.code == ErrorCode.NUSP) return Promise.reject(error);

    toast.error(errorData.message);

    return Promise.reject(error);

}

export default errorInterceptor;