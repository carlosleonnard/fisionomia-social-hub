# 📋 PHINDEX - Documentação Completa do Projeto

## 🎯 Visão Geral do Projeto

O **PHINDEX** é uma aplicação web de rede social focada na classificação e análise de fenótipos humanos. A plataforma permite aos usuários criar perfis, votar em características físicas, comentar e interagir com conteúdo relacionado a diferentes fenótipos regionais e categoriais.

---

## 🏗️ Arquitetura do Projeto

### 📁 Estrutura de Pastas

```
├── public/                           # Arquivos estáticos públicos
│   ├── phindex-uploads/              # Upload de imagens dos usuários
│   ├── robots.txt                    # Configuração SEO para crawlers
│   └── favicon.ico                   # Ícone da aplicação
│
├── src/                              # Código fonte principal
│   ├── assets/                       # Recursos estáticos (logo, imagens)
│   ├── components/                   # Componentes React reutilizáveis
│   │   ├── ui/                       # Componentes de interface (shadcn/ui)
│   │   ├── Header.tsx                # Cabeçalho da aplicação
│   │   ├── Footer.tsx                # Rodapé da aplicação
│   │   ├── AppSidebar.tsx            # Barra lateral de navegação
│   │   ├── ProfileCard.tsx           # Card de perfil de usuário
│   │   ├── AuthPrompt.tsx            # Prompt de autenticação
│   │   ├── VotingSection.tsx         # Seção de votação
│   │   ├── CommentsSection.tsx       # Seção de comentários
│   │   └── ... (outros componentes)
│   │
│   ├── hooks/                        # React Hooks customizados
│   │   ├── use-auth.tsx              # Hook de autenticação
│   │   ├── use-user-profiles.tsx     # Hook para gerenciar perfis
│   │   ├── use-voting.tsx            # Hook para sistema de votação
│   │   ├── use-comments.tsx          # Hook para comentários
│   │   └── ... (outros hooks)
│   │
│   ├── integrations/                 # Integrações externas
│   │   └── supabase/                 # Configuração do Supabase
│   │       ├── client.ts             # Cliente Supabase
│   │       └── types.ts              # Tipos TypeScript gerados
│   │
│   ├── lib/                          # Utilitários e bibliotecas
│   │   └── utils.ts                  # Funções utilitárias
│   │
│   ├── pages/                        # Páginas da aplicação
│   │   ├── Index.tsx                 # Página inicial
│   │   ├── ProfileDetail.tsx         # Detalhes do perfil
│   │   ├── UserProfileDetail.tsx     # Detalhes do perfil do usuário
│   │   ├── RegionPage.tsx            # Página de regiões
│   │   ├── CategoryPage.tsx          # Página de categorias
│   │   ├── PhenotypeFlowPage.tsx     # Página em construção
│   │   └── NotFound.tsx              # Página 404
│   │
│   ├── App.tsx                       # Componente raiz da aplicação
│   ├── main.tsx                      # Ponto de entrada da aplicação
│   ├── index.css                     # Estilos globais e design system
│   └── vite-env.d.ts                 # Tipos TypeScript para Vite
│
├── supabase/                         # Configuração do backend
│   ├── config.toml                   # Configuração do Supabase
│   └── migrations/                   # Migrações do banco de dados
│
├── tailwind.config.ts                # Configuração do Tailwind CSS
├── vite.config.ts                    # Configuração do Vite
├── tsconfig.json                     # Configuração do TypeScript
└── package.json                      # Dependências e scripts
```

---

## 🎨 Design System

### 🎨 Paleta de Cores (index.css)

O projeto utiliza um design system robusto baseado em variáveis CSS:

#### 🌞 Modo Claro
- **Background**: `210 20% 98%` - Fundo principal claro
- **Foreground**: `190 25% 25%` - Texto principal
- **Primary**: `190 55% 35%` - Cor primária (PHINDEX Teal)
- **Secondary**: `210 15% 92%` - Cor secundária
- **Accent**: `185 40% 45%` - Cor de destaque

#### 🌙 Modo Escuro
- **Background**: `190 25% 8%` - Fundo principal escuro
- **Foreground**: `210 15% 95%` - Texto claro
- **Primary**: `190 55% 45%` - Cor primária adaptada
- **Secondary**: `190 15% 18%` - Cor secundária escura

### 🎭 Tokens de Design Específicos
- **PHINDEX Colors**: Sistema de cores próprio da marca
- **Modal Colors**: Cores específicas para modais
- **Category Colors**: Cores para ícones de categorias
- **Gradients**: Gradientes personalizados
- **Shadows**: Sombras elegantes com variações
- **Animations**: Transições suaves e animações

