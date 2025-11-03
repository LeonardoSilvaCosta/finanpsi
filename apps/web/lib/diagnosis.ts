// Tipos para o diagnóstico
export type DiagnosisCategory = 
  | 'dívidas' 
  | 'poupança' 
  | 'planejamento' 
  | 'investimento' 
  | 'ansiedade'
  | 'renda_variável'
  | 'emergência'
  | 'aposentadoria'
  | 'educação_financeira'
  | 'relacionamento_dinheiro'
  | 'geral'

export type LeadData = {
  name: string
  email: string
  profession?: string | null
  challenge?: string | null
  groupAccepted: boolean
}

export type ChallengeAnalysis = {
  keywords: string[]
  category: DiagnosisCategory
  confidence: number
  alternativeCategories: { category: DiagnosisCategory; score: number }[]
}

/**
 * Analisa o desafio financeiro mencionado e identifica padrões com sistema de pontuação
 */
export function analyzeChallenge(challenge: string | null | undefined): ChallengeAnalysis {
  if (!challenge) {
    return { 
      keywords: [], 
      category: 'geral',
      confidence: 0,
      alternativeCategories: []
    }
  }

  const lowerChallenge = challenge.toLowerCase()
  const keywords: string[] = []

  // Categorias expandidas e palavras-chave
  const categories: Record<DiagnosisCategory, string[]> = {
    dívidas: ['dívida', 'divida', 'emprestimo', 'empréstimo', 'cartão', 'cartao', 'juros', 'parcela', 'financiamento', 'devendo', 'debito', 'débito', 'credito', 'crédito'],
    poupança: ['poupar', 'poupança', 'poupanca', 'guardar', 'reserva', 'economia', 'economizar', 'salvar', 'acumular', 'economia'],
    planejamento: ['planejamento', 'organizar', 'organização', 'controle', 'orcamento', 'orçamento', 'gastos', 'receita', 'despesa', 'planejar', 'estratégia', 'estrategia'],
    investimento: ['investir', 'investimento', 'aplicação', 'aplicacao', 'rendimento', 'patrimônio', 'patrimonio', 'rentabilidade', 'aplicar', 'portfolio', 'portfólio'],
    ansiedade: ['ansiedade', 'ansioso', 'ansiosa', 'stress', 'estresse', 'preocupação', 'preocupacao', 'medo', 'tensão', 'tensao', 'nervoso', 'angustia', 'angústia', 'tenso'],
    renda_variável: ['renda variável', 'renda variavel', 'renda instável', 'instabilidade', 'receita irregular', 'fluxo de caixa', 'fluxo irregular', 'mês bom mês ruim', 'mes bom mes ruim', 'cliente paga', 'atraso', 'inconsistente'],
    emergência: ['emergência', 'emergencia', 'imprevisto', 'inesperado', 'reserva de emergência', 'contingência', 'contingencia', 'segurança financeira', 'desemprego', 'doença', 'doenca', 'acidente', 'crise', 'imprevistos'],
    aposentadoria: ['aposentadoria', 'aposentar', 'futuro financeiro', 'longo prazo', 'aposentado', 'previdência', 'previdencia', 'terceira idade', 'idoso', 'idosos', 'aposentada', 'aposentados'],
    educação_financeira: ['educação financeira', 'educacao financeira', 'conhecimento financeiro', 'aprender sobre dinheiro', 'entender finanças', 'compreender', 'não sei', 'nao sei', 'confuso', 'complexo', 'difícil', 'dificil', 'ignorância', 'ignorancia'],
    relacionamento_dinheiro: ['relação com dinheiro', 'relacao com dinheiro', 'sentimento sobre dinheiro', 'emoção', 'emocao', 'culpa', 'vergonha', 'poder', 'controle', 'liberdade', 'trabalho', 'esforço', 'esforco', 'valor'],
    geral: []
  }

  // Sistema de pontuação
  const scores: Record<DiagnosisCategory, number> = {
    dívidas: 0,
    poupança: 0,
    planejamento: 0,
    investimento: 0,
    ansiedade: 0,
    renda_variável: 0,
    emergência: 0,
    aposentadoria: 0,
    educação_financeira: 0,
    relacionamento_dinheiro: 0,
    geral: 0,
  }

  // Contar matches por categoria
  for (const [category, words] of Object.entries(categories)) {
    if (category === 'geral') continue
    
    for (const word of words) {
      if (lowerChallenge.includes(word)) {
        keywords.push(word)
        scores[category as DiagnosisCategory]++
      }
    }
  }

  // Encontrar categoria principal (maior pontuação)
  const entries = Object.entries(scores).filter(([cat]) => cat !== 'geral') as [DiagnosisCategory, number][]
  entries.sort((a, b) => b[1] - a[1])
  
  const mainCategory = entries[0][1] > 0 ? entries[0][0] : 'geral'
  const mainScore = scores[mainCategory]
  
  // Calcular confiança (0-1)
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)
  const confidence = totalScore > 0 ? Math.min(mainScore / totalScore, 1) : 0

  // Categorias alternativas (>= 50% da pontuação principal)
  const alternativeCategories = entries
    .filter(([cat, score]) => cat !== mainCategory && score > 0 && score >= mainScore * 0.5)
    .slice(0, 3)
    .map(([category, score]) => ({ category, score }))

  return {
    keywords,
    category: mainCategory,
    confidence,
    alternativeCategories,
  }
}

