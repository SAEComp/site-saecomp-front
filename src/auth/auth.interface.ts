export interface IUser {
    id: number;
    role: string;
    permissions: string[];
    googleId: string;
    name: string;
    email: string;
    picture: string;
    googleToken: string;
    accessToken: string;
}

export interface IAuthContext {
    user: IUser | null;
    login: (googleCredential: google.accounts.id.CredentialResponse, nusp?: string) => Promise<void>;
    logout: () => Promise<void>;
    checkLogin: () => Promise<void>;
    isAuthenticated: boolean;
    googleInitialized: boolean;
    tempCredential: google.accounts.id.CredentialResponse | undefined;
}