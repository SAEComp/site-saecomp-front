# Lojinha SAEComp - Guia de Integração

## ✅ Integração com Backend Principal

### Configuração Atual:

1. **Backend da Lojinha**
   - ✅ Backend centralizado em `site-saecomp-back-lojinha`
   - ✅ API REST completa integrada com o sistema principal
   - ✅ Banco de dados PostgreSQL compartilhado
   - ✅ Autenticação unificada com o restante do site

2. **Frontend Independente**
   - ✅ Frontend totalmente independente
   - ✅ Integrado ao design do site SAEComp
   - ✅ Configurado para apontar para API de produção
   - ✅ Sem backend local, apenas front-end

3. **Configurações**
   - ✅ Variável `VITE_LOJINHA_API_URL` configurável via .env
   - ✅ URL padrão: `https://api.saecomp.com.br/api`
   - ✅ Autenticação integrada com sistema principal

## Como usar:

### Desenvolvimento
```bash
cd site-saecomp-front
npm install
npm run dev
```
Isso inicia apenas o frontend na porta 5173.

### Acessos
- **Lojinha Frontend (Dev):** http://localhost:5173/lojinha
- **API Backend (Produção):** https://api.saecomp.com.br/api

### Estrutura de URLs da Lojinha
- `/lojinha` - Página principal da lojinha  
- `/lojinha/loja` - Catálogo de produtos
- `/lojinha/carrinho` - Carrinho de compras
- `/lojinha/checkout` - Finalização de pedido
- `/lojinha/admin` - Área administrativa (requer permissões)

### Configurando para Desenvolvimento Local
Se precisar apontar para um backend local durante desenvolvimento, crie um arquivo `.env` na raiz do projeto:

```ini
# Backend local (opcional)
VITE_LOJINHA_API_URL=http://localhost:5001/api
```

## Estado Atual:
- ✅ Backend centralizado em site-saecomp-back-lojinha
- ✅ Frontend independente e padronizado
- ✅ Integração com autenticação do site principal
- ✅ Sem dependências locais de backend
- ✅ Pronto para produção

## Estrutura Final:
```
site-saecomp-front/
├── src/
│   └── pages/Lojinha/   # Frontend da lojinha
│       ├── components/  # Componentes específicos
│       ├── services/    # Integração com API
│       └── types/       # Tipos TypeScript
├── .env                 # Variáveis de ambiente
└── package.json         # Sem scripts de backend
```

A lojinha está integrada e padronizada com o site principal! 🎉
