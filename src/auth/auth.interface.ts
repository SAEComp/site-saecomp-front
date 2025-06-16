export interface IUser {
    id: number;
    role: 'admin' | 'user';
    googleId: string;
    name: string;
    email: string;
    picture: string;
    googleToken: string;
    accessToken: string;
}

export interface IAuthContext {
    user: IUser | null;
    login: (googleCredential: google.accounts.id.CredentialResponse) => Promise<void>;
    logout: () => Promise<void>;
    checkLogin: () => Promise<void>;
    isAuthenticated: boolean;
    googleInitialized: boolean;
}