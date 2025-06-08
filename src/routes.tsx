import Home from "./pages/Home";
import Enfases from "./pages/Enfases";
import Manual from "./pages/Manual-Bixo";
import SAEcomp from "./pages/SAEComp";
import Login from "./pages/Login";
import TeacherFeedback from "./pages/TeacherFeedback";
import TeacherFeedbackResults from "./pages/TeacherFeedbackResults";
import LayoutWrapper from "./components/Layout/LayoutWrapper";
import Error from "./pages/Error";
import TeacherEvaluationMenu from "./pages/TeacherEvaluationMenu";
import RequireAuth from "./auth/RequireAuth";
import UsersRoles from "./pages/UsersRoles";
import { AuthProvider } from "./auth/AuthContext";
import { createBrowserRouter } from "react-router";



const routes = createBrowserRouter([
    {
        path: "/",
        element: <AuthProvider><LayoutWrapper /></AuthProvider>,
        errorElement: <Error />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/saecomp",
                element: <SAEcomp />
            },
            {
                path: "/enfases",
                element: <Enfases />
            },
            {
                path: "/manual",
                element: <Manual />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/avaliacoes",
                element: <RequireAuth />,
                children: [
                    {
                        path: "/avaliacoes",
                        element: <TeacherEvaluationMenu />
                    },
                    {
                        path: "/avaliacoes/resultados",
                        element: <TeacherFeedbackResults />
                        
                    },
                    {
                        path: "/avaliacoes/avaliacao",
                        element: <TeacherFeedback />
                    }
                ]
            },
            {
                path: "/admin",
                element: <RequireAuth role="admin" />,
                children: [
                    {
                        path: "/admin/usuarios",
                        element: <UsersRoles />
                    }
                ]
            }
        ]
    }
]);

export default routes;

