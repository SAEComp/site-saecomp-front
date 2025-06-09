import { Link } from "react-router";
import { ReactNode } from "react";
import { useLocation } from "react-router";

interface NavButtonProps {
    navigateTo: string;
    onClick?: () => void;
    children: ReactNode;
}

const NavButton = ({ navigateTo, children, onClick }: NavButtonProps) => {
    const location = useLocation();

    return (
        <Link
            to={navigateTo}
            className="relative text-white text-lg cursor-pointer group font-bold text-center"
            onClick={onClick}
        >
            {children}
            <span className={`absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 ease-in-out group-hover:w-full ${location.pathname === navigateTo ? 'w-full' : ''}`}></span>
        </Link>
    )
}

export default NavButton;