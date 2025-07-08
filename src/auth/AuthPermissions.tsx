import { useAuth } from "./AuthContext";
import { Navigate, Outlet } from "react-router";


interface AuthPermissionsProps {
    permissions: string[];
    children?: React.ReactNode;
};

function AuthPermissions({ permissions=[], children }: AuthPermissionsProps) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    const hasPermission = permissions.every(permission => user.permissions.includes(permission));

    if (!hasPermission) {
        return <Navigate to="/" replace />;
    }

    if (children) {
        return <>{children}</>;
    }

    return <Outlet />;

}

export default AuthPermissions;