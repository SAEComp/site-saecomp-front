import NavBar from "./NavBar";
import Footer from "./Footer";
import { Outlet } from "react-router";

const LayoutWrapper = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};
export default LayoutWrapper;

