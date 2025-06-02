import { createBrowserRouter } from "react-router";

import Home from "./pages/Home";
import Enfases from "./pages/Enfases";
import Manual from "./pages/Manual-Bixo";
import SAEcomp from "./pages/SAEComp";
import Login from "./pages/Login";
import TeacherFeedback from "./pages/TeacherFeedback";
import TeacherFeedbackResults from "./pages/TeacherFeedbackResults";
import LayoutWrapper from "./components/Layout/LayoutWrapper";



const router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutWrapper />,
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
                path: "/avaliacao",
                element: <TeacherFeedback />
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
                path: "/resultados",
                element: <TeacherFeedbackResults />
            },
            {
                path: "/login",
                element: <Login />
            }
        ]
    }
]);

export default router;

