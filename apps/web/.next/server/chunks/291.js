"use strict";exports.id=291,exports.ids=[291],exports.modules={6291:(e,o,s)=>{async function a(e){let o=Date.now(),s=function(){let e=process.env.FLOWISE_BASE_URL||process.env.NEXT_PUBLIC_FLOWISE_URL;return e?{baseUrl:e.replace(/\/$/,""),apiKey:process.env.FLOWISE_API_KEY,timeout:Number(process.env.FLOWISE_TIMEOUT||3e4)}:(console.warn("[Flowise] FLOWISE_BASE_URL n\xe3o configurado"),null)}();if(!s)return{success:!1,error:"Flowise n\xe3o configurado",method:"fallback",responseTime:Date.now()-o};let a=process.env.FLOWISE_CHATFLOW_ID||"default",r=`${s.baseUrl}/api/v1/prediction/${a}`,i=function(e){let o=e.profession||"profissional",s=e.challenge||"desafios financeiros gerais",a=e.groupAccepted?"O lead demonstrou interesse em participar de grupo de apoio.":"O lead n\xe3o demonstrou interesse em grupo de apoio no momento.";return`Voc\xea \xe9 um consultor financeiro especializado em ajudar psic\xf3logos e profissionais da sa\xfade que s\xe3o aut\xf4nomos e enfrentam desafios financeiros.

Contexto do Lead:
- Nome: ${e.name}
- Profiss\xe3o: ${o}
- Maior desafio financeiro: ${s}
- Interesse em grupo: ${a}

Gere um diagn\xf3stico financeiro personalizado, profissional e acolhedor que:
1. Identifique o principal desafio mencionado
2. Forne\xe7a an\xe1lises e a\xe7\xf5es pr\xe1ticas e espec\xedficas
3. Considere a realidade de profissionais aut\xf4nomos da \xe1rea de sa\xfade
4. Mantenha um tom emp\xe1tico e encorajador
5. Inclua passos de a\xe7\xe3o concretos e realiz\xe1veis
6. Seja relevante para a situa\xe7\xe3o espec\xedfica do lead

Formato desejado:
- Sauda\xe7\xe3o personalizada
- Identifica\xe7\xe3o da situa\xe7\xe3o/diagn\xf3stico
- A\xe7\xf5es recomendadas (bullet points)
- Insights espec\xedficos para profissionais da sa\xfade (se aplic\xe1vel)
- Mensagem sobre comunidade (se aplic\xe1vel)
- Assinatura da Equipe FinanPsi

Mantenha o diagn\xf3stico focado, pr\xe1tico e acolhedor. Evite jarg\xf5es t\xe9cnicos complexos demais.`}(e);try{let a=new AbortController,n=setTimeout(()=>a.abort(),s.timeout),t={"Content-Type":"application/json"};s.apiKey&&(t.Authorization=`Bearer ${s.apiKey}`),console.log(`[Flowise] Enviando requisi\xe7\xe3o para: ${r}`),console.log(`[Flowise] Lead: ${e.email}`);let l=await fetch(r,{method:"POST",headers:t,body:JSON.stringify({question:i,inputs:{leadName:e.name,leadEmail:e.email,leadProfession:e.profession||"",leadChallenge:e.challenge||"",leadGroupAccepted:e.groupAccepted}}),signal:a.signal});if(clearTimeout(n),!l.ok){let e=`Flowise retornou erro ${l.status}`,s="";try{let o=await l.text();console.error(`[Flowise] Erro HTTP ${l.status}:`,o);try{let a=JSON.parse(o);a.message?(s=a.message).includes("model")&&s.includes("does not exist")?(e="Modelo LLM n\xe3o configurado no chatflow do Flowise",console.error("[Flowise] ⚠️  ATEN\xc7\xc3O: O chatflow precisa ter um modelo LLM configurado. Acesse o Flowise e configure um n\xf3 LLM no seu chatflow.")):a.error?.message&&(s=a.error.message):a.error&&(s=JSON.stringify(a.error))}catch{s=o.substring(0,200)}s&&(e=`${e}: ${s}`)}catch(e){console.error("[Flowise] Erro ao ler resposta de erro:",e)}return{success:!1,error:e,method:"fallback",responseTime:Date.now()-o}}let c=await l.json(),d=Date.now()-o,u="";if(c.text?u=c.text:c.answer?u=c.answer:c.response?u=c.response:"string"==typeof c?u=c:(u=JSON.stringify(c,null,2),console.warn("[Flowise] Formato de resposta n\xe3o reconhecido, usando JSON completo")),!u||0===u.trim().length)throw Error("Resposta vazia do Flowise");return console.log(`[Flowise] Diagn\xf3stico gerado com sucesso em ${d}ms`),{success:!0,diagnosis:u.trim(),method:"flowise",responseTime:d}}catch(i){let e=Date.now()-o,a=i.message||String(i),r="AbortError"===i.name||a.includes("aborted");return r?console.error(`[Flowise] Timeout ap\xf3s ${s.timeout}ms`):console.error("[Flowise] Erro ao gerar diagn\xf3stico:",a),{success:!1,error:r?"Timeout ao conectar com Flowise":a,method:"fallback",responseTime:e}}}s.d(o,{generateDiagnosisWithFlowise:()=>a})}};