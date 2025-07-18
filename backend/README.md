# Lojinha SAEComp - Backend Integrado

## Visão Geral

Este diretório contém o backend da Lojinha SAEComp integrado ao site principal. O backend oferece uma API REST para gerenciar produtos, pedidos e pagamentos da lojinha virtual.

## Estrutura

```
backend/
├── src/
│   ├── app.ts              # Aplicação principal Express
│   ├── config/
│   │   └── database.ts     # Configuração do banco de dados (JSON)
│   ├── controllers/        # Controladores das rotas
│   ├── middleware/         # Middlewares customizados
│   ├── models/            # Modelos de dados
│   ├── routes/            # Definições de rotas
│   ├── types/             # Tipos TypeScript
│   └── validators/        # Validadores de entrada
├── data/                  # Arquivos JSON do banco de dados
└── package.json
```

## Configuração

### Variáveis de Ambiente (.env)

```env
PORT=5001
NODE_ENV=development
JWT_SECRET=saecomp_lojinha_secret_key_2025
ALLOWED_ORIGINS=http://localhost:5173,http://saecomp.icmc.usp.br
PIX_KEY=contato@saecomp.com
DB_PATH=./data
```

### Instalação

```bash
# No diretório raiz do projeto
npm run setup

# Ou apenas o backend
npm run backend:install
```

## Scripts Disponíveis

### Frontend (raiz do projeto)
- `npm run dev` - Inicia apenas o frontend
- `npm run backend:dev` - Inicia apenas o backend
- `npm run dev:full` - Inicia frontend e backend simultaneamente
- `npm run setup` - Instala dependências do frontend e backend

### Backend (diretório backend/)
- `npm run dev` - Desenvolvimento com auto-reload
- `npm run build` - Build para produção
- `npm run start` - Inicia versão de produção

## API Endpoints

### Produtos
- `GET /api/products` - Lista produtos com filtros opcionais
- `GET /api/products/:id` - Busca produto por ID
- `GET /api/products/category/:category` - Produtos por categoria

### Pedidos
- `POST /api/orders` - Cria novo pedido
- `GET /api/orders/:id` - Busca pedido por ID
- `PATCH /api/orders/:id/status` - Atualiza status do pedido

### Pagamentos
- `POST /api/payments/pix/generate` - Gera pagamento PIX
- `POST /api/payments/confirm` - Confirma pagamento
- `GET /api/payments/status/:id` - Status do pagamento

### Health Check
- `GET /health` - Verifica se o servidor está funcionando

## Banco de Dados

O backend utiliza arquivos JSON como banco de dados local:

- `data/products.json` - Produtos da lojinha
- `data/orders.json` - Pedidos realizados

Os arquivos são criados automaticamente com dados iniciais se não existirem.

## Integração com o Frontend

O frontend está configurado para se comunicar com o backend através da variável de ambiente:

```env
VITE_LOJINHA_API_URL=http://localhost:5001/api
```

## CORS

O backend está configurado para aceitar requisições de:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Create React App)
- `http://saecomp.icmc.usp.br` (Produção)

## Desenvolvimento

Para desenvolvimento local:

1. Instale as dependências: `npm run setup`
2. Inicie frontend e backend: `npm run dev:full`
3. Acesse http://localhost:5173 para o frontend
4. API disponível em http://localhost:5001

## Produção

Para deploy em produção:

1. Build do backend: `npm run backend:build`
2. Build do frontend: `npm run build`
3. Configure variáveis de ambiente apropriadas
4. Inicie o backend: `npm run backend:start`
5. Sirva os arquivos estáticos do frontend

## Estrutura de Dados

### Produto
```typescript
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'doces' | 'salgados' | 'bebidas';
  stock: number;
  isActive: boolean;
}
```

### Pedido
```typescript
interface Order {
  _id: string;
  customerName?: string;
  customerCourse?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod?: 'pix';
}
```

## Logs e Debugging

O backend registra logs importantes no console, incluindo:
- Inicialização do servidor
- Requisições de API
- Erros de validação
- Status de conexão com o banco de dados

## Suporte

Para problemas ou dúvidas sobre a integração da lojinha, consulte:
- Documentação do projeto principal
- Issues no repositório
- Contato: contato@saecomp.com
