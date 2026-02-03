// Função para extrair primeiro e último nome
export const getFirstAndLastName = (fullName: string): string => {
    if (!fullName || fullName.trim() === '') {
        return 'Cliente Anônimo';
    }
    
    const nameParts = fullName.trim().split(' ').filter(part => part.length > 0);
    
    if (nameParts.length === 0) {
        return 'Cliente Anônimo';
    } else if (nameParts.length === 1) {
        return nameParts[0];
    } else {
        return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
    }
};

// Formatar tempo restante como MM:SS
export const formatTimeLeft = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Calcular tempo restante baseado na data de criação do pedido
export const calculateTimeLeft = (createdAt: Date, timeout: number): number => {
    const now = new Date();
    const elapsedSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);
    const remaining = timeout - elapsedSeconds;
    return Math.max(0, remaining);
};
