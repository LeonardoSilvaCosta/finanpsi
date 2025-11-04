exports.id=781,exports.ids=[781],exports.modules={5303:()=>{},7888:(e,a,o)=>{"use strict";function i(e){if(!e)return{keywords:[],category:"geral",confidence:0,alternativeCategories:[]};let a=e.toLowerCase(),o=[],i={dívidas:0,poupança:0,planejamento:0,investimento:0,ansiedade:0,renda_variável:0,emergência:0,aposentadoria:0,educação_financeira:0,relacionamento_dinheiro:0,geral:0};for(let[e,s]of Object.entries({dívidas:["d\xedvida","divida","emprestimo","empr\xe9stimo","cart\xe3o","cartao","juros","parcela","financiamento","devendo","debito","d\xe9bito","credito","cr\xe9dito"],poupança:["poupar","poupan\xe7a","poupanca","guardar","reserva","economia","economizar","salvar","acumular","economia"],planejamento:["planejamento","organizar","organiza\xe7\xe3o","controle","orcamento","or\xe7amento","gastos","receita","despesa","planejar","estrat\xe9gia","estrategia"],investimento:["investir","investimento","aplica\xe7\xe3o","aplicacao","rendimento","patrim\xf4nio","patrimonio","rentabilidade","aplicar","portfolio","portf\xf3lio"],ansiedade:["ansiedade","ansioso","ansiosa","stress","estresse","preocupa\xe7\xe3o","preocupacao","medo","tens\xe3o","tensao","nervoso","angustia","ang\xfastia","tenso"],renda_variável:["renda vari\xe1vel","renda variavel","renda inst\xe1vel","instabilidade","receita irregular","fluxo de caixa","fluxo irregular","m\xeas bom m\xeas ruim","mes bom mes ruim","cliente paga","atraso","inconsistente"],emergência:["emerg\xeancia","emergencia","imprevisto","inesperado","reserva de emerg\xeancia","conting\xeancia","contingencia","seguran\xe7a financeira","desemprego","doen\xe7a","doenca","acidente","crise","imprevistos"],aposentadoria:["aposentadoria","aposentar","futuro financeiro","longo prazo","aposentado","previd\xeancia","previdencia","terceira idade","idoso","idosos","aposentada","aposentados"],educação_financeira:["educa\xe7\xe3o financeira","educacao financeira","conhecimento financeiro","aprender sobre dinheiro","entender finan\xe7as","compreender","n\xe3o sei","nao sei","confuso","complexo","dif\xedcil","dificil","ignor\xe2ncia","ignorancia"],relacionamento_dinheiro:["rela\xe7\xe3o com dinheiro","relacao com dinheiro","sentimento sobre dinheiro","emo\xe7\xe3o","emocao","culpa","vergonha","poder","controle","liberdade","trabalho","esfor\xe7o","esforco","valor"],geral:[]}))if("geral"!==e)for(let r of s)a.includes(r)&&(o.push(r),i[e]++);let s=Object.entries(i).filter(([e])=>"geral"!==e);s.sort((e,a)=>a[1]-e[1]);let r=s[0][1]>0?s[0][0]:"geral",n=i[r],t=Object.values(i).reduce((e,a)=>e+a,0),d=t>0?Math.min(n/t,1):0,c=s.filter(([e,a])=>e!==r&&a>0&&a>=.5*n).slice(0,3).map(([e,a])=>({category:e,score:a}));return{keywords:o,category:r,confidence:d,alternativeCategories:c}}function s(e){let a=i(e.challenge),o=e.profession?.toLowerCase()||"",s=o.includes("psic\xf3logo")||o.includes("psicologa")||o.includes("psicologia")||o.includes("terapeuta")||o.includes("sa\xfade")||o.includes("saude")||o.includes("nutricionista")||o.includes("nutricionista")||o.includes("fisioterapeuta")||o.includes("fonoaudi\xf3logo")||o.includes("fonoaudiologo"),r=`Ol\xe1, ${e.name}!

`;switch(r+=`Com base nas informa\xe7\xf5es que voc\xea compartilhou, preparamos um diagn\xf3stico inicial para sua situa\xe7\xe3o financeira:

`,a.category){case"d\xedvidas":r+=`🔴 **SITUA\xc7\xc3O IDENTIFICADA: Gerenciamento de D\xedvidas**

Identificamos que voc\xea est\xe1 lidando com desafios relacionados a d\xedvidas e compromissos financeiros. Esta \xe9 uma situa\xe7\xe3o comum entre profissionais aut\xf4nomos que enfrentam fluxo de caixa irregular.

**A\xe7\xf5es Recomendadas:**
• Fa\xe7a um levantamento completo de todas as d\xedvidas (valores, taxas de juros, prazos)
• Priorize o pagamento das d\xedvidas com maiores taxas de juros (m\xe9todo avalanche)
• Negocie renegocia\xe7\xf5es ou consolida\xe7\xf5es quando poss\xedvel
• Crie uma reserva de emerg\xeancia paralela, mesmo que pequena inicialmente
• Estabele\xe7a um cronograma realista de pagamento
• Considere buscar ajuda profissional para negocia\xe7\xf5es complexas

`;break;case"poupan\xe7a":r+=`🟡 **SITUA\xc7\xc3O IDENTIFICADA: Dificuldade em Poupar**

Voc\xea mencionou dificuldades para poupar ou criar uma reserva financeira. Isso \xe9 especialmente desafiador quando a renda \xe9 vari\xe1vel.

**A\xe7\xf5es Recomendadas:**
• Aplique o princ\xedpio "pagamento a si mesmo primeiro" - reserve antes de gastar
• Comece com valores pequenos e consistentes (ex: 5-10% da renda)
• Automatize transfer\xeancias para uma conta separada no dia do recebimento
• Defina objetivos claros para sua poupan\xe7a (emerg\xeancia, investimentos, projetos)
• Acompanhe seus gastos para identificar oportunidades de economia
• Celebre pequenas conquistas para manter a motiva\xe7\xe3o

`;break;case"planejamento":r+=`🟢 **SITUA\xc7\xc3O IDENTIFICADA: Necessidade de Planejamento Financeiro**

Voc\xea reconhece a import\xe2ncia do planejamento financeiro, o que j\xe1 \xe9 um excelente primeiro passo! Profissionais da sa\xfade precisam de estrat\xe9gias espec\xedficas para gerenciar renda vari\xe1vel.

**A\xe7\xf5es Recomendadas:**
• Crie um or\xe7amento mensal baseado em sua renda m\xe9dia dos \xfaltimos 6-12 meses
• Separe receitas por categorias (fixa, vari\xe1vel, extras)
• Estabele\xe7a metas financeiras de curto, m\xe9dio e longo prazo
• Revise e ajuste seu planejamento mensalmente
• Use ferramentas simples (planilhas ou apps) para acompanhamento
• Considere criar um fundo para meses de menor receita

`;break;case"investimento":r+=`🟢 **SITUA\xc7\xc3O IDENTIFICADA: Interesse em Investir**

\xd3timo! Voc\xea demonstra interesse em investir no seu futuro financeiro. Antes de investir, \xe9 fundamental ter uma base s\xf3lida.

**A\xe7\xf5es Recomendadas:**
• Priorize criar uma reserva de emerg\xeancia (3-6 meses de gastos)
• Quita d\xedvidas de alto custo antes de investir
• Eduque-se sobre diferentes tipos de investimento
• Comece com investimentos de baixo risco e alta liquidez
• Considere investimentos adequados para profissionais aut\xf4nomos (Previd\xeancia Privada, Tesouro Direto)
• Diversifique seus investimentos gradualmente
• Invista em educa\xe7\xe3o cont\xednua sobre o assunto

`;break;case"ansiedade":r+=`🔴 **SITUA\xc7\xc3O IDENTIFICADA: Ansiedade Financeira**

Voc\xea mencionou sentimentos de ansiedade ou estresse relacionados \xe0s finan\xe7as. Esta \xe9 uma \xe1rea que requer aten\xe7\xe3o tanto financeira quanto emocional.

**A\xe7\xf5es Recomendadas:**
• Reconhe\xe7a e valide seus sentimentos - ansiedade financeira \xe9 comum e trat\xe1vel
• Crie um plano de a\xe7\xe3o concreto para reduzir a incerteza
• Pratique t\xe9cnicas de mindfulness e respira\xe7\xe3o quando sentir ansiedade
• Converse com outros profissionais sobre desafios financeiros (${e.groupAccepted?"voc\xea j\xe1 demonstrou interesse em grupo!":"considere participar de grupos de apoio"})
• Estabele\xe7a pequenas metas alcan\xe7\xe1veis para criar senso de controle
• Procure apoio profissional se a ansiedade estiver impactando seu bem-estar
• Informe-se sobre finan\xe7as para reduzir o medo do desconhecido

`;break;case"renda_vari\xe1vel":r+=`🟡 **SITUA\xc7\xc3O IDENTIFICADA: Gerenciamento de Renda Vari\xe1vel**

Como profissional aut\xf4nomo, voc\xea enfrenta o desafio de gerenciar uma renda que varia m\xeas a m\xeas. Este \xe9 um dos maiores desafios para profissionais da sa\xfade.

**A\xe7\xf5es Recomendadas:**
• Calcule sua renda m\xe9dia dos \xfaltimos 6-12 meses como base de planejamento
• Crie um "fundinho" de meses gordos para cobrir meses magros
• Separe receitas em tr\xeas categorias: essencial, crescimento e reserva
• Automatize transfer\xeancias para reserva assim que receber
• Desenvolva m\xfaltiplas fontes de renda quando poss\xedvel
• Mantenha uma reserva maior que profissionais com renda fixa (6-9 meses ideal)
• Use a variabilidade a seu favor: meses bons = mais reserva, meses ruins = disciplina

`;break;case"emerg\xeancia":r+=`🔴 **SITUA\xc7\xc3O IDENTIFICADA: Necessidade de Reserva de Emerg\xeancia**

Voc\xea demonstrou preocupa\xe7\xe3o com imprevistos e situa\xe7\xf5es de emerg\xeancia. Ter uma reserva de emerg\xeancia \xe9 fundamental, especialmente para profissionais aut\xf4nomos.

**A\xe7\xf5es Recomendadas:**
• Estabele\xe7a uma meta inicial de 3 meses de gastos essenciais
• Para profissionais aut\xf4nomos, ideal \xe9 6-9 meses de reserva
• Mantenha a reserva em investimento de alta liquidez (ex: Tesouro Selic, CDB com liquidez)
• Separe mentalmente: reserva de emerg\xeancia ≠ dinheiro para investir
• Revise e ajuste sua reserva conforme sua situa\xe7\xe3o muda
• Use apenas em emerg\xeancias reais (n\xe3o para vontades)
• Recupere a reserva imediatamente ap\xf3s usar

`;break;case"aposentadoria":r+=`🟢 **SITUA\xc7\xc3O IDENTIFICADA: Planejamento para Aposentadoria**

Voc\xea est\xe1 pensando no longo prazo e no seu futuro financeiro. Para profissionais aut\xf4nomos, a aposentadoria requer planejamento proativo.

**A\xe7\xf5es Recomendadas:**
• Comece o quanto antes - tempo \xe9 seu maior aliado
• Considere Previd\xeancia Privada (PGBL/VGBL) com dedu\xe7\xe3o no Imposto de Renda
• Invista tamb\xe9m fora da previd\xeancia: Tesouro IPCA+, a\xe7\xf5es, fundos imobili\xe1rios
• Calcule quanto voc\xea precisa para manter seu padr\xe3o de vida
• Revise seu plano anualmente e ajuste conforme necess\xe1rio
• Considere diversificar entre previd\xeancia p\xfablica e privada
• N\xe3o deixe tudo para o \xfaltimo momento

`;break;case"educa\xe7\xe3o_financeira":r+=`🟡 **SITUA\xc7\xc3O IDENTIFICADA: Necessidade de Educa\xe7\xe3o Financeira**

Voc\xea reconhece que precisa aprender mais sobre finan\xe7as pessoais. Esse \xe9 um excelente primeiro passo para transforma\xe7\xe3o financeira!

**A\xe7\xf5es Recomendadas:**
• Dedique tempo regular para estudar finan\xe7as pessoais (mesmo que pouco)
• Comece pelo b\xe1sico: or\xe7amento, reserva de emerg\xeancia, d\xedvidas
• Use recursos gratuitos: blogs, podcasts, cursos online
• Pratique o que aprende imediatamente (n\xe3o espere "saber tudo")
• Participe de comunidades e grupos de apoio
• Fa\xe7a perguntas - n\xe3o existe pergunta "boba" sobre dinheiro
• Aplique o conhecimento gradualmente, sem press\xe3o

`;break;case"relacionamento_dinheiro":r+=`🟡 **SITUA\xc7\xc3O IDENTIFICADA: Relacionamento Emocional com Dinheiro**

Voc\xea demonstrou que sua rela\xe7\xe3o com o dinheiro tem aspectos emocionais importantes. Como profissional da \xe1rea de sa\xfade, voc\xea entende a import\xe2ncia do equil\xedbrio emocional.

**A\xe7\xf5es Recomendadas:**
• Reconhe\xe7a e valide seus sentimentos sobre dinheiro
• Identifique cren\xe7as limitantes herdadas da fam\xedlia
• Trabalhe tanto a parte t\xe9cnica quanto emocional das finan\xe7as
• Pratique autocuidado financeiro (n\xe3o apenas profissional)
• Considere terapia financeira se necess\xe1rio
• Celebre conquistas financeiras, mesmo pequenas
• Lembre-se: dinheiro \xe9 ferramenta, n\xe3o define seu valor
• Busque equil\xedbrio entre economia e qualidade de vida

`;break;default:r+=`📋 **DIAGN\xd3STICO FINANCEIRO INICIAL**

Cada jornada financeira \xe9 \xfanica. Vamos trabalhar juntos para criar uma estrat\xe9gia personalizada para sua situa\xe7\xe3o.

**Pr\xf3ximos Passos Recomendados:**
• Organize sua situa\xe7\xe3o financeira atual (receitas, despesas, patrim\xf4nio)
• Identifique seus maiores desafios e objetivos financeiros
• Crie um plano de a\xe7\xe3o com metas realistas e prazos definidos
• Busque conhecimento e ferramentas para gerenciamento financeiro
• Considere apoio profissional ou de grupo para manter a motiva\xe7\xe3o

`}return a.alternativeCategories.length>0&&(r+=`
💡 **NOTA:** Voc\xea tamb\xe9m pode se beneficiar de apoio nas \xe1reas: `,r+=a.alternativeCategories.map(e=>e.category.replace("_"," ")).join(", "),r+=`

`),s&&(r+=`
💼 **INSIGHTS PARA PROFISSIONAIS DA SA\xdaDE:**

Como profissional da \xe1rea de sa\xfade, voc\xea enfrenta desafios \xfanicos:
• Renda vari\xe1vel requer planejamento diferenciado
• Necessidade de manter reserva maior devido \xe0 natureza aut\xf4noma do trabalho
• Investir em educa\xe7\xe3o cont\xednua \xe9 essencial, mas precisa estar no planejamento
• Sa\xfade financeira impacta diretamente sua capacidade de cuidar dos outros
• Equil\xedbrio entre investir no neg\xf3cio e na seguran\xe7a pessoal

`),e.groupAccepted&&(r+=`
👥 **COMUNIDADE DE APOIO:**

Ficamos felizes que voc\xea tenha interesse em participar de nossa comunidade! Logo voc\xea receber\xe1 informa\xe7\xf5es sobre como acessar o grupo exclusivo de profissionais da sa\xfade. L\xe1 voc\xea poder\xe1 compartilhar experi\xeancias, tirar d\xfavidas e receber suporte em sua jornada financeira.

`),r+=`
---

Este \xe9 um diagn\xf3stico inicial. No nosso curso completo, voc\xea ter\xe1 acesso a:
• Ferramentas pr\xe1ticas de planejamento financeiro
• Estrat\xe9gias espec\xedficas para profissionais aut\xf4nomos
• Suporte cont\xednuo e comunidade ativa
• Conte\xfado atualizado sobre investimentos e gest\xe3o financeira

Estamos aqui para apoiar sua transforma\xe7\xe3o financeira! 💪

Equipe FinanPsi`}function r(e){let a=i(e.challenge),o={dívidas:"Priorize o gerenciamento de d\xedvidas com estrat\xe9gias de renegocia\xe7\xe3o e pagamento inteligente.",poupança:"Desenvolva h\xe1bitos de poupan\xe7a consistentes, come\xe7ando com valores pequenos e automatizados.",planejamento:"Crie um sistema de planejamento financeiro adaptado para sua renda vari\xe1vel.",investimento:"Prepare-se para investir com seguran\xe7a, come\xe7ando por uma base s\xf3lida de reservas.",ansiedade:"Trabalhe tanto a parte t\xe9cnica quanto emocional da sua rela\xe7\xe3o com o dinheiro.",renda_variável:"Desenvolva estrat\xe9gias espec\xedficas para gerenciar a variabilidade da sua renda.",emergência:"Estabele\xe7a uma reserva de emerg\xeancia robusta para imprevistos e seguran\xe7a financeira.",aposentadoria:"Planeje sua aposentadoria com anteced\xeancia, aproveitando o poder do tempo.",educação_financeira:"Invista em seu conhecimento financeiro para tomar decis\xf5es mais informadas.",relacionamento_dinheiro:"Trabalhe o aspecto emocional da sua rela\xe7\xe3o com o dinheiro.",geral:"Desenvolva uma estrat\xe9gia financeira personalizada para sua situa\xe7\xe3o espec\xedfica."};return o[a.category]||o.geral}async function n(e,a={}){let i=Date.now(),{useCache:r="false"!==process.env.DIAGNOSIS_USE_CACHE,preferFlowise:t="true"===process.env.DIAGNOSIS_PREFER_FLOWISE,fallbackToRules:d=!0}=a;if(r)try{let a=(await o.e(503).then(o.bind(o,1503))).default.get(e);if(a)return{diagnosis:a.diagnosis,method:"cache",responseTime:Date.now()-i,cached:!0}}catch(e){console.warn("[Diagn\xf3stico] Erro ao acessar cache:",e)}if(t)try{let{generateDiagnosisWithFlowise:a}=await o.e(291).then(o.bind(o,6291)),s=await a(e);if(s.success&&s.diagnosis){let a=s.diagnosis;if(r)try{(await o.e(503).then(o.bind(o,1503))).default.set(e,a,"flowise")}catch(e){console.warn("[Diagn\xf3stico] Erro ao armazenar no cache:",e)}return console.log(`[Diagn\xf3stico] Gerado via Flowise em ${s.responseTime}ms`),{diagnosis:a,method:"flowise",responseTime:s.responseTime||Date.now()-i,flowiseAttempted:!0,flowiseSuccess:!0}}if(console.warn(`[Diagn\xf3stico] Flowise falhou: ${s.error}`),!d)throw Error(`Flowise falhou e fallback desabilitado: ${s.error}`)}catch(e){if(console.error("[Diagn\xf3stico] Erro ao usar Flowise:",e.message||e),!d)throw e}let c=s(e),m=Date.now()-i;if(r)try{(await o.e(503).then(o.bind(o,1503))).default.set(e,c,t?"hybrid":"rules")}catch(e){console.warn("[Diagn\xf3stico] Erro ao armazenar no cache:",e)}return console.log(`[Diagn\xf3stico] Gerado via regras em ${m}ms`),{diagnosis:c,method:t?"hybrid":"rules",responseTime:m,flowiseAttempted:t,flowiseSuccess:!1}}o.d(a,{Cb:()=>r,generateDiagnosis:()=>s,vz:()=>n,zr:()=>i})},7657:(e,a,o)=>{"use strict";o.d(a,{Ge:()=>s});let i=new Map;function s(e,a={}){let{maxRequests:o=Number(process.env.RATE_LIMIT_MAX_REQUESTS||5),windowMs:r=Number(process.env.RATE_LIMIT_WINDOW_MS||9e5),identifier:n}=a;return function(e,a=5,o=9e5){let s=Date.now(),r=i.get(e);return!r||s>r.resetTime?(i.set(e,{count:1,resetTime:s+o}),{allowed:!0,remaining:a-1,resetTime:s+o}):r.count>=a?{allowed:!1,remaining:0,resetTime:r.resetTime}:(r.count++,i.set(e,r),{allowed:!0,remaining:a-r.count,resetTime:r.resetTime})}(n||function(e){let a=e.headers.get("x-forwarded-for");return a?a.split(",")[0].trim():e.headers.get("x-real-ip")||"unknown"}(e),o,r)}"undefined"!=typeof setInterval&&setInterval(()=>{let e=Date.now();for(let[a,o]of i.entries())e>o.resetTime&&i.delete(a)},3e5)}};