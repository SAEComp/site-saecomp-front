<h1 align="center">Front-end do site da SAEComp</h1>

## Lojinha Integrada

Este projeto agora inclui a **Lojinha SAEComp** totalmente integrada! 🛒

### Backend da Lojinha
O backend está localizado em `backend/` e oferece uma API REST completa para:
- Gerenciamento de produtos (doces, salgados, bebidas)
- Sistema de pedidos
- Integração com pagamentos PIX
- Banco de dados local (JSON)

### Frontend da Lojinha
Interface moderna e responsiva integrada ao site principal:
- Catálogo de produtos com filtros
- Carrinho de compras
- Sistema de checkout
- Área administrativa (requer permissões)

## Como rodar para desenvolvimento

### Configuração Inicial
1. **Instalar dependências:**
```bash
npm run setup
```
Isso instalará as dependências do frontend e backend automaticamente.

2. **Configurar variáveis de ambiente (.env):**
```ini
# APIs existentes
VITE_TEACHER_EVALUATION_API_URL=
VITE_AUTH_API_URL=
VITE_GOOGLE_CLIENT_ID=

# Lojinha Backend (já configurado)
VITE_LOJINHA_API_URL=http://localhost:5001/api
VITE_APP_NAME=SAEComp
VITE_NODE_ENV=development
```

### Desenvolvimento

**Opção 1 - Tudo junto (recomendado):**
```bash
npm run dev:full
```
Isso iniciará o backend (porta 5001) e frontend (porta 5173) simultaneamente.

**Opção 2 - Separadamente:**
```bash
# Terminal 1 - Backend
npm run backend:dev

# Terminal 2 - Frontend  
npm run dev
```

### Scripts Disponíveis

#### Frontend + Backend
- `npm run setup` - Instala dependências de ambos
- `npm run dev:full` - Inicia frontend e backend juntos
- `npm run dev` - Apenas frontend
- `npm run build` - Build do frontend

#### Backend (Lojinha)
- `npm run backend:install` - Instala dependências do backend
- `npm run backend:dev` - Backend em modo desenvolvimento
- `npm run backend:build` - Build do backend
- `npm run backend:start` - Inicia backend em produção

## Acessos

### Frontend
- **Site principal:** http://localhost:5173
- **Lojinha:** http://localhost:5173/lojinha

### Backend API
- **Health check:** http://localhost:5001/health
- **Produtos:** http://localhost:5001/api/products
- **Documentação completa:** `backend/README.md`

## Estrutura da Lojinha

```
backend/                    # Backend da lojinha
├── src/                   # Código fonte TypeScript
├── data/                  # Banco de dados JSON
├── dist/                  # Código compilado
└── README.md             # Documentação detalhada

src/pages/Lojinha/         # Frontend da lojinha
├── components/           # Componentes específicos
├── services/            # Serviços de API
├── types/              # Tipos TypeScript
└── hooks/              # Hooks personalizados
```

## Funcionalidades da Lojinha

### Para Clientes
- ✅ Navegação por categorias (doces, salgados, bebidas)
- ✅ Busca e filtros de produtos
- ✅ Carrinho de compras persistente
- ✅ Checkout com dados do cliente
- ✅ Pagamento via PIX (simulação)
- ✅ Acompanhamento de pedidos

### Para Administradores
- ✅ Gerenciamento de produtos
- ✅ Controle de estoque
- ✅ Visualização de pedidos
- ✅ Relatórios de vendas
- ✅ Status de pagamentos

## Tecnologias Utilizadas

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router
- Axios (HTTP client)
- Material-UI components

### Backend
- Node.js + Express
- TypeScript
- JSON Database (arquivo local)
- JWT Authentication
- QR Code generation (PIX)
- CORS configurado

## Como criar a build do projeto
Adicionar .env com:
```ini
VITE_TEACHER_EVALUATION_API_URL=
VITE_AUTH_API_URL=
VITE_GOOGLE_CLIENT_ID=
```

`npm install`

`npm run dev`

## Como criar a build do projeto

`npm install`

`npm run build`

Os arquivos de build ficam disponíveis no diretório `dist`

## Como fazer contribuições
Utilize o [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow) como fluxo para alterar o código do repositório

Exemplo:
1. **Crie uma nova branch a partir da `main`**:
```bash
git checkout -b feature/<nome-da-feature>
```
2. **Faça as alterações localmente e use commits seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/)**:

`feat: <descrição da feature>`

`fix: <descrição do erro corrigido>`

3. **Suba a branch para o GitHub**:
```bash
git push origin feature/<nome-da-feature>
```

4. **Abra um PR (pull request) para a branch main**:
- Descreva o que foi feito
- Relacione algum issue, caso ele exista
- Escolha pelo menos um revisor para aprovar sua alteração

5. **Caso o PR seja aprovado, faça merge na main**

<p align="center"> 
© <a href="mailto:saecomp@usp.br">SAEComp</a> <3 
<br>
Secretaria Acadêmica da Engenharia de Computação | USP São Carlos
</p>

