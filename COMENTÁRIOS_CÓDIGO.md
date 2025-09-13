# DOCUMENTAÇÃO COMPLETA DO CÓDIGO - PHINDEX

## Visão Geral do Projeto

**Phindex** é uma rede social especializada em classificação de fenótipos físicos. A aplicação permite que usuários:

- Cadastrem perfis de pessoas (celebridades ou perfis anônimos)
- Votem em características físicas específicas 
- Visualizem estatísticas de votação
- Comentem e interajam com outros usuários
- Explorem perfis por categoria e região

### Tecnologias Principais
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Sistema de Design personalizado
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Estado**: React Query (TanStack Query)
- **Roteamento**: React Router DOM
- **UI Components**: Radix UI + shadcn/ui

---

## Estrutura de Arquivos

### `/src/` - Código Principal da Aplicação

#### **App.tsx** - Componente Raiz
- Configura todos os providers globais (React Query, Tooltips, Router)
- Define sistema de rotas da aplicação
- Inicializa sistemas de notificação

#### **main.tsx** - Ponto de Entrada
- Inicializa React 18 com createRoot
- Conecta aplicação ao DOM
- Carrega estilos globais

#### **index.css** - Sistema de Design
- Variáveis CSS para cores (HSL)
- Tokens semânticos para temas claro/escuro
- Gradientes, sombras e animações personalizadas
- Sistema de cores específico do Phindex

### `/src/components/` - Componentes React

#### **Header.tsx** - Cabeçalho Principal
- Barra de navegação fixa no topo
- Sistema de busca global
- Menu de usuário com autenticação Google
- Notificações e modal de login

#### **AppSidebar.tsx** - Barra Lateral de Navegação
- Filtros por região geográfica
- Categorias de perfis (celebridades, esportes, etc)
- Links para páginas especiais
- Funcionalidade de logout

#### **Footer.tsx** - Rodapé
- Informações de copyright
- Links para redes sociais
- Design responsivo

#### **ProfileCard.tsx** - Card de Perfil
- Exibe imagem, nome e informações básicas
- Contador de votos
- Sistema de navegação para perfil completo

### `/src/components/ui/` - Componentes de Interface

Esta pasta contém componentes reutilizáveis baseados em Radix UI:

- **button.tsx**: Sistema de botões com variantes
- **card.tsx**: Cards para layout de conteúdo
- **input.tsx**: Campos de entrada de texto
- **dialog.tsx**: Modais e pop-ups
- **toast.tsx**: Sistema de notificações
- **avatar.tsx**: Imagens de perfil com fallback
- E muitos outros componentes de UI

### `/src/hooks/` - Hooks Personalizados

#### **use-auth.tsx** - Gerenciamento de Autenticação
- Estado de usuário logado
- Sessão do Supabase
- Funções de login/logout
- Listeners de mudança de estado

#### **use-user-profiles.tsx** - Gerenciamento de Perfis
- CRUD completo de perfis
- Busca com filtros
- Contagem de votos
- Cache otimizado com React Query

#### **use-voting.tsx** - Sistema de Votação
- Votação em características físicas
- Histórico de votos do usuário
- Estatísticas em tempo real

#### **use-comments.tsx** - Sistema de Comentários
- Comentários hierárquicos
- Likes em comentários
- Notificações automáticas

### `/src/pages/` - Páginas da Aplicação

#### **Index.tsx** - Página Inicial
- Carousel de celebridades populares
- Seção de perfis mais votados
- Perfis recentes da comunidade
- Sistema de navegação por cards

#### **ProfileDetail.tsx** - Detalhes de Perfil
- Visualização completa do perfil
- Sistema de votação por característica
- Seção de comentários
- Estatísticas de votação

#### **UserProfileDetail.tsx** - Perfil de Usuário
- Similar ao ProfileDetail mas para perfis criados por usuários
- Informações do criador
- Sistema de moderação

#### **RegionPage.tsx** - Filtro por Região
- Lista perfis filtrados por região geográfica
- Breadcrumb de navegação
- Layout responsivo

#### **CategoryPage.tsx** - Filtro por Categoria
- Lista perfis por categoria (celebridades, esportes, etc)
- Filtros adicionais
- Paginação

### `/src/integrations/supabase/` - Integração Backend