/**
 * Gera diagnóstico financeiro baseado nas respostas do lead (versão baseada em regras)
 */
export function generateDiagnosis(lead: LeadData): string {
  const challengeAnalysis = analyzeChallenge(lead.challenge)
  const profession = lead.profession?.toLowerCase() || ''
  const isHealthProfessional = profession.includes('psicólogo') || 
                               profession.includes('psicologa') || 
                               profession.includes('psicologia') ||
                               profession.includes('terapeuta') ||
                               profession.includes('saúde') ||
                               profession.includes('saude') ||
                               profession.includes('nutricionista') ||
                               profession.includes('nutricionista') ||
                               profession.includes('fisioterapeuta') ||
                               profession.includes('fonoaudiólogo') ||
                               profession.includes('fonoaudiologo')

  let diagnosis = `Olá, ${lead.name}!\n\n`
  diagnosis += `Com base nas informações que você compartilhou, preparamos um diagnóstico inicial para sua situação financeira:\n\n`

  // Diagnóstico por categoria de desafio
  switch (challengeAnalysis.category) {
    case 'dívidas':
      diagnosis += `🔴 **SITUAÇÃO IDENTIFICADA: Gerenciamento de Dívidas**\n\n`
      diagnosis += `Identificamos que você está lidando com desafios relacionados a dívidas e compromissos financeiros. `
      diagnosis += `Esta é uma situação comum entre profissionais autônomos que enfrentam fluxo de caixa irregular.\n\n`
      diagnosis += `**Ações Recomendadas:**\n`
      diagnosis += `• Faça um levantamento completo de todas as dívidas (valores, taxas de juros, prazos)\n`
      diagnosis += `• Priorize o pagamento das dívidas com maiores taxas de juros (método avalanche)\n`
      diagnosis += `• Negocie renegociações ou consolidações quando possível\n`
      diagnosis += `• Crie uma reserva de emergência paralela, mesmo que pequena inicialmente\n`
      diagnosis += `• Estabeleça um cronograma realista de pagamento\n`
      diagnosis += `• Considere buscar ajuda profissional para negociações complexas\n\n`
      break

    case 'poupança':
      diagnosis += `🟡 **SITUAÇÃO IDENTIFICADA: Dificuldade em Poupar**\n\n`
      diagnosis += `Você mencionou dificuldades para poupar ou criar uma reserva financeira. `
      diagnosis += `Isso é especialmente desafiador quando a renda é variável.\n\n`
      diagnosis += `**Ações Recomendadas:**\n`
      diagnosis += `• Aplique o princípio "pagamento a si mesmo primeiro" - reserve antes de gastar\n`
      diagnosis += `• Comece com valores pequenos e consistentes (ex: 5-10% da renda)\n`
      diagnosis += `• Automatize transferências para uma conta separada no dia do recebimento\n`
      diagnosis += `• Defina objetivos claros para sua poupança (emergência, investimentos, projetos)\n`
      diagnosis += `• Acompanhe seus gastos para identificar oportunidades de economia\n`
      diagnosis += `• Celebre pequenas conquistas para manter a motivação\n\n`
      break

    case 'planejamento':
      diagnosis += `🟢 **SITUAÇÃO IDENTIFICADA: Necessidade de Planejamento Financeiro**\n\n`
      diagnosis += `Você reconhece a importância do planejamento financeiro, o que já é um excelente primeiro passo! `
      diagnosis += `Profissionais da saúde precisam de estratégias específicas para gerenciar renda variável.\n\n`
      diagnosis += `**Ações Recomendadas:**\n`
      diagnosis += `• Crie um orçamento mensal baseado em sua renda média dos últimos 6-12 meses\n`
      diagnosis += `• Separe receitas por categorias (fixa, variável, extras)\n`
      diagnosis += `• Estabeleça metas financeiras de curto, médio e longo prazo\n`
      diagnosis += `• Revise e ajuste seu planejamento mensalmente\n`
      diagnosis += `• Use ferramentas simples (planilhas ou apps) para acompanhamento\n`
      diagnosis += `• Considere criar um fundo para meses de menor receita\n\n`
      break

    case 'investimento':
      diagnosis += `🟢 **SITUAÇÃO IDENTIFICADA: Interesse em Investir**\n\n`
      diagnosis += `Ótimo! Você demonstra interesse em investir no seu futuro financeiro. `
      diagnosis += `Antes de investir, é fundamental ter uma base sólida.\n\n`
      diagnosis += `**Ações Recomendadas:**\n`
      diagnosis += `• Priorize criar uma reserva de emergência (3-6 meses de gastos)\n`
      diagnosis += `• Quita dívidas de alto custo antes de investir\n`
      diagnosis += `• Eduque-se sobre diferentes tipos de investimento\n`
      diagnosis += `• Comece com investimentos de baixo risco e alta liquidez\n`
      diagnosis += `• Considere investimentos adequados para profissionais autônomos (Previdência Privada, Tesouro Direto)\n`
      diagnosis += `• Diversifique seus investimentos gradualmente\n`
      diagnosis += `• Invista em educação contínua sobre o assunto\n\n`
      break

    case 'ansiedade':
      diagnosis += `🔴 **SITUAÇÃO IDENTIFICADA: Ansiedade Financeira**\n\n`
      diagnosis += `Você mencionou sentimentos de ansiedade ou estresse relacionados às finanças. `
      diagnosis += `Esta é uma área que requer atenção tanto financeira quanto emocional.\n\n`
      diagnosis += `**Ações Recomendadas:**\n`
      diagnosis += `• Reconheça e valide seus sentimentos - ansiedade financeira é comum e tratável\n`
      diagnosis += `• Crie um plano de ação concreto para reduzir a incerteza\n`
      diagnosis += `• Pratique técnicas de mindfulness e respiração quando sentir ansiedade\n`
      diagnosis += `• Converse com outros profissionais sobre desafios financeiros (${lead.groupAccepted ? 'você já demonstrou interesse em grupo!' : 'considere participar de grupos de apoio'})\n`
      diagnosis += `• Estabeleça pequenas metas alcançáveis para criar senso de controle\n`
      diagnosis += `• Procure apoio profissional se a ansiedade estiver impactando seu bem-estar\n`
      diagnosis += `• Informe-se sobre finanças para reduzir o medo do desconhecido\n\n`
      break

    case 'renda_variável':
      diagnosis += `🟡 **SITUAÇÃO IDENTIFICADA: Gerenciamento de Renda Variável**\n\n`
      diagnosis += `Como profissional autônomo, você enfrenta o desafio de gerenciar uma renda que varia mês a mês. `
      diagnosis += `Este é um dos maiores desafios para profissionais da saúde.\n\n`
      diagnosis += `**Ações Recomendadas:**\n`
      diagnosis += `• Calcule sua renda média dos últimos 6-12 meses como base de planejamento\n`
      diagnosis += `• Crie um "fundinho" de meses gordos para cobrir meses magros\n`
      diagnosis += `• Separe receitas em três categorias: essencial, crescimento e reserva\n`
      diagnosis += `• Automatize transferências para reserva assim que receber\n`
      diagnosis += `• Desenvolva múltiplas fontes de renda quando possível\n`
      diagnosis += `• Mantenha uma reserva maior que profissionais com renda fixa (6-9 meses ideal)\n`
      diagnosis += `• Use a variabilidade a seu favor: meses bons = mais reserva, meses ruins = disciplina\n\n`
      break

    case 'emergência':
      diagnosis += `🔴 **SITUAÇÃO IDENTIFICADA: Necessidade de Reserva de Emergência**\n\n`
      diagnosis += `Você demonstrou preocupação com imprevistos e situações de emergência. `
      diagnosis += `Ter uma reserva de emergência é fundamental, especialmente para profissionais autônomos.\n\n`
      diagnosis += `**Ações Recomendadas:**\n`
      diagnosis += `• Estabeleça uma meta inicial de 3 meses de gastos essenciais\n`
      diagnosis += `• Para profissionais autônomos, ideal é 6-9 meses de reserva\n`
      diagnosis += `• Mantenha a reserva em investimento de alta liquidez (ex: Tesouro Selic, CDB com liquidez)\n`
      diagnosis += `• Separe mentalmente: reserva de emergência ≠ dinheiro para investir\n`
      diagnosis += `• Revise e ajuste sua reserva conforme sua situação muda\n`
      diagnosis += `• Use apenas em emergências reais (não para vontades)\n`
      diagnosis += `• Recupere a reserva imediatamente após usar\n\n`
      break

    case 'aposentadoria':
      diagnosis += `🟢 **SITUAÇÃO IDENTIFICADA: Planejamento para Aposentadoria**\n\n`
      diagnosis += `Você está pensando no longo prazo e no seu futuro financeiro. `
      diagnosis += `Para profissionais autônomos, a aposentadoria requer planejamento proativo.\n\n`
      diagnosis += `**Ações Recomendadas:**\n`
      diagnosis += `• Comece o quanto antes - tempo é seu maior aliado\n`
      diagnosis += `• Considere Previdência Privada (PGBL/VGBL) com dedução no Imposto de Renda\n`
      diagnosis += `• Invista também fora da previdência: Tesouro IPCA+, ações, fundos imobiliários\n`
      diagnosis += `• Calcule quanto você precisa para manter seu padrão de vida\n`
      diagnosis += `• Revise seu plano anualmente e ajuste conforme necessário\n`
      diagnosis += `• Considere diversificar entre previdência pública e privada\n`
      diagnosis += `• Não deixe tudo para o último momento\n\n`
      break

    case 'educação_financeira':
      diagnosis += `🟡 **SITUAÇÃO IDENTIFICADA: Necessidade de Educação Financeira**\n\n`
      diagnosis += `Você reconhece que precisa aprender mais sobre finanças pessoais. `
      diagnosis += `Esse é um excelente primeiro passo para transformação financeira!\n\n`
      diagnosis += `**Ações Recomendadas:**\n`
      diagnosis += `• Dedique tempo regular para estudar finanças pessoais (mesmo que pouco)\n`
      diagnosis += `• Comece pelo básico: orçamento, reserva de emergência, dívidas\n`
      diagnosis += `• Use recursos gratuitos: blogs, podcasts, cursos online\n`
      diagnosis += `• Pratique o que aprende imediatamente (não espere "saber tudo")\n`
      diagnosis += `• Participe de comunidades e grupos de apoio\n`
      diagnosis += `• Faça perguntas - não existe pergunta "boba" sobre dinheiro\n`
      diagnosis += `• Aplique o conhecimento gradualmente, sem pressão\n\n`
      break

    case 'relacionamento_dinheiro':
      diagnosis += `🟡 **SITUAÇÃO IDENTIFICADA: Relacionamento Emocional com Dinheiro**\n\n`
      diagnosis += `Você demonstrou que sua relação com o dinheiro tem aspectos emocionais importantes. `
      diagnosis += `Como profissional da área de saúde, você entende a importância do equilíbrio emocional.\n\n`
      diagnosis += `**Ações Recomendadas:**\n`
      diagnosis += `• Reconheça e valide seus sentimentos sobre dinheiro\n`
      diagnosis += `• Identifique crenças limitantes herdadas da família\n`
      diagnosis += `• Trabalhe tanto a parte técnica quanto emocional das finanças\n`
      diagnosis += `• Pratique autocuidado financeiro (não apenas profissional)\n`
      diagnosis += `• Considere terapia financeira se necessário\n`
      diagnosis += `• Celebre conquistas financeiras, mesmo pequenas\n`
      diagnosis += `• Lembre-se: dinheiro é ferramenta, não define seu valor\n`
      diagnosis += `• Busque equilíbrio entre economia e qualidade de vida\n\n`
      break

    default:
      diagnosis += `📋 **DIAGNÓSTICO FINANCEIRO INICIAL**\n\n`
      diagnosis += `Cada jornada financeira é única. Vamos trabalhar juntos para criar uma estratégia personalizada para sua situação.\n\n`
      diagnosis += `**Próximos Passos Recomendados:**\n`
      diagnosis += `• Organize sua situação financeira atual (receitas, despesas, patrimônio)\n`
      diagnosis += `• Identifique seus maiores desafios e objetivos financeiros\n`
      diagnosis += `• Crie um plano de ação com metas realistas e prazos definidos\n`
      diagnosis += `• Busque conhecimento e ferramentas para gerenciamento financeiro\n`
      diagnosis += `• Considere apoio profissional ou de grupo para manter a motivação\n\n`
  }

  // Adicionar menção a categorias alternativas se existirem
  if (challengeAnalysis.alternativeCategories.length > 0) {
    diagnosis += `\n💡 **NOTA:** Você também pode se beneficiar de apoio nas áreas: `
    diagnosis += challengeAnalysis.alternativeCategories.map(c => c.category.replace('_', ' ')).join(', ')
    diagnosis += `\n\n`
  }

  // Adicionar insights específicos para profissionais da saúde
  if (isHealthProfessional) {
    diagnosis += `\n💼 **INSIGHTS PARA PROFISSIONAIS DA SAÚDE:**\n\n`
    diagnosis += `Como profissional da área de saúde, você enfrenta desafios únicos:\n`
    diagnosis += `• Renda variável requer planejamento diferenciado\n`
    diagnosis += `• Necessidade de manter reserva maior devido à natureza autônoma do trabalho\n`
    diagnosis += `• Investir em educação contínua é essencial, mas precisa estar no planejamento\n`
    diagnosis += `• Saúde financeira impacta diretamente sua capacidade de cuidar dos outros\n`
    diagnosis += `• Equilíbrio entre investir no negócio e na segurança pessoal\n\n`
  }

  // Mensagem sobre grupo de apoio
  if (lead.groupAccepted) {
    diagnosis += `\n👥 **COMUNIDADE DE APOIO:**\n\n`
    diagnosis += `Ficamos felizes que você tenha interesse em participar de nossa comunidade! `
    diagnosis += `Logo você receberá informações sobre como acessar o grupo exclusivo de profissionais da saúde. `
    diagnosis += `Lá você poderá compartilhar experiências, tirar dúvidas e receber suporte em sua jornada financeira.\n\n`
  }

  diagnosis += `\n---\n\n`
  diagnosis += `Este é um diagnóstico inicial. No nosso curso completo, você terá acesso a:\n`
  diagnosis += `• Ferramentas práticas de planejamento financeiro\n`
  diagnosis += `• Estratégias específicas para profissionais autônomos\n`
  diagnosis += `• Suporte contínuo e comunidade ativa\n`
  diagnosis += `• Conteúdo atualizado sobre investimentos e gestão financeira\n\n`
  diagnosis += `Estamos aqui para apoiar sua transformação financeira! 💪\n\n`
  diagnosis += `Equipe FinanPsi`

  return diagnosis
}

