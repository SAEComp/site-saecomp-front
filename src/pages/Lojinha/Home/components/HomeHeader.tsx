import React from 'react';
import { Link } from 'react-router';
import inicio1 from "../../../../assets/lojinha-icons/perrys/inicio1.png";
import inicio2 from "../../../../assets/lojinha-icons/perrys/inicio2.png";

// Cabeçalho da home com Perry's e botão de gerenciamento
interface HomeHeaderProps {
    hasAdminPermission: boolean;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ hasAdminPermission }) => (
    <div className="text-center mb-4 relative">
        {/* Botão de Gerenciamento - Desktop: canto superior direito */}
        {hasAdminPermission && (
            <div className="absolute top-0 right-0 hidden md:block">
                <Link 
                    to="/lojinha/admin"
                    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center gap-2 text-base"
                >
                    <span>Gerenciar</span>
                </Link>
            </div>
        )}
        
        <div className="flex flex-col items-center justify-center mb-4">
            <div className="flex items-center justify-center space-x-4 md:space-x-8 mb-4">
                <img 
                    src={inicio1} 
                    alt="Perry da Lojinha 1" 
                    className="w-20 h-20 md:w-32 md:h-32 object-contain drop-shadow-lg"
                />
                <div className="text-center">
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">Lojinha SAEComp</h1>
                    <p className="text-lg md:text-xl text-gray-600 hidden sm:block">
                        Deliciosos doces, salgados e bebidas
                    </p>
                </div>
                <img 
                    src={inicio2} 
                    alt="Perry da Lojinha 2" 
                    className="w-20 h-20 md:w-32 md:h-32 object-contain drop-shadow-lg"
                />
            </div>
            
            {/* Botão de Gerenciamento - Mobile: abaixo dos Perry, centralizado */}
            {hasAdminPermission && (
                <div className="block md:hidden">
                    <Link 
                        to="/lojinha/admin"
                        className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg font-medium transition duration-200 flex items-center gap-1 text-sm"
                    >
                        <span>Gerenciar</span>
                    </Link>
                </div>
            )}
        </div>
    </div>
);