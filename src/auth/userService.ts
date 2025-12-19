import { IUser } from "./auth.interface"


export const saveUser = (user: IUser | null) => {
    if (!user) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        return;
    }
    const jsonUser = JSON.stringify(user);
    localStorage.setItem('user', jsonUser);
    
    // Salvar token separadamente para uso nos interceptors
    if (user.accessToken) {
        localStorage.setItem('token', user.accessToken);
        localStorage.setItem('authToken', user.accessToken);
    }
}

export const getUser = (): IUser | null => {
    const jsonUser = localStorage.getItem('user');
    if (!jsonUser) return null;
    try {
        const user: IUser = JSON.parse(jsonUser);
        return user;
    } catch (error) {
        return null;
    }
}