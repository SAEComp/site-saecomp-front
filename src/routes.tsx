import { lazy, Suspense } from "react";
import LayoutWrapper from "./components/Layout/LayoutWrapper";
import Spinner from "./components/Spinner/Spinner";
import { AuthProvider } from "./auth/AuthContext";
import { createBrowserRouter } from "react-router";
import RequireAuth from "./auth/RequireAuth";
import AuthPermissions from "./auth/AuthPermissions";

// Lazy imports — cada página vira chunk separado
const Home                  = lazy(() => import("./pages/Home"));
const Enfases               = lazy(() => import("./pages/Enfases"));
const Manual                = lazy(() => import("./pages/Manual-Bixo"));
const SAEcomp               = lazy(() => import("./pages/SAEComp"));
const Login                 = lazy(() => import("./pages/Login"));
const Error                 = lazy(() => import("./pages/Error"));
const UsersRoles            = lazy(() => import("./pages/UsersRoles"));
const TeacherFeedback       = lazy(() => import("./pages/TeacherFeedback"));
const TeacherFeedbackAdmin  = lazy(() => import("./pages/TeacherFeedbackAdmin"));
const TeacherFeedbackResults= lazy(() => import("./pages/TeacherFeedbackResults"));
const TeacherEvaluationMenu = lazy(() => import("./pages/TeacherEvaluationMenu"));
const TeacherQuestionsEdit  = lazy(() => import("./pages/TeacherQuestionsEdit"));

// Lojinha — chunk separado
const LojinhaLayout         = lazy(() => import("./pages/Lojinha/LojinhaLayout"));
const Lojinha               = lazy(() => import("./pages/Lojinha/Home/page"));
const ProductDetails        = lazy(() => import("./pages/Lojinha/ProductDetails/page"));
const CartPage              = lazy(() => import("./pages/Lojinha/Cart/page"));
const Checkout              = lazy(() => import("./pages/Lojinha/Checkout/page"));
const OrderSuccess          = lazy(() => import("./pages/Lojinha/OrderSuccess/page"));
const Leaderboard           = lazy(() => import("./pages/Lojinha/Leaderboard/page"));
const LojinhaGerenciamento  = lazy(() => import("./pages/Lojinha/Admin/page"));

const Loading = () => (
    <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
    </div>
);

const S = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<Loading />}>{children}</Suspense>
);

const routes = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthProvider>
                <LayoutWrapper />
            </AuthProvider>
        ),
        errorElement: <S><Error /></S>,
        children: [
            {
                index: true,
                element: <S><Home /></S>,
            },
            {
                path: "saecomp",
                element: <S><SAEcomp /></S>,
            },
            {
                path: "enfases",
                element: <S><Enfases /></S>,
            },
            {
                path: "manual",
                element: <S><Manual /></S>,
            },
            {
                path: "lojinha",
                element: <RequireAuth />,
                children: [
                    {
                        element: <S><LojinhaLayout /></S>,
                        children: [
                            {
                                index: true,
                                element: <S><Lojinha /></S>,
                            },
                            {
                                path: "loja",
                                element: <S><Lojinha /></S>,
                            },
                            {
                                path: "produto/:id",
                                element: <S><ProductDetails /></S>,
                            },
                            {
                                path: "carrinho",
                                element: <S><CartPage /></S>,
                            },
                            {
                                path: "checkout",
                                element: <S><Checkout /></S>,
                            },
                            {
                                path: "sucesso/:orderId",
                                element: <S><OrderSuccess /></S>,
                            },
                            {
                                path: "podio",
                                element: <S><Leaderboard /></S>,
                            },
                            {
                                path: "admin",
                                element: <S><LojinhaGerenciamento /></S>,
                            },
                        ],
                    },
                ],
            },
            {
                path: "login",
                element: <S><Login /></S>,
            },
            {
                path: "avaliacoes",
                element: <RequireAuth />,
                children: [
                    {
                        index: true,
                        element: <S><TeacherEvaluationMenu /></S>,
                    },
                    {
                        path: "resultados",
                        element: <AuthPermissions permissions={['evaluation:results']}>
                            <S><TeacherFeedbackResults /></S>
                        </AuthPermissions>
                    },
                    {
                        path: "avaliacao",
                        element: <AuthPermissions permissions={['evaluation:create']}>
                            <S><TeacherFeedback /></S>
                        </AuthPermissions>
                    },
                    {
                        path: "admin",
                        children: [
                            {
                                path: "resultados",
                                element: <AuthPermissions permissions={['evaluation:review']}>
                                    <S><TeacherFeedbackAdmin /></S>
                                </AuthPermissions>,
                            },
                            {
                                path: "questoes",
                                element: <AuthPermissions permissions={['evaluation:edit']}>
                                    <S><TeacherQuestionsEdit /></S>
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
                        element: <S><UsersRoles /></S>,
                    },
                ],
            },
        ],
    },
]);

export default routes;
