# Estrutura de Blog - FinanPsi

## Visão Geral

Sistema completo de blog implementado para o FinanPsi, incluindo suporte para artigos, vídeos, podcasts e lives. O sistema é totalmente integrado com analytics, SEO otimizado e sistema de comentários com moderação.

## Estrutura Implementada

### 1. Schema Prisma (`prisma/schema.prisma`)

#### Modelos:
- **BlogPost**: Modelo principal que suporta POST, VIDEO, PODCAST e LIVE
- **BlogComment**: Sistema de comentários com threading e moderação
- **BlogEngagement**: Rastreamento de views, likes, shares
- **NewsletterSubscriber**: Gerenciamento de inscrições na newsletter

#### Enums:
- **BlogCategory**: Categorias estratégicas (Finanças Comportamentais, Saúde Emocional & Dinheiro, etc.)
- **BlogStatus**: DRAFT, PUBLISHED, ARCHIVED
- **BlogContentType**: POST, VIDEO, PODCAST, LIVE

### 2. Componentes (`components/blog/`)

- **BlogCard**: Card para exibição de posts na listagem
- **BlogPostContent**: Renderização do conteúdo do post com suporte a vídeo/podcast/live
- **VideoPlayer**: Player de vídeos do YouTube com preview
- **PodcastPlayer**: Player de áudio com transcrição
- **LiveEvent**: Exibição de lives agendadas, ao vivo ou gravadas
- **CommentsSection**: Lista de comentários com threading
- **CommentForm**: Formulário para criar comentários
- **ShareButtons**: Botões de compartilhamento (Facebook, Twitter, LinkedIn, WhatsApp, etc.)
- **RelatedPosts**: Posts relacionados
- **NewsletterCTA**: CTA para inscrição na newsletter

### 3. API Endpoints (`app/api/blog/`)

- **GET/POST `/api/blog/posts`**: Listar e criar posts
- **GET `/api/blog/posts/[slug]`**: Buscar post por slug
- **POST `/api/blog/comments`**: Criar comentário
- **POST `/api/blog/engagement`**: Registrar like/view/share
- **POST/DELETE `/api/blog/newsletter/subscribe`**: Gerenciar inscrições

### 4. Páginas (`app/blog/`)

- **`/blog`**: Página de listagem com filtros (categoria, tipo, tags, busca)
- **`/blog/[slug]`**: Página individual do post com SEO otimizado

### 5. Utilitários (`lib/blog/`)

- **`utils.ts`**: Funções auxiliares (slug, formatação, URLs, etc.)
- **`analytics.ts`**: Eventos de analytics para o blog

### 6. SEO e Sitemap

- **Metadata dinâmica**: Cada post tem meta tags personalizadas
- **Open Graph**: Tags para compartilhamento social
- **Twitter Cards**: Cards otimizados para Twitter
- **Sitemap.xml**: Gerado automaticamente em `/sitemap.ts`

## Funcionalidades

### ✅ Implementado

1. **CRUD de Posts**
   - Criar, ler, atualizar posts
   - Suporte para múltiplos tipos de conteúdo
   - Status de publicação (DRAFT, PUBLISHED, ARCHIVED)

2. **Sistema de Comentários**
   - Threading (respostas a comentários)
   - Moderação manual (isApproved)
   - Detecção de spam (isSpam)

3. **Engajamento**
   - Views (contagem automática)
   - Likes (com rate limiting)
   - Shares (rastreamento)

4. **Busca e Filtros**
   - Busca por texto (título, conteúdo, tags)
   - Filtro por categoria
   - Filtro por tipo de conteúdo
   - Filtro por tags

5. **Newsletter**
   - Inscrição com validação de email
   - Desinscrição por token ou email
   - Preferências de categorias e tags

6. **Analytics**
   - Eventos customizados para todas as ações
   - Integração com GA4 e Plausible
   - Rastreamento de conversões

7. **SEO**
   - Meta tags dinâmicas
   - Open Graph
   - Twitter Cards
   - Sitemap.xml automático
   - URLs amigáveis (slug)

## Próximos Passos Sugeridos

### 1. Migração do Banco de Dados

```bash
cd apps/web
npx prisma migrate dev --name add_blog_models
```

### 2. Configurar Variáveis de Ambiente

Adicionar ao `.env`:
```env
NEXT_PUBLIC_BASE_URL=https://seu-dominio.com.br
```

### 3. Criar Conteúdo Inicial

Você pode criar posts através da API ou diretamente no banco de dados. Exemplo via API:

```bash
curl -X POST http://localhost:3000/api/blog/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meu Primeiro Artigo",
    "content": "<p>Conteúdo do artigo...</p>",
    "category": "FINANCAS_COMPORTAMENTAIS",
    "contentType": "POST",
    "status": "PUBLISHED",
    "tags": ["finanças", "comportamento"]
  }'
```

### 4. Painel Admin (Opcional)

Criar página admin para:
- Gerenciar posts (CRUD)
- Moderar comentários
- Visualizar estatísticas
- Gerenciar newsletter

### 5. Email de Verificação Newsletter

Implementar envio de email de verificação para newsletter usando o sistema de email existente.

### 6. RSS Feed

Criar endpoint `/feed.xml` para RSS feed do blog.

## Estrutura de Arquivos

```
apps/web/
├── app/
│   ├── api/blog/
│   │   ├── posts/
│   │   │   ├── route.ts
│   │   │   └── [slug]/route.ts
│   │   ├── comments/route.ts
│   │   ├── engagement/route.ts
│   │   └── newsletter/subscribe/route.ts
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       ├── actions.ts
│   │       └── CommentFormClient.tsx
│   └── sitemap.ts
├── components/blog/
│   ├── BlogCard.tsx
│   ├── BlogPostContent.tsx
│   ├── VideoPlayer.tsx
│   ├── PodcastPlayer.tsx
│   ├── LiveEvent.tsx
│   ├── Comments.tsx
│   ├── ShareButtons.tsx
│   ├── RelatedPosts.tsx
│   └── NewsletterCTA.tsx
├── lib/blog/
│   ├── utils.ts
│   └── analytics.ts
└── prisma/
    └── schema.prisma
```

## Categorias Estratégicas

As categorias foram definidas com base na pesquisa de público:

1. **FINANCAS_COMPORTAMENTAIS**: Psicologia do dinheiro, hábitos financeiros
2. **SAUDE_EMOCIONAL_DINHEIRO**: Relação entre saúde mental e finanças
3. **PLANEJAMENTO_PRATICO**: Dicas práticas, orçamento, planejamento
4. **TENDENCIAS_MERCADO**: Análises de mercado, tendências
5. **CASOS_SUCESSO**: Histórias de sucesso, depoimentos
6. **GERAL**: Conteúdo geral

## Notas Técnicas

- Todos os componentes são otimizados para SEO
- Sistema de cache implícito através do Prisma
- Rate limiting aplicado em endpoints críticos
- Validação de dados em todos os endpoints
- Tratamento de erros robusto
- TypeScript com tipos completos

## Suporte

Para dúvidas ou problemas, consulte:
- Documentação do Prisma: https://www.prisma.io/docs
- Documentação do Next.js: https://nextjs.org/docs
- Código fonte em `apps/web/`

