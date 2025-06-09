import { AuthProvider } from "./AuthContext";
import { Outlet } from "react-router";

const AuthWrapper: React.FC = () => {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    );
};

export default AuthWrapper;