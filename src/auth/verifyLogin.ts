import { IUser } from "./auth.interface";
import { isTokenExpired, decodeAccessToken } from "./decodeToken";
import authService from "../services/auth.service";
import { getUser, saveUser } from "./userService";


export async function verifyLogin(): Promise<IUser> {
    const _user = getUser();
    if (!_user) throw new Error("User not found");

    if (!_user.accessToken || isTokenExpired(_user?.accessToken)) {
        const accessToken = await authService.tokenRefresh();
        if (!accessToken) {
            saveUser(null);
            throw new Error("Failed to refresh access token");
        }
        _user.accessToken = accessToken;
        const accessUser = decodeAccessToken(accessToken);
        _user.id = Number(accessUser.sub);
        _user.role = accessUser.role;
        _user.permissions = accessUser.permissions;
        saveUser(_user);
    }
    return _user;
}
