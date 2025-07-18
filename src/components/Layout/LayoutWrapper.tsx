import NavBar from "./NavBar";
import Footer from "./Footer";
import { Outlet } from "react-router";
import { CartProvider } from "../../pages/Lojinha/hooks/useCart";

const LayoutWrapper = () => {
    return (
        <CartProvider>
            <div className="flex flex-col min-h-screen w-screen">
                <NavBar />
                <main className="flex-1 flex flex-col">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </CartProvider>
    );
};
export default LayoutWrapper;

