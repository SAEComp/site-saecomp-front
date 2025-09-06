const fs = require('fs');
const path = require('path');

// Lê o arquivo de pedidos
const ordersPath = path.join(__dirname, 'data', 'orders.json');
const ordersData = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));

console.log('Status antes da normalização:');
const statusCount = {};
ordersData.forEach(order => {
    statusCount[order.status] = (statusCount[order.status] || 0) + 1;
});
console.log(statusCount);

// Normaliza os status
ordersData.forEach(order => {
    switch(order.status) {
        case 'pending':
            order.status = 'pendente';
            break;
        case 'confirmed':
        case 'delivered':
        case 'ready':
        case 'preparing':
            order.status = 'concluído';
            break;
        case 'cancelled':
            order.status = 'cancelado';
            break;
        // Se já estiver normalizado, mantém
        case 'pendente':
        case 'concluído':
        case 'cancelado':
            break;
        default:
            console.log(`Status desconhecido encontrado: ${order.status}`);
            order.status = 'pendente'; // Default para pendente
    }
    
    // Normaliza também o paymentStatus
    if (order.paymentStatus) {
        switch(order.paymentStatus) {
            case 'pending':
                order.paymentStatus = 'pendente';
                break;
            case 'completed':
            case 'complete':
                order.paymentStatus = 'completo';
                break;
            case 'failed':
                order.paymentStatus = 'falhado';
                break;
            case 'cancelled':
                order.paymentStatus = 'cancelado';
                break;
            // Se já estiver normalizado, mantém
            case 'pendente':
            case 'completo':
            case 'falhado':
            case 'cancelado':
                break;
            default:
                console.log(`PaymentStatus desconhecido encontrado: ${order.paymentStatus}`);
                order.paymentStatus = 'pendente'; // Default para pendente
        }
    }
});

console.log('\nStatus após a normalização:');
const newStatusCount = {};
ordersData.forEach(order => {
    newStatusCount[order.status] = (newStatusCount[order.status] || 0) + 1;
});
console.log(newStatusCount);

// Salva o arquivo atualizado
fs.writeFileSync(ordersPath, JSON.stringify(ordersData, null, 2));
console.log('\nArquivo orders.json atualizado com sucesso!');
