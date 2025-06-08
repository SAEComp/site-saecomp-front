import { IUser } from "./auth.interface"


export const saveUser = (user: IUser | null) => {
    if (!user) {
        localStorage.removeItem('user');
        return;
    }
    const jsonUser = JSON.stringify(user);
    localStorage.setItem('user', jsonUser);
}

export const getUser = (): IUser | null => {
    const jsonUser = localStorage.getItem('user');
    if (!jsonUser) return null;
    try {
        const user: IUser = JSON.parse(jsonUser);
        return user;
    } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        return null;
    }
}