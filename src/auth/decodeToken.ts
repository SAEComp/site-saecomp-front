import jwtDecode from 'jwt-decode';


interface IDecodedGoogleToken {
    aud: string;
    azp: string;
    email: string;
    email_verified: boolean;
    exp: number;
    given_name: string;
    hd: string;
    iat: number;
    iss: string;
    jti: string;
    name: string;
    nbf: number;
    picture: string;
    sub: string;
}

interface IDecodedAccessToken {
    sub: string;
    role: string;
    iat: number;
    exp: number;
}

interface IDecodedRefreshToken {
    sub: string;
    type: 'refresh';
    iat: number;
    exp: number;
}

export const decodeGoogleToken = (token: google.accounts.id.CredentialResponse): IDecodedGoogleToken => {
    const userObject = jwtDecode(token.credential);
    return userObject as IDecodedGoogleToken;
}

export const decodeAccessToken = (token: string): IDecodedAccessToken => {
    const decoded = jwtDecode(token);
    return decoded as IDecodedAccessToken;
}

export const decodeRefreshToken = (token: string): IDecodedRefreshToken => {
    const decoded = jwtDecode(token);
    return decoded as IDecodedRefreshToken;
}

export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded: { exp: number } = jwtDecode(token);
        return (decoded.exp - 30) * 1000 < Date.now();
    } catch (error) {
        return true;
    }
}
