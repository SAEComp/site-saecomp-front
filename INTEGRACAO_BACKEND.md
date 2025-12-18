# 🔧 Plano de Integração - Front-end com Backend Real

## 📊 Status Atual da Limpeza

### ✅ Correções Aplicadas:
1. ✅ Removido arquivo duplicado `componentes/Cart.tsx`
2. ✅ Removida exportação não utilizada de `Cart`
3. ✅ Removida função legada `fetchProducts`
4. ✅ Atualizado comentário em `getAdminStats`
5. ✅ Sem erros de compilação

### 📁 Estrutura Limpa e Organizada:

```
src/pages/Lojinha/
├── Admin/                    # Painel administrativo
│   ├── page.tsx
│   └── components/
├── Cart/                     # Página do carrinho
│   ├── page.tsx
│   └── components/
├── Checkout/                 # Finalização de pedido
│   ├── page.tsx
│   └── components/
├── Home/                     # Página inicial da lojinha
│   ├── page.tsx
│   └── components/
├── OrderSuccess/             # Confirmação de pedido
│   ├── page.tsx
│   └── components/
├── ProductDetails/           # Detalhes do produto
│   ├── page.tsx
│   └── components/
├── componentes/              # Componentes compartilhados
│   ├── BackButton.tsx
│   ├── CategoryTabs.tsx
│   ├── EmptyState.tsx
│   ├── ErrorState.tsx
│   ├── GenericButton.tsx
│   ├── LoadingState.tsx
│   ├── PixModal.tsx
│   ├── ProductCard.tsx
│   ├── ProductModal.tsx
│   ├── StockIndicator.tsx
│   └── index.tsx
├── hooks/                    # Hooks personalizados
│   └── useCart.tsx
├── services/                 # Serviços de API
│   └── api.ts
├── types/                    # Tipos TypeScript
│   └── index.ts
├── utils/                    # Utilitários
│   └── imageUtils.ts
└── LojinhaLayout.tsx         # Layout principal
```

## ⚠️ INCOMPATIBILIDADES IDENTIFICADAS

### 🔴 Problema Crítico: API Incompatível

O front-end atual foi desenvolvido para um **backend simulado/primitivo** diferente do backend real (`site-saecomp-back-lojinha`).

### Diferenças Principais:

#### 1. Estrutura de Rotas
**Front-end Atual:**
- `/api/products`
- `/api/orders`
- `/api/payments/pix/generate`
- `/api/pix-settings`
- `/api/history`

**Backend Real:**
- `/api/lojinha/products`
- `/api/lojinha/cart`
- `/api/lojinha/finish-order`
- `/api/lojinha/admin/orders`
- `/api/lojinha/admin/pix-key`

#### 2. Estrutura de Dados - Produto
**Front-end:**
```typescript
interface Product {
  _id: string;              // MongoDB style
  name: string;
  price: number;
  imageUrl: string;         // camelCase
  category: 'doces' | 'salgados' | 'bebidas';  // PT-BR
  stock: number;
  isActive: boolean;
}
```

**Backend Real:**
```typescript
interface Product {
  id: number;               // PostgreSQL
  name: string;
  value: number;            // não "price"
  imgUrl: string;           // não "imageUrl"
  category: 'sweet' | 'salty' | 'drink';  // EN
  quantity: number;         // não "stock"
  barCode?: string;
}
```

#### 3. Fluxo de Carrinho
**Front-end Atual:**
- Carrinho gerenciado localmente (localStorage + Context)
- Pedido criado direto na finalização

**Backend Real:**
- Carrinho gerenciado no servidor (`/api/lojinha/cart`)
- Sistema de pontuação integrado
- Fluxo: Cart → finish-order → payment

#### 4. Sistema de Pagamento
**Front-end:**
- `POST /api/payments/pix/generate` com orderId
- Retorna `{ qrCode, pixCode, paymentId }`

**Backend Real:**
- `POST /api/lojinha/finish-order` (finaliza e gera PIX)
- Retorna `{ totalValue, paymentData: { paymentId, qrCodeBase64, pixCopiaECola } }`
- Webhook do Mercado Pago em `/api/lojinha/confirm-payment`

## 📋 Próximos Passos para Integração

### Fase 1: Atualização dos Tipos
- [ ] Criar mapeamento entre tipos do front e backend
- [ ] Atualizar interfaces em `types/index.ts`
- [ ] Criar funções de transformação de dados

### Fase 2: Atualização do Serviço de API
- [ ] Atualizar todas as URLs em `services/api.ts`
- [ ] Adaptar payloads de requisição
- [ ] Adaptar parsing de respostas
- [ ] Implementar integração com carrinho do servidor

### Fase 3: Atualização do useCart Hook
- [ ] Migrar de localStorage para API do servidor
- [ ] Implementar sincronização com backend
- [ ] Manter UX fluida com estado local + sync

### Fase 4: Atualização dos Componentes
- [ ] Adaptar Admin para novas rotas
- [ ] Atualizar Checkout para novo fluxo
- [ ] Ajustar exibição de produtos
- [ ] Atualizar sistema de categorias

### Fase 5: Testes e Validação
- [ ] Testar fluxo completo de compra
- [ ] Validar admin panel
- [ ] Testar webhooks de pagamento
- [ ] Validar sistema de pontos

## 🎯 Recomendação

**Sugestão: Criar camada de adaptação**

Criar um arquivo `services/apiAdapter.ts` que:
1. Faz a ponte entre front e back
2. Transforma dados de/para formatos corretos
3. Mantém compatibilidade com código existente
4. Facilita migração gradual

Isso permitirá:
- Manter componentes sem mudanças grandes
- Centralizar lógica de transformação
- Facilitar debugging
- Permitir rollback se necessário

## 📝 Nota Final

O código do front-end está **limpo e bem organizado**, mas foi desenvolvido para uma API diferente. A integração com o backend real requer adaptação significativa da camada de serviços e tipos, mas a estrutura de componentes e UI podem ser mantidas.