/**
 * Gera diagnóstico resumido (para uso em emails)
 */
export function generateDiagnosisSummary(lead: LeadData): string {
  const challengeAnalysis = analyzeChallenge(lead.challenge)
  
  const summaries: Record<DiagnosisCategory, string> = {
    dívidas: 'Priorize o gerenciamento de dívidas com estratégias de renegociação e pagamento inteligente.',
    poupança: 'Desenvolva hábitos de poupança consistentes, começando com valores pequenos e automatizados.',
    planejamento: 'Crie um sistema de planejamento financeiro adaptado para sua renda variável.',
    investimento: 'Prepare-se para investir com segurança, começando por uma base sólida de reservas.',
    ansiedade: 'Trabalhe tanto a parte técnica quanto emocional da sua relação com o dinheiro.',
    renda_variável: 'Desenvolva estratégias específicas para gerenciar a variabilidade da sua renda.',
    emergência: 'Estabeleça uma reserva de emergência robusta para imprevistos e segurança financeira.',
    aposentadoria: 'Planeje sua aposentadoria com antecedência, aproveitando o poder do tempo.',
    educação_financeira: 'Invista em seu conhecimento financeiro para tomar decisões mais informadas.',
    relacionamento_dinheiro: 'Trabalhe o aspecto emocional da sua relação com o dinheiro.',
    geral: 'Desenvolva uma estratégia financeira personalizada para sua situação específica.'
  }

  return summaries[challengeAnalysis.category] || summaries.geral
}

