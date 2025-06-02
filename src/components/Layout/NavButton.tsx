import { Link } from "react-router";
import { ReactNode } from "react";

interface NavButtonProps {
    navigateTo: string;
    children: ReactNode;
}

const NavButton = ({ navigateTo, children }: NavButtonProps) => {
    return (
        <Link
            to={navigateTo}
            className="relative text-white text-lg cursor-pointer group font-bold text-center"
        >
            {children}
            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 ease-in-out group-hover:w-full"></span>
        </Link>
    )
}

export default NavButton;