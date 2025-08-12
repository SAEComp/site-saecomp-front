import { useState } from "react";
import logo from '../../assets/svg/logo.svg';
import { useNavigate } from "react-router";
import NavButton from "./NavButton.tsx";
import { Link } from "react-router";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from "../../auth/AuthContext.tsx";


const NavBar = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="h-[100px] w-screen bg-[#03B04B] flex items-center justify-between z-10 px-[5%] sticky top-0">
            <Link to="/" className="h-[40%] mr-5">
                <img src={logo} alt="SAEComp" className="h-full cursor-pointer" />
            </Link>

            <div
                className={`flex xl:relative xl:translate-x-0 xl:flex-row xl:shadow-none xl:rounded-none xl:p-0 gap-8 items-center fixed top-0 right-0 flex-col bg-[#03B04B] pt-20 pb-7 px-4 rounded-xl z-10 shadow ease-in-out transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {user?.permissions?.includes('users:edit') && (
                    <NavButton navigateTo="/admin/usuarios" onClick={toggleMenu}>Admin</NavButton>
                )}
                <NavButton navigateTo="/saecomp" onClick={toggleMenu}>A SAEComp</NavButton>
                <NavButton navigateTo="/manual" onClick={toggleMenu}>Manual</NavButton>
                <NavButton navigateTo="/avaliacoes" onClick={toggleMenu}>Avaliação de Professores</NavButton>
                <NavButton navigateTo="/enfases" onClick={toggleMenu}>Ênfases</NavButton>

                {isAuthenticated ? (
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => {navigate('/login'); toggleMenu()}}>
                        <img
                            src={user?.picture}
                            alt="user"
                            className="w-8 h-8 rounded-full border"
                        />
                        <span className="text-sm text-white font-bold">{user?.name}</span>
                    </div>

                ) : (
                    <Link to="/login" onClick={toggleMenu} className="bg-black text-white px-4 py-2 font-bold rounded-md ease-in-out text-lg duration-500 hover:bg-white hover:text-green-700">
                        Login
                    </Link>
                )}
            </div>

            <div className="xl:hidden cursor-pointer z-10 text-white" onClick={toggleMenu}>
                {
                    isMenuOpen ? (
                        <CloseIcon />
                    ) : (
                        <MenuIcon />
                    )
                }
            </div>
        </div>
    );
};

export default NavBar;
