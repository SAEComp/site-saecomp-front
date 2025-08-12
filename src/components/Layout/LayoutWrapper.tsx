import NavBar from "./NavBar";
import Footer from "./Footer";
import { Outlet } from "react-router";

const LayoutWrapper = () => {
    return (
        <div className="flex flex-col min-h-screen w-screen">
            <NavBar />
            <main className="flex-1 flex flex-col">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};
export default LayoutWrapper;

