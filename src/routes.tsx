import Home from "./pages/Home";
import Enfases from "./pages/Enfases";
import Manual from "./pages/Manual-Bixo";
import SAEcomp from "./pages/SAEComp";
import Login from "./pages/Login";
import LojinhaLayout from "./pages/Lojinha/LojinhaLayout";
import OrderSuccess from "./pages/Lojinha/OrderSuccess";
import Checkout from "./pages/Lojinha/Checkout";
import ProductDetails from "./pages/Lojinha/ProductDetails";
import LojinhaGerenciamento from "./pages/Lojinha/LojinhaGerenciamento";
import LojinhaStore from "./pages/Lojinha/LojinhaStore";
import CartPage from "./pages/Lojinha/CartPage";
import APITest from "./pages/Lojinha/APITest";
import SimpleProductList from "./pages/Lojinha/SimpleProductList";
import ImageTest from "./pages/Lojinha/ImageTest";
import TeacherFeedback from "./pages/TeacherFeedback";
import TeacherFeedbackResults from "./pages/TeacherFeedbackResults";
import LayoutWrapper from "./components/Layout/LayoutWrapper";
import Error from "./pages/Error";
import TeacherEvaluationMenu from "./pages/TeacherEvaluationMenu";
import RequireAuth from "./auth/RequireAuth";
import UsersRoles from "./pages/UsersRoles";
import TeacherQuestionsEdit from "./pages/TeacherQuestionsEdit";
import { AuthProvider } from "./auth/AuthContext";
import { createBrowserRouter } from "react-router";
import TeacherFeedbackAdmin from "./pages/TeacherFeedbackAdmin";
import AuthPermissions from "./auth/AuthPermissions";

const routes = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthProvider>
                <LayoutWrapper />
            </AuthProvider>
        ),
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "saecomp",
                element: <SAEcomp />,
            },
            {
                path: "enfases",
                element: <Enfases />,
            },
            {
                path: "manual",
                element: <Manual />,
            },
            {
                path: "lojinha",
                element: <LojinhaLayout />,
                children: [
                    {
                        index: true,
                        element: <LojinhaStore />,
                    },
                    {
                        path: "loja",
                        element: <LojinhaStore />,
                    },
                    {
                        path: "produto/:id",
                        element: <ProductDetails />,
                    },
                    {
                        path: "carrinho",
                        element: <CartPage />,
                    },
                    {
                        path: "checkout",
                        element: <Checkout />,
                    },
                    {
                        path: "sucesso/:orderId",
                        element: <OrderSuccess />,
                    },
                    {
                        path: "admin",
                        element: <AuthPermissions permissions={["users:edit"]}>
                            <LojinhaGerenciamento />
                        </AuthPermissions>,
                    },
                    {
                        path: "api-test",
                        element: <APITest />,
                    },
                    {
                        path: "simple-test",
                        element: <SimpleProductList />,
                    },
                    {
                        path: "image-test",
                        element: <ImageTest />,
                    },
                ],
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "avaliacoes",
                element: <RequireAuth />,
                children: [
                    {
                        index: true,
                        element: <TeacherEvaluationMenu />,
                    },
                    {
                        path: "resultados",
                        element: <TeacherFeedbackResults />,
                    },
                    {
                        path: "avaliacao",
                        element: <TeacherFeedback />,
                    },
                    {
                        path: "admin",
                        children: [
                            {
                                path: "resultados",
                                element: <AuthPermissions permissions={['evaluation:review']}>
                                    <TeacherFeedbackAdmin />
                                </AuthPermissions>,
                            },
                            {
                                path: "questoes",
                                element: <AuthPermissions permissions={['evaluation:edit']}>
                                    <TeacherQuestionsEdit />
                                    </AuthPermissions>,
                            }
                        ]
                    }

                ],
            },
            {
                path: "admin",
                element: <AuthPermissions permissions={["users:edit"]} />,
                children: [
                    {
                        path: "usuarios",
                        element: <UsersRoles />,
                    },
                ],
            },
        ],
    },
]);

export default routes;
