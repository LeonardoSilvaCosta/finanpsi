# Design Tokens - FinanPsi

Este documento descreve a paleta de cores e sistema tipográfico do FinanPsi.

## 🎨 Paleta de Cores

### Cores Primárias - Verde

A cor verde é a identidade principal do FinanPsi, representando saúde, crescimento e bem-estar financeiro.

| Nome | Hex | HSL | Uso |
|------|-----|-----|-----|
| **Primary Dark** | `#4F7942` | `120 35% 38%` | Logo, textos destacados |
| **Primary** | `#6B995E` | `120 25% 45%` | Botões principais, links, CTAs |
| **Primary Light** | `#A8D5BA` | `120 40% 75%` | Botões secundários, backgrounds suaves |
| **Primary Accent** | `#8BC34A` | `120 60% 65%` | Checkmarks, sucesso, destaques |

### Cores de Texto

Hierarquia de cores para textos, garantindo boa legibilidade e contraste.

| Nome | Hex | HSL | Uso |
|------|-----|-----|-----|
| **Text Primary** | `#333333` | `0 0% 20%` | Títulos, textos principais |
| **Text Secondary** | `#666666` | `0 0% 40%` | Descrições, parágrafos |
| **Text Tertiary** | `#999999` | `0 0% 60%` | Informações secundárias, placeholder |

### Cores de Background

| Nome | Hex | HSL | Uso |
|------|-----|-----|-----|
| **Background** | `#FFF8F5` | `25 100% 97%` | Background principal da página |
| **Background Light** | `#FFFFFF` | `0 0% 100%` | Cards, seções brancas |
| **Background Dark** | `#333333` | `0 0% 20%` | Footer, seções escuras |

### Cores de Acento

Cores utilizadas em ícones e elementos decorativos.

| Nome | Hex | HSL | Uso |
|------|-----|-----|-----|
| **Accent Brown** | `#8B4513` | `25 75% 30%` | Badge de lançamento |
| **Accent Blue** | `#4A90E2` | `210 70% 60%` | Ícones de comunidade |
| **Accent Pink** | `#E91E63` | `340 80% 55%` | Ícones de bônus/preço |

### Cores de Estado

| Nome | Hex | HSL | Uso |
|------|-----|-----|-----|
| **Success** | `#8BC34A` | `120 60% 65%` | Mensagens de sucesso, checkmarks |
| **Destructive** | `#CC5252` | `0 50% 60%` | Ações destrutivas, erros |
| **Warning** | - | `45 90% 55%` | Avisos (futuro) |
| **Info** | `#4A90E2` | `210 70% 60%` | Informações (futuro) |

## 📝 Tipografia

### Fonte

**Font Family:** Inter (Google Fonts)

A fonte Inter é uma fonte sans-serif moderna, otimizada para leitura em telas digitais, garantindo excelente legibilidade.

### Escala Tipográfica

| Elemento | Tamanho | Line Height | Font Weight | Uso |
|----------|---------|-------------|-------------|-----|
| **Display** | `3.75rem` (60px) | 1.1 | 700 | Títulos hero muito grandes |
| **H1** | `3rem` (48px) | 1.2 | 700 | Títulos principais |
| **H2** | `2.25rem` (36px) | 1.3 | 700 | Subtítulos de seção |
| **H3** | `1.875rem` (30px) | 1.4 | 600 | Títulos de cards |
| **H4** | `1.5rem` (24px) | 1.5 | 600 | Subtítulos |
| **H5** | `1.25rem` (20px) | 1.5 | 600 | Títulos menores |
| **H6** | `1.125rem` (18px) | 1.5 | 600 | Títulos muito pequenos |
| **Body Large** | `1.125rem` (18px) | 1.75 | 400 | Parágrafos grandes |
| **Body** | `1rem` (16px) | 1.75 | 400 | Texto padrão |
| **Body Small** | `0.875rem` (14px) | 1.5 | 400 | Textos pequenos |
| **Caption** | `0.75rem` (12px) | 1.5 | 400 | Legendas, notas |

### Pesos de Fonte

- **400 (Regular)**: Texto padrão, parágrafos
- **500 (Medium)**: Botões, links importantes
- **600 (Semibold)**: Subtítulos, labels
- **700 (Bold)**: Títulos principais

## 🎯 Uso das Cores no Tailwind

### Classes de Cores Primárias

```tsx
// Background
<div className="bg-primary">...</div>
<div className="bg-primary-dark">...</div>
<div className="bg-primary-light">...</div>

// Texto
<span className="text-primary">...</span>
<span className="text-primary-dark">...</span>

// Border
<div className="border-primary">...</div>
```

### Classes de Texto Customizadas

```tsx
<p className="text-finansi-primary">Texto principal</p>
<p className="text-finansi-secondary">Texto secundário</p>
<p className="text-finansi-tertiary">Texto terciário</p>
```

### Classes de Acento

```tsx
<div className="bg-accent-brown">Badge marrom</div>
<div className="bg-accent-blue">Ícone azul</div>
<div className="bg-accent-pink">Ícone rosa</div>
```

### Classes FinanPsi Customizadas

```tsx
// Backgrounds
<div className="bg-finansi-bg-dark">Footer</div>
<div className="bg-finansi-bg-light">Cards</div>

// Badges
<div className="bg-finansi-badge-launch">Badge de lançamento</div>

// Footer
<div className="bg-finansi-footer-bg">Background do footer</div>
```

## 📐 Espaçamentos

O projeto utiliza a escala padrão do Tailwind (4px = 1rem):

- `0.25rem` (4px) - `space-1`
- `0.5rem` (8px) - `space-2`
- `1rem` (16px) - `space-4`
- `1.5rem` (24px) - `space-6`
- `2rem` (32px) - `space-8`
- `3rem` (48px) - `space-12`
- `4rem` (64px) - `space-16`

## 🎨 Border Radius

- **Padrão**: `0.5rem` (8px) - `rounded-lg`
- **Médio**: `0.375rem` (6px) - `rounded-md`
- **Pequeno**: `0.25rem` (4px) - `rounded-sm`
- **Full**: `9999px` - `rounded-full` (badges, avatares)

## 🔧 Componentes Pré-estilizados

### Badge de Lançamento

```tsx
<div className="badge-launch">
  É um Lançamento Digital
</div>
```

### Botão Primário

```tsx
<button className="btn-primary">
  Fazer Diagnóstico Grátis
</button>
```

### Botão Secundário

```tsx
<button className="btn-secondary">
  Conhecer Comunidade
</button>
```

### Card de Feature

```tsx
<div className="card-feature">
  {/* Conteúdo */}
</div>
```

## 📱 Responsividade

O sistema de design é totalmente responsivo utilizando breakpoints do Tailwind:

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1400px

### Exemplo de Uso Responsivo

```tsx
<h1 className="text-4xl md:text-5xl lg:text-6xl">
  Título Responsivo
</h1>
```

## 🌙 Modo Escuro

O sistema está preparado para modo escuro, mas não está ativamente implementado. As variáveis CSS já estão definidas para futuras implementações.

## 📚 Referências

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Inter Font](https://fonts.google.com/specimen/Inter)
- [HSL Color System](https://en.wikipedia.org/wiki/HSL_and_HSV)

