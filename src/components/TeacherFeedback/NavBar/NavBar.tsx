import { useState, useEffect } from "react";
import logo from '../../../assets/svg/logo.svg';
import { useNavigate } from "react-router-dom";
import {
  NavBarContainer,
  NavButtonsContainer,
  NavButton,
  LoginButton,
  Logo,
  HamburgerButton,
  SideMenu,
  SideMenuButton
} from "../../../pages/Default/styles.tsx";

interface User {
  name: string | null;
  picture?: string;
}

const NavBar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const savedUser = localStorage.getItem("token");
    // const savedUser = localStorage.setItem("token", JSON.stringify(user));
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <NavBarContainer>
      <Logo alt="logo SaeComp" src={logo} onClick={() => navigate('/')} />

      <NavButtonsContainer>
        <NavButton onClick={() => navigate('/home')}>Home</NavButton>
        <NavButton onClick={() => navigate('/saecomp')}>SAEComp</NavButton>
        <NavButton onClick={() => navigate('/avaliacao')}>Avaliação de Professores</NavButton>
        <NavButton onClick={() => navigate('/enfases')}>Ênfases</NavButton>
        <NavButton onClick={() => navigate('/notas')}>Notas</NavButton>
        <NavButton onClick={() => navigate('/manual')}>Manual</NavButton>

        {user ? (
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/login')}>
            <img
                src={user.picture}
                alt="user"
                className="w-8 h-8 rounded-full border"
            />
            <span className="text-sm font-medium">{user.name}</span>
            </div>

        ) : (
          <LoginButton onClick={() => navigate('/login')}>Login</LoginButton>
        )}
      </NavButtonsContainer>

      <HamburgerButton onClick={toggleMenu}>
        {isMenuOpen ? "✖" : "☰"}
      </HamburgerButton>

      <SideMenu isOpen={isMenuOpen}>
  <SideMenuButton onClick={() => { toggleMenu(); navigate('/home'); }}>Home</SideMenuButton>
  <SideMenuButton onClick={() => { toggleMenu(); navigate('/saecomp'); }}>SAEComp</SideMenuButton>
  <SideMenuButton onClick={() => { toggleMenu(); navigate('/avaliacao'); }}>Avaliação de Professores</SideMenuButton>
  <SideMenuButton onClick={() => { toggleMenu(); navigate('/enfases'); }}>Ênfases</SideMenuButton>
  <SideMenuButton onClick={() => { toggleMenu(); navigate('/notas'); }}>Notas</SideMenuButton>
  <SideMenuButton onClick={() => { toggleMenu(); navigate('/manual'); }}>Manual</SideMenuButton>

  {user ? (
    <SideMenuButton
      style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
      onClick={() => { toggleMenu(); navigate('/login'); }}
    >
      <img
        src={user.picture}
        alt="user"
        style={{ width: 30, height: 30, borderRadius: '50%' }}
      />
      <span>{user.name}</span>
    </SideMenuButton>
  ) : (
    <SideMenuButton onClick={() => { toggleMenu(); navigate('/login'); }}>Login</SideMenuButton>
  )}
</SideMenu>

    </NavBarContainer>
  );
};

export default NavBar;
