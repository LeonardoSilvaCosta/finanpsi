# Referência Rápida de Cores - FinanPsi

## 🎨 Cores Principais

### Verde (Primária)
```tsx
// Background
bg-primary           // #6B995E - Verde médio
bg-primary-dark      // #4F7942 - Verde escuro (logo)
bg-primary-light     // #A8D5BA - Verde claro (botão secundário)

// Texto
text-primary         // Verde médio
text-primary-dark    // Verde escuro
text-primary-light   // Verde claro

// Border
border-primary       // Verde médio
```

### Texto
```tsx
text-finansi-primary    // #333333 - Títulos, textos principais
text-finansi-secondary // #666666 - Descrições
text-finansi-tertiary  // #999999 - Informações secundárias
```

### Background
```tsx
bg-finansi-background  // #FFF8F5 - Background principal
bg-finansi-bg-light   // #FFFFFF - Cards brancos
bg-finansi-bg-dark    // #333333 - Footer
```

### Acentos
```tsx
bg-accent-brown   // #8B4513 - Badge de lançamento
bg-accent-blue    // #4A90E2 - Ícones azuis
bg-accent-pink    // #E91E63 - Ícones rosa
```

## 📝 Tipografia

### Classes de Tamanho
```tsx
text-display     // 60px - Títulos hero muito grandes
text-h1          // 48px - Títulos principais
text-h2          // 36px - Subtítulos de seção
text-h3          // 30px - Títulos de cards
text-h4          // 24px - Subtítulos
text-body-lg     // 18px - Parágrafos grandes
text-body        // 16px - Texto padrão
text-body-sm     // 14px - Textos pequenos
text-caption     // 12px - Legendas
```

### Pesos
```tsx
font-normal    // 400
font-medium    // 500
font-semibold  // 600
font-bold      // 700
```

## 🎯 Componentes Pré-estilizados

```tsx
// Badge de Lançamento
<div className="badge-launch">É um Lançamento Digital</div>

// Botão Primário
<button className="btn-primary">Fazer Diagnóstico Grátis</button>

// Botão Secundário
<button className="btn-secondary">Conhecer Comunidade</button>

// Card de Feature
<div className="card-feature">
  {/* Conteúdo */}
</div>
```

## 📐 Exemplos de Uso

### Hero Section
```tsx
<h1 className="text-h1 font-bold text-finansi-primary">
  Título Principal
</h1>
<p className="text-body-lg text-finansi-secondary">
  Descrição do conteúdo
</p>
```

### Botões
```tsx
<button className="btn-primary">
  Ação Principal
</button>

<button className="btn-secondary">
  Ação Secundária
</button>
```

### Cards
```tsx
<div className="card-feature">
  <h3 className="text-h4 font-semibold text-finansi-primary">
    Título do Card
  </h3>
  <p className="text-body-sm text-finansi-secondary">
    Descrição do card
  </p>
</div>
```

### Badge
```tsx
<div className="badge-launch">
  <Icon />
  Novo Lançamento
</div>
```

## 🔗 Cores Hex Diretas (para casos específicos)

```tsx
// Verde
bg-[#6B995E]    // Verde médio
bg-[#4F7942]    // Verde escuro
bg-[#A8D5BA]   // Verde claro

// Texto
text-[#333333]  // Texto principal
text-[#666666]  // Texto secundário
text-[#999999]  // Texto terciário

// Background
bg-[#FFF8F5]    // Background principal
bg-[#FFFFFF]    // Branco

// Acentos
bg-[#8B4513]    // Marrom
bg-[#4A90E2]    // Azul
bg-[#E91E63]    // Rosa
```

**Nota:** Prefira usar as classes Tailwind customizadas quando possível, pois elas são mais fáceis de manter e consistentes.