/**
 * Resultado do diagnóstico gerado
 */
export interface DiagnosisResult {
  diagnosis: string
  method: 'flowise' | 'rules' | 'hybrid' | 'cache'
  responseTime: number
  cached?: boolean
  flowiseAttempted?: boolean
  flowiseSuccess?: boolean
}

/**
 * Gera diagnóstico usando sistema híbrido (IA com fallback para regras)
 * Esta é a função principal recomendada para uso em produção
 */
export async function generateDiagnosisAdvanced(
  lead: LeadData,
  options: {
    useCache?: boolean
    preferFlowise?: boolean
    fallbackToRules?: boolean
  } = {}
): Promise<DiagnosisResult> {
  const startTime = Date.now()
  const {
    useCache = process.env.DIAGNOSIS_USE_CACHE !== 'false',
    preferFlowise = process.env.DIAGNOSIS_PREFER_FLOWISE === 'true',
    fallbackToRules = true,
  } = options

  // 1. Verificar cache
  if (useCache) {
    try {
      const diagnosisCache = (await import('./diagnosis-cache')).default
      const cached = diagnosisCache.get(lead)
      
      if (cached) {
        return {
          diagnosis: cached.diagnosis,
          method: 'cache',
          responseTime: Date.now() - startTime,
          cached: true,
        }
      }
    } catch (error) {
      console.warn('[Diagnóstico] Erro ao acessar cache:', error)
    }
  }

  // 2. Tentar Flowise se preferido ou configurado
  if (preferFlowise) {
    try {
      const { generateDiagnosisWithFlowise } = await import('./flowise')
      const flowiseResult = await generateDiagnosisWithFlowise(lead)

      if (flowiseResult.success && flowiseResult.diagnosis) {
        const diagnosis = flowiseResult.diagnosis

        // Armazenar no cache se disponível
        if (useCache) {
          try {
            const diagnosisCache = (await import('./diagnosis-cache')).default
            diagnosisCache.set(lead, diagnosis, 'flowise')
          } catch (error) {
            console.warn('[Diagnóstico] Erro ao armazenar no cache:', error)
          }
        }

        console.log(`[Diagnóstico] Gerado via Flowise em ${flowiseResult.responseTime}ms`)

        return {
          diagnosis,
          method: 'flowise',
          responseTime: flowiseResult.responseTime || Date.now() - startTime,
          flowiseAttempted: true,
          flowiseSuccess: true,
        }
      } else {
        console.warn(`[Diagnóstico] Flowise falhou: ${flowiseResult.error}`)
        
        // Se Flowise falhou mas temos fallback, continuar para regras
        if (!fallbackToRules) {
          throw new Error(`Flowise falhou e fallback desabilitado: ${flowiseResult.error}`)
        }
      }
    } catch (error: any) {
      console.error('[Diagnóstico] Erro ao usar Flowise:', error.message || error)
      
      if (!fallbackToRules) {
        throw error
      }
    }
  }

  // 3. Fallback para regras (sempre disponível)
  const rulesDiagnosis = generateDiagnosis(lead)
  const responseTime = Date.now() - startTime

  // Armazenar no cache
  if (useCache) {
    try {
      const diagnosisCache = (await import('./diagnosis-cache')).default
      diagnosisCache.set(lead, rulesDiagnosis, preferFlowise ? 'hybrid' : 'rules')
    } catch (error) {
      console.warn('[Diagnóstico] Erro ao armazenar no cache:', error)
    }
  }

  console.log(`[Diagnóstico] Gerado via regras em ${responseTime}ms`)

  return {
    diagnosis: rulesDiagnosis,
    method: preferFlowise ? 'hybrid' : 'rules',
    responseTime,
    flowiseAttempted: preferFlowise,
    flowiseSuccess: false,
  }
}