#### **client.ts** - Cliente Supabase
- Configuração de conexão
- Configurações de autenticação
- Persistence de sessão

#### **types.ts** - Tipos TypeScript (Auto-gerado)
- Interfaces do banco de dados
- Tipos para funções RPC
- Enums e tipos utilitários

---

## Fluxo de Dados

### 1. Autenticação
```
User → Google OAuth → Supabase Auth → Local State (useAuth)
```

### 2. Carregamento de Perfis
```
Component → React Query → Supabase → Cache → UI Update
```

### 3. Sistema de Votação
```
User Vote → Validation → Supabase → Cache Invalidation → UI Refresh
```

### 4. Comentários
```
New Comment → Auth Check → Supabase Insert → Notification → Cache Update
```

---

## Banco de Dados (Supabase)

### Tabelas Principais

#### **user_profiles**
- Armazena perfis de pessoas (celebridades ou usuários)
- Campos: nome, país, gênero, categoria, altura, ancestralidade
- RLS (Row Level Security) para controle de acesso

#### **votes**
- Registra votos em características físicas
- Relaciona usuário + perfil + tipo de característica
- Permite análise estatística

#### **comments**
- Sistema de comentários hierárquicos
- Suporte a replies aninhados
- Contagem de likes

#### **notifications**
- Notificações automáticas
- Triggered por comentários e interações
- Sistema de leitura/não leitura

### Segurança (RLS Policies)
- Usuários só podem editar seus próprios perfis
- Comentários visíveis para todos, editáveis apenas pelo autor
- Votos anônimos mas rastreáveis para evitar duplicatas
- Notificações privadas por usuário

---

## Performance e Otimização

### React Query
- Cache inteligente de dados
- Invalidação automática
- Retry em caso de falha
- Background updates

### Tailwind CSS
- CSS otimizado e tree-shaken
- Sistema de design consistente
- Performance superior ao CSS-in-JS

### Vite
- Hot Module Replacement (HMR)
- Build otimizado para produção
- Code splitting automático

---

## Funcionalidades Principais

### 1. **Sistema de Perfis**
- Upload de imagens (Supabase Storage)
- Validação de dados
- Geração de slugs únicos
- Perfis anônimos vs identificados

### 2. **Votação Fenotípica**
- Múltiplas características por perfil
- Agregação estatística
- Prevenção de voto duplicado
- Visualização em tempo real

### 3. **Interação Social**
- Comentários com threading
- Sistema de likes
- Notificações push
- Moderação básica

### 4. **Navegação Inteligente**
- Filtros por região/categoria
- Busca global
- URLs amigáveis (slugs)
- Breadcrumbs

---

## Padrões de Código

### 1. **Nomenclatura**
- Componentes: PascalCase
- Hooks: camelCase com "use" prefix
- Constantes: SCREAMING_SNAKE_CASE
- Interfaces: PascalCase com sufixo apropriado

### 2. **Estrutura de Componentes**
```typescript
// Imports
// Interface/Type definitions
// Component implementation
// Export default
```

### 3. **Hooks Pattern**
```typescript
// Estado local
// React Query queries
// Mutations
// Effects
// Return object
```

### 4. **Error Handling**
- Try/catch em operações assíncronas
- Toast notifications para feedback
- Fallbacks em componentes
- Loading states consistentes

---

## Deployment e Build

### Desenvolvimento
```bash
npm run dev  # Inicia servidor Vite
```

### Produção
```bash
npm run build  # Build otimizado
npm run preview  # Preview do build
```

### Variáveis de Ambiente
- `VITE_SUPABASE_URL`: URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY`: Chave pública do Supabase

---

## Próximos Passos e Melhorias

### Features Planejadas
1. **Phenotype Flow**: Visualização de árvore genealógica fenotípica
2. **AI Integration**: Classificação automática por IA
3. **Advanced Analytics**: Dashboards estatísticos
4. **Mobile App**: React Native ou PWA

### Otimizações Técnicas
1. **Image Optimization**: WebP/AVIF, lazy loading
2. **SEO**: Meta tags dinâmicas, sitemap
3. **Accessibility**: ARIA labels, keyboard navigation
4. **Performance**: Bundle splitting, CDN

---

Esta documentação serve como guia completo para entender toda a arquitetura e funcionamento do código da aplicação Phindex.