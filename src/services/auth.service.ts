import { authProvider } from "../providers";
import { UserList, listUsersOutSchema } from "../schemas/auth/out/user.schema";
import { listPermissionsOutSchema, Permission } from "../schemas/auth/out/permissions.schema";
import { listRolesOutSchema, Role } from "../schemas/auth/out/roles.schema";
import { EditRoleIn } from "../schemas/auth/input/roles.schema";
import { ErrorCode } from "../providers/errorInterceptor";
import { CreateUser } from "../schemas/auth/input/user.schema";
import { AxiosError } from "axios";

class AuthService {
    async googleLogin(googleToken: string, nusp?: string): Promise<string | null> {
        try {
            const response = await authProvider.post('/google-login', { idToken: googleToken, nusp });
            if (response.status !== 200) return null;
            const { accessToken } = response.data;
            return accessToken;
        }
        catch (error) {
            if (error instanceof AxiosError && error?.response?.data?.code == ErrorCode.NUSP) return '';
            return null;
        }
    }
    async tokenRefresh(): Promise<string | null> {
        try {
            const response = await authProvider.post('/refresh');
            if (response.status !== 200) return null;
            const { accessToken } = response.data;
            return accessToken;
        }
        catch (error) {
            return null;
        }
    }
    async logout(): Promise<boolean> {
        try {
            const response = await authProvider.post('/logout');
            if (response.status !== 204) return false;
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async changeRole(userId: number, roleId: number): Promise<boolean> {
        try {
            const response = await authProvider.post('/admin/change-role', { roleId, userId });
            if (response.status !== 204) return false;
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async listUsers(): Promise<UserList[] | null> {
        try {
            const response = await authProvider.get('/admin/users');
            const data = listUsersOutSchema.parse(response.data);
            return data.result;
        }
        catch (error) {
            console.error('Error listing users:', error);
            return null;
        }
    }
    async createUser(newUser: CreateUser): Promise<number | null> {
        try {
            const response = await authProvider.post('/admin/users', newUser);
            return response.data.id;
        } catch (error) {
            return null;
        }
    }
    async listPermissions(): Promise<Permission[] | null> {
        try {
            const response = await authProvider.get('/admin/permissions');
            const data = listPermissionsOutSchema.parse(response.data);
            return data.permissions;
        } catch (error) {
            return null;
        }
    }
    async addPermissions(newPermission: Omit<Permission, 'id'>): Promise<number | null> {
        try {
            const response = await authProvider.post('/admin/permissions', newPermission);
            return response.data.id;
        } catch (error) {
            return null;
        }
    }
    async editPermissions(permission: Permission): Promise<boolean> {
        try {
            await authProvider.put('/admin/permissions', permission);
            return true;
        } catch (error) {
            return false;
        }
    }
    async removePermissions(permissionId: number): Promise<boolean> {
        try {
            await authProvider.delete(`/admin/permissions/${permissionId}`);
            return true;
        } catch (error) {
            return false;
        }
    }
    async listRoles(): Promise<Role[] | null> {
        try {
            const response = await authProvider.get('/admin/roles');
            const data = listRolesOutSchema.parse(response.data);
            return data.roles;
        } catch (error) {
            return null;
        }
    }
    async addRole(roleName: string): Promise<number | null> {
        try {
            const response = await authProvider.post('/admin/roles', { name: roleName });
            return response.data.id;
        } catch (error) {
            return null;
        }
    }
    async editRole(role: EditRoleIn): Promise<boolean> {
        try {
            await authProvider.put('/admin/roles', role);
            return true;
        } catch (error) {
            return false;
        }
    }
    async deleteRole(roleId: number): Promise<boolean> {
        try {
            await authProvider.delete(`/admin/roles/${roleId}`);
            return true;
        } catch (error) {
            return false;
        }

    }
}

export default new AuthService();
