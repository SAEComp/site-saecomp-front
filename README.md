<h1 align="center">Front-end do site da SAEComp</h1>

## Lojinha Integrada

Este projeto inclui a **Lojinha SAEComp** totalmente integrada ao site! 🛒

### Backend da Lojinha
O backend está centralizado no repositório `site-saecomp-back-lojinha` e oferece uma API REST completa para:
- Gerenciamento de produtos (doces, salgados, bebidas)
- Sistema de pedidos
- Integração com pagamentos via Mercado Pago
- Banco de dados PostgreSQL compartilhado
- Autenticação unificada com o sistema principal

### Frontend da Lojinha
Interface moderna e responsiva integrada ao site principal:
- Catálogo de produtos com filtros
- Carrinho de compras
- Sistema de checkout
- Área administrativa (requer permissões)
- Totalmente independente do backend

## Como rodar para desenvolvimento

### Configuração Inicial
1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente (.env):**
```ini
# APIs existentes
VITE_TEACHER_EVALUATION_API_URL=
VITE_AUTH_API_URL=
VITE_GOOGLE_CLIENT_ID=

# Lojinha Backend (apontando para produção por padrão)
VITE_LOJINHA_API_URL=https://api.saecomp.com.br/api
VITE_APP_NAME=SAEComp
VITE_NODE_ENV=development
```

Para desenvolvimento local, você pode configurar `VITE_LOJINHA_API_URL` para apontar para um backend local (ex: `http://localhost:5001/api`).

### Desenvolvimento

```bash
npm run dev
```
Isso iniciará o frontend na porta 5173.

### Scripts Disponíveis

#### Frontend
- `npm run dev` - Inicia o frontend em modo desenvolvimento
- `npm run build` - Build do frontend para produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

#### Deploy
- `npm run predeploy` - Prepara o build para deploy
- `npm run deploy` - Faz deploy para GitHub Pages

## Acessos

### Frontend (Desenvolvimento)
- **Site principal:** http://localhost:5173
- **Lojinha:** http://localhost:5173/lojinha

### Backend API (Produção)
- **API Principal:** https://api.saecomp.com.br/api
- **Repositório do Backend:** site-saecomp-back-lojinha

## Estrutura da Lojinha

```
src/pages/Lojinha/         # Frontend da lojinha
├── components/           # Componentes específicos
├── services/            # Serviços de API
├── types/              # Tipos TypeScript
├── hooks/              # Hooks personalizados
└── utils/              # Funções utilitárias
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

