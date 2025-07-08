import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useLocation, useNavigate } from "react-router";
import useGoogle from "../../auth/useGoogle";
import TextInput from "../../components/Inputs/TextInput";
import { toast } from "sonner";
import FlipCard from "../../components/FlipCard/FlipCard";


const Login = () => {
    const google = useGoogle();
    const navigate = useNavigate();
    const location = useLocation();
    const { login, logout, isAuthenticated, user, googleInitialized, tempCredential } = useAuth();
    const signInDiv = useRef<HTMLDivElement>(null);
    const [nUsp, setNUsp] = useState<string>('');

    useEffect(() => {
        const redirect = location.state?.from?.pathname || null;
        if (user && redirect) navigate(redirect, { replace: true });
    }, [user])

    async function handleSignout() {
        try {
            await logout();

        } catch (error) {
        }
    }

    async function firstLogin() {
        if (!tempCredential) {
            toast.error("Por favor, faça login com o Google primeiro.");
            return;
        }
        if (!nUsp) {
            toast.error("Por favor, insira o número USP.");
            return;
        }
        login(tempCredential, nUsp);
        setNUsp('');
    }

    useEffect(() => {
        if (!google) return;
        if (!googleInitialized) return;
        if (isAuthenticated) return;
        if (!signInDiv.current) return;

        const docGetId = signInDiv.current;
        if (!docGetId) throw new Error("signInDiv ref is not set");
        google.accounts.id.renderButton(docGetId, {
            theme: "outline",
            size: "large",
            shape: "pill",
            type: "standard"
        });

    }, [google, isAuthenticated, googleInitialized]);

    return (
        <div className="flex flex-1 items-center justify-center bg-gray-100 py-12 px-4">
            <FlipCard
                className="w-[320px] h-[400px]"
                flipped={tempCredential !== undefined}
                front={
                    <div className="bg-white shadow-lg rounded-2xl p-8 text-center">
                        <h1 className="text-2xl font-bold mb-6">Login com Google</h1>

                        {!isAuthenticated && (
                            <div ref={signInDiv} className="mb-4 flex justify-center" />
                        )}

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
                }
                back={
                    <div className="bg-white shadow-lg rounded-2xl p-8 text-center">
                        <div className="flex flex-col justify-center items-center gap-8">
                            <div className="bg-[#F1F1F1] rounded-3xl flex flex-col gap-3 p-4">
                                <span className="font-inter">Insira o seu número USP</span>
                                <TextInput label="Digite aqui" value={nUsp} onChange={setNUsp} />
                            </div>
                            <button
                                className="bg-black text-white px-4 py-2 font-bold rounded-md ease-in-out text-lg duration-500 hover:bg-gray-100 hover:text-green-700"
                                onClick={firstLogin}
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default Login;