---

## 🧩 Componentes Principais

### 🏠 Layout Components

#### `Header.tsx`
- **Função**: Cabeçalho da aplicação
- **Recursos**: Logo, navegação, notificações, perfil do usuário
- **Localização**: Fixo no topo da página

#### `AppSidebar.tsx`
- **Função**: Barra lateral de navegação
- **Recursos**: 
  - Navegação por regiões (África, Ásia, Europa, Américas, Oriente Médio, Oceania)
  - Navegação por categorias (Comunidade, Pop Culture, Música, Artes, etc.)
  - Links para configurações, FAQ, contato
  - Logout
- **Localização**: Lateral esquerda (desktop)

#### `Footer.tsx`
- **Função**: Rodapé da aplicação
- **Recursos**: Links institucionais, informações legais

### 👤 Profile Components

#### `ProfileCard.tsx`
- **Função**: Card de exibição de perfil
- **Recursos**: Foto, nome, informações básicas, botões de ação
- **Uso**: Páginas de listagem, carrosséis

#### `UserProfilesList.tsx`
- **Função**: Lista de perfis de usuários
- **Recursos**: Grid responsivo, filtros, paginação

### 🗳️ Interaction Components

#### `VotingSection.tsx`
- **Função**: Sistema de votação em fenótipos
- **Recursos**: Botões de voto, contadores, histórico

#### `CommentsSection.tsx`
- **Função**: Sistema de comentários
- **Recursos**: Comentários aninhados, likes, respostas

#### `PhysicalCharacteristicVoting.tsx`
- **Função**: Votação específica em características físicas
- **Recursos**: Interface especializada para classificação

### 🔐 Auth Components

#### `AuthPrompt.tsx`
- **Função**: Prompt de autenticação
- **Recursos**: Login, registro, validação

#### `LoginModal.tsx`
- **Função**: Modal de login
- **Recursos**: Formulário de autenticação

### 📝 Modal Components

#### `AddProfileModal.tsx`
- **Função**: Modal para adicionar novo perfil
- **Recursos**: Formulário completo, upload de imagens

#### `EditUserProfileModal.tsx`
- **Função**: Modal para editar perfil existente
- **Recursos**: Edição de dados, atualização de imagens

#### `VoteModal.tsx`
- **Função**: Modal para votação detalhada
- **Recursos**: Interface de classificação avançada

### 🔔 Utility Components

#### `NotificationBell.tsx`
- **Função**: Sino de notificações
- **Recursos**: Contador, dropdown de notificações

---

## 🪝 Hooks Customizados

### `use-auth.tsx`
- **Função**: Gerenciamento de autenticação
- **Recursos**: Login, logout, estado do usuário, sessão

### `use-user-profiles.tsx`
- **Função**: Gerenciamento de perfis de usuários
- **Recursos**: CRUD de perfis, listagem, filtros

### `use-voting.tsx`
- **Função**: Sistema de votação
- **Recursos**: Votar, contar votos, histórico de votação

### `use-comments.tsx`
- **Função**: Sistema de comentários
- **Recursos**: CRUD de comentários, aninhamento, moderação

### `use-geographic-voting.tsx`
- **Função**: Votação baseada em geografia
- **Recursos**: Classificação por região, estatísticas geográficas

### `use-physical-voting.tsx`
- **Função**: Votação em características físicas
- **Recursos**: Classificação de fenótipos, análise física

### `use-image-upload.tsx`
- **Função**: Upload de imagens
- **Recursos**: Upload para Supabase Storage, validação, redimensionamento

### `use-profile-creator.tsx`
- **Função**: Criação de perfis
- **Recursos**: Wizard de criação, validação, salvamento

---

## 📄 Páginas da Aplicação

### `Index.tsx` - Página Inicial
- **Função**: Landing page principal
- **Recursos**: 
  - Carrossel de celebridades populares
  - Top perfis de usuários
  - Perfis recentes
  - Navegação por regiões

### `ProfileDetail.tsx` - Detalhes do Perfil
- **Função**: Página de detalhes de um perfil específico
- **Recursos**: 
  - Informações completas do perfil
  - Sistema de votação
  - Comentários
  - Características físicas

### `UserProfileDetail.tsx` - Detalhes do Perfil do Usuário
- **Função**: Página de perfil criado por usuário
- **Recursos**: Similar ao ProfileDetail, com funcionalidades de usuário

### `RegionPage.tsx` - Página de Região
- **Função**: Exibição de perfis por região geográfica
- **Recursos**: 
  - Filtros por divisão e fenótipo
  - Hierarquia geográfica
  - Estatísticas regionais

