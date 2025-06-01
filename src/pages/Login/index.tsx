import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import jwtDecode from "jwt-decode";

export interface userI {
  name: string | null;
  iat?: number;
  iss?: string;
  picture?: string;
}

const Login: React.FC = () => {
  const [user, setUser] = useState<userI>({ name: null });

  function handleCallbackResponse(response: any) {
    const userObject = jwtDecode(response.credential);
    setUser(userObject as userI);
    document.getElementById("signInDiv")!.hidden = true;
    localStorage.setItem("token", JSON.stringify(userObject));
  }

  function handleSignout() {
    setUser({ name: null });
    document.getElementById("signInDiv")!.hidden = false;
    localStorage.removeItem("token");
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("token");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      document.getElementById("signInDiv")!.hidden = true;
    }
  }, []);

  useEffect(() => {
    /* global google */
    google.accounts!.id.initialize({
      client_id:
        "488131369581-oms526oiaqc55adh4bd8rusd3i8e8qoo.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    const docGetId = document.getElementById("signInDiv")!;
    google.accounts.id.renderButton(docGetId, {
      theme: "outline",
      size: "large",
      shape: "pill",
      width: 240,
    });

    google.accounts.id.prompt();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 flex items-center justify-center bg-gray-100 py-12 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-6">Login com Google</h1>
          <div id="signInDiv" className="mb-4 flex justify-center"></div>

          {user && user.name && (
            <div className="mt-6">
              <img
                src={user.picture}
                alt="Foto do usuário"
                className="w-20 h-20 mx-auto rounded-full mb-4 shadow"
              />
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <button
                onClick={handleSignout}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
