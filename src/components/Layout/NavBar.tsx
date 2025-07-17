import { useState } from "react";
import logo from '../../assets/svg/logo.svg';
import { useNavigate, useLocation } from "react-router";
import NavButton from "./NavButton.tsx";
import { Link } from "react-router";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from "../../auth/AuthContext.tsx";
import homeIcon from '../../assets/lojinha-icons/Home.png';
import carrinhoIcon from '../../assets/lojinha-icons/carrinho.png';
import loginIcon from '../../assets/lojinha-icons/Login.png';


const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    
    // Verifica se estamos na página da lojinha ou suas sub-rotas
    const isLojinhaPage = location.pathname.startsWith('/lojinha');

    return (
        <div className="h-[100px] w-screen bg-[#03B04B] flex items-center justify-between z-10 px-[3%] sm:px-[5%] sticky top-0">
            <Link to="/" className={`${isLojinhaPage ? 'h-[30%] sm:h-[40%]' : 'h-[40%]'} mr-2 sm:mr-5`}>
                <img src={logo} alt="SAEComp" className="h-full cursor-pointer" />
            </Link>

            <div
                className={`flex xl:relative xl:translate-x-0 xl:flex-row xl:shadow-none xl:rounded-none xl:p-0 ${isLojinhaPage ? 'gap-4 sm:gap-4' : 'gap-8'} items-center ${isLojinhaPage ? 'xl:flex' : 'fixed top-0 right-0 flex-col bg-[#03B04B] pt-20 pb-7 px-4 rounded-xl z-10 shadow ease-in-out transition-transform duration-300'} ${!isLojinhaPage && isMenuOpen ? "translate-x-0" : !isLojinhaPage ? "translate-x-full" : ""}`}
            >
                {!isLojinhaPage && (
                    <>
                        {user?.permissions?.includes('users:edit') && (
                            <NavButton navigateTo="/admin/usuarios" onClick={toggleMenu}>Admin</NavButton>
                        )}
                        
                        <NavButton navigateTo="/saecomp" onClick={toggleMenu}>A SAEComp</NavButton>
                        <NavButton navigateTo="/lojinha" onClick={toggleMenu}>Lojinha</NavButton>
                        <NavButton navigateTo="/manual" onClick={toggleMenu}>Manual</NavButton>
                        <NavButton navigateTo="/avaliacoes" onClick={toggleMenu}>Avaliação de Professores</NavButton>
                        <NavButton navigateTo="/enfases" onClick={toggleMenu}>Ênfases</NavButton>
                    </>
                )}

                {/* Ícones da lojinha quando estamos na lojinha */}
                {isLojinhaPage && (
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link 
                            to="/lojinha" 
                            className="p-1 sm:p-2 hover:bg-green-600 rounded-md transition-all duration-200 group"
                            title="Página inicial da lojinha"
                        >
                            <img src={homeIcon} alt="Home" className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-200 group-hover:scale-110" />
                        </Link>
                        <Link 
                            to="/lojinha/carrinho" 
                            className="p-1 sm:p-2 hover:bg-green-600 rounded-md transition-all duration-200 group"
                            title="Ver carrinho"
                        >
                            <img src={carrinhoIcon} alt="Carrinho" className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-200 group-hover:scale-110" />
                        </Link>
                    </div>
                )}
        
                {isAuthenticated ? (
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => {navigate('/login'); toggleMenu()}}>
                        <img
                            src={user?.picture}
                            alt="user"
                            className={`${isLojinhaPage ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-8 h-8'} rounded-full border`}
                        />
                        <span className={`text-sm text-white font-bold ${isLojinhaPage ? 'hidden sm:inline' : ''}`}>{user?.name}</span>
                    </div>

                ) : (
                    <Link 
                        to="/login" 
                        onClick={toggleMenu} 
                        className="p-1 sm:p-2 hover:bg-green-600 rounded-md transition-all duration-200 group"
                        title="Fazer login"
                    >
                        <img src={loginIcon} alt="Login" className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-200 group-hover:scale-110" />
                    </Link>
                )}
            </div>

            {!isLojinhaPage && (
                <div className="xl:hidden cursor-pointer z-10 text-white" onClick={toggleMenu}>
                    {
                        isMenuOpen ? (
                            <CloseIcon />
                        ) : (
                            <MenuIcon />
                        )
                    }
                </div>
            )}
        </div>
    );
};

export default NavBar;
