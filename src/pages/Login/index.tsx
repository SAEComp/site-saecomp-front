import { useEffect, useRef } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useLocation, useNavigate } from "react-router";


const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, isAuthenticated, user } = useAuth();
    const signInDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const redirect = location.state?.from?.pathname || null;
        if (user && redirect) navigate(redirect, { replace: true });
    }, [user])

    async function handleSignout() {
        try {
            await logout();

        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    useEffect(() => {
        console.log(user, isAuthenticated)
        if (isAuthenticated) return;

        const docGetId = signInDiv.current;
        if (!docGetId) throw new Error("signInDiv ref is not set");
        google.accounts.id.renderButton(docGetId, {
            theme: "outline",
            size: "large",
            shape: "pill",
            type: "standard"
        });

    }, [isAuthenticated]);

    return (
        <div className="flex flex-1 items-center justify-center bg-gray-100 py-12 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
                <h1 className="text-2xl font-bold mb-6">Login com Google</h1>
                {!isAuthenticated && (<div ref={signInDiv} className="mb-4 flex justify-center"></div>)}

                {isAuthenticated && (
                    <div className="mt-6">
                        <img
                            src={user?.picture}
                            alt="Foto do usuário"
                            className="w-20 h-20 mx-auto rounded-full mb-4 shadow"
                        />
                        <h3 className="text-lg font-semibold">{user?.name}</h3>
                        <button
                            onClick={handleSignout}
                            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition"
                        >
                            Sair
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
