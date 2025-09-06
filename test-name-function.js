// Teste simples para a função getFirstAndLastName
const getFirstAndLastName = (fullName) => {
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

// Testes
console.log('=== Testes da função getFirstAndLastName ===');
console.log('João Silva Santos:', getFirstAndLastName('João Silva Santos')); // Deve retornar: João Santos
console.log('Maria:', getFirstAndLastName('Maria')); // Deve retornar: Maria
console.log('Pedro Henrique de Souza Lima:', getFirstAndLastName('Pedro Henrique de Souza Lima')); // Deve retornar: Pedro Lima
console.log('Ana Beatriz:', getFirstAndLastName('Ana Beatriz')); // Deve retornar: Ana Beatriz
console.log('Cliente Anônimo:', getFirstAndLastName('Cliente Anônimo')); // Deve retornar: Cliente Anônimo
console.log('String vazia:', getFirstAndLastName('')); // Deve retornar: Cliente Anônimo
console.log('Só espaços:', getFirstAndLastName('   ')); // Deve retornar: Cliente Anônimo
console.log('undefined:', getFirstAndLastName(undefined)); // Deve retornar: Cliente Anônimo
