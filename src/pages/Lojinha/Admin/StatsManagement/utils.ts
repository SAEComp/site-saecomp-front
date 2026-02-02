// Função utilitária para extrair primeiro e último nome
export const getFirstAndLastName = (fullName: string): string => {
    if (!fullName || fullName.trim() === '' || fullName === 'Cliente Anônimo') {
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

export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
