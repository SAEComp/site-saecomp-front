
export interface IUserData {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
    nusp: string;
    created_at: string;
    active_sessions: number;
}