### `CategoryPage.tsx` - Página de Categoria
- **Função**: Exibição de perfis por categoria
- **Recursos**: 
  - Filtros por categoria
  - Descrições de categorias
  - Contagem de perfis

### `PhenotypeFlowPage.tsx` - Fluxo de Fenótipos
- **Função**: Página em construção
- **Recursos**: Placeholder para futuras funcionalidades

### `NotFound.tsx` - Página 404
- **Função**: Página de erro para rotas inexistentes
- **Recursos**: Redirecionamento, navegação alternativa

---

## 🗄️ Banco de Dados (Supabase)

### 📊 Principais Tabelas

#### `user_profiles`
- **Função**: Armazenar perfis de usuários
- **Campos**: id, user_id, name, country, gender, category, height, ancestry, images, etc.

#### `votes`
- **Função**: Sistema de votação
- **Campos**: user_id, profile_id, classification, etc.

#### `comments`
- **Função**: Sistema de comentários
- **Campos**: user_id, profile_id, content, parent_comment_id, etc.

#### `notifications`
- **Função**: Sistema de notificações
- **Campos**: user_id, type, message, profile_id, comment_id, etc.

#### `profiles`
- **Função**: Perfis básicos de usuários autenticados
- **Campos**: id, name, email, updated_at

### 🔧 Funções do Banco

#### `generate_unique_slug()`
- **Função**: Gerar slugs únicos para perfis
- **Uso**: Criação de URLs amigáveis

#### `compute_region_from_general()`
- **Função**: Computar região baseada no fenótipo geral
- **Uso**: Classificação automática por região

#### `create_notification()`
- **Função**: Criar notificações
- **Uso**: Sistema de notificações em tempo real

#### `delete_comment_and_children()`
- **Função**: Deletar comentários e seus filhos
- **Uso**: Moderação de comentários

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18**: Biblioteca principal
- **TypeScript**: Tipagem estática
- **Vite**: Build tool e dev server
- **Tailwind CSS**: Framework de estilização
- **React Router**: Roteamento
- **React Query**: Gerenciamento de estado de servidor
- **Shadcn/ui**: Biblioteca de componentes
- **Lucide React**: Ícones

### Backend
- **Supabase**: Backend as a Service
- **PostgreSQL**: Banco de dados
- **Row Level Security**: Segurança de dados
- **Supabase Auth**: Autenticação
- **Supabase Storage**: Armazenamento de arquivos

### Desenvolvimento
- **ESLint**: Linting
- **PostCSS**: Processamento CSS
- **Bun**: Gerenciador de pacotes

---

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev         # Inicia servidor de desenvolvimento

# Build
npm run build       # Gera build de produção
npm run preview     # Preview do build

# Linting
npm run lint        # Executa linting
```

---

## 📋 Status Atual do Debug

### ✅ Funcionando Corretamente
- **Requisições de rede**: Todas as chamadas para Supabase estão funcionando (200 OK)
- **Autenticação**: Sistema de auth ativo
- **Busca de perfis**: `user_profiles` sendo carregados corretamente
- **Votação**: Sistema de votos operacional
- **Design system**: Cores e temas funcionando perfeitamente

### 🔍 Observações do Debug
1. **Sem erros no console**: Nenhum erro JavaScript detectado
2. **Requisições de rede saudáveis**: Todas retornando 200 OK
3. **Dados sendo carregados**: Perfis de usuários visíveis na rede
4. **Autenticação ativa**: Tokens válidos nas requisições

### 🏗️ Em Construção
- **PhenotypeFlowPage**: Página placeholder criada, aguardando implementação

---

## 🔐 Segurança

### RLS (Row Level Security)
- Políticas de segurança implementadas no Supabase
- Controle de acesso baseado em usuário
- Validação de permissões em tempo real

### Autenticação
- Sistema de auth do Supabase
- Tokens JWT seguros
- Sessões gerenciadas automaticamente

---

## 🎯 Próximos Passos Recomendados

1. **Implementar PhenotypeFlowPage**: Completar funcionalidade de fluxo de fenótipos
2. **Otimização de Performance**: Lazy loading, code splitting
3. **Testes**: Implementar testes unitários e de integração
4. **SEO**: Melhorar otimização para motores de busca
5. **Acessibilidade**: Implementar melhorias de A11Y
6. **PWA**: Transformar em Progressive Web App

---

## 📞 Contato e Suporte

Para dúvidas ou suporte técnico, consulte:
- Documentação do código
- Logs do Supabase
- Console do navegador para debug frontend

---

*Documentação gerada em: ${new Date().toLocaleDateString('pt-BR')}*
*Versão do projeto: 1.0.0*