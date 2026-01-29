import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { GenericButton } from '../componentes';
import Table, { ITableColumn } from '../../../components/Inputs/Table/Table';
import axios from 'axios';
import inicio1 from '../../../assets/lojinha-icons/perrys/inicio1.png';
import inicio2 from '../../../assets/lojinha-icons/perrys/inicio2.png';
import pedidos from '../../../assets/lojinha-icons/perrys/pedidos.png';
import emptyImage from '../../../assets/lojinha-icons/perrys/pngwing.com.png';
import profileIcon from '../../../assets/lojinha-icons/perrys/profile.png';

interface LeaderboardUser {
    userId: number;
    userName: string;
    userPunctuation: number;
    userPicture?: string;
}

const Leaderboard = () => {
    const navigate = useNavigate();
    const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);
    const [allUsers, setAllUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userPoints, setUserPoints] = useState<number | null>(null);

    useEffect(() => {
        loadLeaderboard();
        loadUserPoints();
    }, []);

    const loadUserPoints = async () => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('authToken') || sessionStorage.getItem('token');
            const API_BASE_URL = import.meta.env.VITE_LOJINHA_API_URL || 'http://localhost:3000/api/lojinha';

            const response = await axios.get(`${API_BASE_URL}/punctuation`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });
            if (response.data) {
                setUserPoints(response.data.userPunctuation ?? 0);
            }
        } catch (err: any) {
            console.error('Erro ao carregar pontuação do usuário:', err);
            setUserPoints(0);
        }
    };

    const loadLeaderboard = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token') || localStorage.getItem('authToken') || sessionStorage.getItem('token');
            const API_BASE_URL = import.meta.env.VITE_LOJINHA_API_URL || 'http://localhost:3000/api/lojinha';

            const response = await axios.get(`${API_BASE_URL}/punctuations`, {
                params: { page: 1, pageSize: 10 },
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });

            if (response.data?.punctuation) {
                const sortedUsers = response.data.punctuation
                    .sort((a: LeaderboardUser, b: LeaderboardUser) => b.userPunctuation - a.userPunctuation);
                
                // Top 3 para o pódio
                const top3 = sortedUsers.slice(0, 3);
                setTopUsers(top3);
                
                // Todos os 10 para a tabela
                setAllUsers(sortedUsers);
            }
        } catch (err: any) {
            console.error('Erro ao carregar ranking:', err);
            setError(err.response?.data?.message || 'Erro ao carregar ranking');
        } finally {
            setLoading(false);
        }
    };

    // Cores e posições do pódio
    const getPodiumStyle = (index: number) => {
        switch (index) {
            case 0: // 1º lugar
                return {
                    height: 'h-48',
                    bgGradient: 'bg-yellow-500',
                    borderColor: 'border-yellow-400',
                    textColor: 'text-yellow-100',
                    badgeBg: 'bg-yellow-500',
                    badgeText: 'text-white',
                    rank: '1º',
                    position: 1,
                    order: 'order-2'
                };
            case 1: // 2º lugar
                return {
                    height: 'h-36',
                    bgGradient: 'bg-gray-500',
                    borderColor: 'border-gray-400',
                    textColor: 'text-gray-100',
                    badgeBg: 'bg-gray-500',
                    badgeText: 'text-white',
                    rank: '2º',
                    position: 2,
                    order: 'order-1'
                };
            case 2: // 3º lugar
                return {
                    height: 'h-28',
                    bgGradient: 'bg-orange-600',
                    borderColor: 'border-orange-500',
                    textColor: 'text-orange-100',
                    badgeBg: 'bg-orange-600',
                    badgeText: 'text-white',
                    rank: '3º',
                    position: 3,
                    order: 'order-3'
                };
            default:
                return {
                    height: 'h-24',
                    bgGradient: 'bg-gray-300',
                    borderColor: 'border-gray-200',
                    textColor: 'text-gray-600',
                    badgeBg: 'bg-gray-400',
                    badgeText: 'text-white',
                    rank: `${index + 1}º`,
                    position: index + 1,
                    order: ''
                };
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-4 md:py-16 px-4 relative">
            <div className="max-w-7xl mx-auto w-full relative">
                {/* Título da página */}
                <div className="text-center mb-4 md:mb-8 pt-2 md:pt-0">
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-800">Ranking de compradores</h1>
                </div>

                {/* Pontuação do usuário logado */}
                {userPoints !== null && (
                    <div className="absolute top-16 md:top-2 right-2 md:right-[8%] z-0">
                        <div className="bg-gray-100 rounded-lg shadow-md px-3 md:px-4 py-2 md:py-3 border border-gray-300">
                            <div className="flex items-center gap-2 md:gap-3">
                                <p className="text-gray-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider">SCORE</p>
                                <p className="text-gray-800 text-lg md:text-2xl font-bold">
                                    {userPoints.toLocaleString('pt-BR')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#03B04B]"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md mx-auto">
                        <img 
                            src={emptyImage} 
                            alt="Erro ao carregar" 
                            className="w-40 h-40 md:w-48 md:h-48 mx-auto mb-4 object-contain"
                        />
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Não foi possível carregar o ranking</h2>
                        <p className="text-gray-600">Ocorreu um erro ao buscar os dados. Tente novamente mais tarde.</p>
                    </div>
                )}

                {!loading && !error && topUsers.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md mx-auto">
                        <img 
                            src={emptyImage} 
                            alt="Sem compradores" 
                            className="w-40 h-40 md:w-48 md:h-48 mx-auto mb-4 object-contain"
                        />
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Ainda não há compradores</h2>
                        <p className="text-gray-600">Seja o primeiro a aparecer no ranking! Faça sua primeira compra na lojinha.</p>
                    </div>
                )}

                {!loading && !error && topUsers.length > 0 && (
                    <div className="flex items-end justify-center gap-2 md:gap-8 min-h-[300px] md:min-h-[500px] px-2 md:px-4">
                        {topUsers.map((user, index) => {
                            const style = getPodiumStyle(index);
                            return (
                                <div
                                    key={user.userId}
                                    className={`flex flex-col items-center ${style.order} flex-1 max-w-[120px] md:max-w-[280px] transform transition-all duration-500 hover:scale-105`}
                                >
                                    {/* Card flutuante do usuário */}
                                    <div className={`text-center w-full relative ${index === 0 || index === 1 ? 'mb-1 md:mb-2' : 'mb-3 md:mb-6'}`}>
                                        {/* Imagem Perry no topo */}
                                        <div className="relative mb-2 md:mb-4">
                                            <img 
                                                src={index === 0 ? inicio1 : index === 1 ? inicio2 : pedidos}
                                                alt={`Perry ${style.rank} lugar`}
                                                className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 object-contain mx-auto"
                                            />
                                        </div>
                                        
                                        {/* Nome do usuário com destaque */}
                                        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-2 md:p-5 border-2 border-gray-100 hover:border-[#03B04B] transition-all duration-300">
                                            <h3 className="font-bold text-gray-800 text-xs md:text-xl mb-2 md:mb-4 break-words hyphens-auto text-center">
                                                {user.userName}
                                            </h3>
                                            
                                            {/* Pontuação com destaque */}
                                            <div className="bg-[#03B04B]/5 rounded-lg md:rounded-xl p-2 md:p-4 border border-[#03B04B]/20">
                                                <p className="text-lg md:text-3xl font-black text-[#03B04B] tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', fontWeight: 900 }}>
                                                    {user.userPunctuation.toLocaleString('pt-BR')}
                                                </p>
                                                <p className="text-[10px] md:text-xs text-gray-500 mt-1">pontos</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pilar do pódio com efeito 3D */}
                                    <div className="relative w-full">
                                        {/* Sombra do pilar */}
                                        <div className="absolute -bottom-2 left-0 right-0 h-4 bg-black/20 blur-lg rounded-full"></div>
                                        
                                        {/* Pilar principal */}
                                        <div
                                            className={`${style.height} ${style.bgGradient} w-full rounded-t-2xl shadow-2xl flex items-center justify-center relative border-4 ${style.borderColor} overflow-hidden group`}
                                        >
                                            {/* Efeito de brilho animado */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                            
                                            {/* Textura sutil */}
                                            <div className="absolute inset-0 opacity-10">
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
                                            </div>
                                            
                                            {/* Número da posição */}
                                            <div className="text-center relative z-10">
                                                <span className={`text-4xl md:text-7xl lg:text-8xl font-black ${style.textColor} drop-shadow-2xl tracking-tighter`} style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', fontWeight: 900 }}>
                                                    {style.position}
                                                </span>
                                            </div>
                                            
                                            {/* Reflexo na base */}
                                            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent"></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Tabela com Top 10 */}
                {!loading && !error && allUsers.length > 0 && (
                    <div className="mt-12 max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Maiores Compradores</h2>
                        <Table<LeaderboardUser>
                            columns={[
                                {
                                    key: 'position',
                                    title: 'Posição',
                                    align: 'center',
                                    width: '80px',
                                    render: (_, __, index) => {
                                        const getMedalStyle = (position: number) => {
                                            switch (position) {
                                                case 0:
                                                    return 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-lg';
                                                case 1:
                                                    return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-white shadow-lg';
                                                case 2:
                                                    return 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white shadow-lg';
                                                default:
                                                    return 'text-gray-700';
                                            }
                                        };

                                        return (
                                            <span className={`text-lg font-bold ${index < 3 ? 'inline-flex items-center justify-center w-8 h-8 rounded-full ' + getMedalStyle(index) : getMedalStyle(index)}`}>
                                                {index < 3 ? (index + 1) : `#${index + 1}`}
                                            </span>
                                        );
                                    }
                                },
                                {
                                    key: 'user',
                                    title: 'Comprador',
                                    dataIndex: 'userName',
                                    render: (_, record) => (
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={record.userPicture || profileIcon}
                                                alt={record.userName}
                                                className="w-10 h-10 rounded-full object-cover shadow-md"
                                            />
                                            <span className="font-medium text-gray-800">{record.userName}</span>
                                        </div>
                                    )
                                },
                                {
                                    key: 'punctuation',
                                    title: 'Pontuação',
                                    dataIndex: 'userPunctuation',
                                    align: 'right',
                                    render: (value) => (
                                        <span className="text-lg font-bold text-[#03B04B]">
                                            {value.toLocaleString('pt-BR')} pts
                                        </span>
                                    )
                                }
                            ]}
                            data={allUsers}
                            emptyText="Nenhum comprador encontrado"
                            responsive={true}
                            mobileView={(record, index) => {
                                const getMedalStyleMobile = (position: number) => {
                                    switch (position) {
                                        case 0:
                                            return 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-lg';
                                        case 1:
                                            return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-white shadow-lg';
                                        case 2:
                                            return 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white shadow-lg';
                                        default:
                                            return 'text-gray-500';
                                    }
                                };

                                return (
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-sm font-bold min-w-[30px] ${index < 3 ? 'inline-flex items-center justify-center w-7 h-7 rounded-full ' + getMedalStyleMobile(index) : getMedalStyleMobile(index)}`}>
                                                {index < 3 ? (index + 1) : `#${index + 1}`}
                                            </span>
                                            <img 
                                                src={record.userPicture || profileIcon}
                                                alt={record.userName}
                                                className="w-10 h-10 rounded-full object-cover shadow-md"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-800">{record.userName}</p>
                                                <p className="text-sm text-[#03B04B] font-bold">{record.userPunctuation.toLocaleString('pt-BR')} pts</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }}
                        />
                    </div>
                )}

                <div className="mt-10 w-full md:max-w-4xl md:mx-auto">
                    <GenericButton onClick={() => navigate('/lojinha')} variant="primary" fullWidth>
                        Voltar para a Lojinha
                    </GenericButton>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
