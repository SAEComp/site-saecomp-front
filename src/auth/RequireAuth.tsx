import { useAuth } from "./AuthContext";
import { useNavigate, useLocation, Outlet } from "react-router";
import { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';

const RequireAuth = ({ role }: { role?: 'admin' | 'user' }) => {
    const [isChecking, setIsChecking] = useState<boolean>(true);
    const { user, checkLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isActive = true;

        async function verify() {
            try {
                await checkLogin();

                if (!user) {
                    navigate("/login", { replace: true, state: { from: location } });
                    return;
                }

                if (role && user.role !== role) {
                    navigate("/", { replace: true });
                    return;
                }
            } catch (err) {
                navigate("/login", { replace: true, state: { from: location } });
                return;
            } finally {
                if (isActive) {
                    setIsChecking(false);
                }
            }
        }

        verify();

        return () => {
            isActive = false;
        };
    }, [location]);

    if (!user || isChecking) return (
        <div className="flex flex-grow justify-center items-center">
            <CircularProgress
                className="text-[#03b04b]"
            />
        </div>
    );
    return (
        <Outlet />
    );
};

export default RequireAuth;