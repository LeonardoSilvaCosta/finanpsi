# Guia de Configuração do Flowise

## Problema Identificado

O erro indica que o chatflow no Flowise não tem um modelo LLM configurado:

```
Error: The model `` does not exist or you do not have access to it.
```

## Solução: Configurar Modelo LLM no Chatflow

### Passo 1: Acessar o Flowise

```bash
# Acesse no navegador
http://localhost:3001
```

### Passo 2: Abrir ou Criar Chatflow

1. Abra o chatflow com ID: `f3b01d6d-1321-4199-b6bb-77fd306093e3`
2. Ou crie um novo chatflow para diagnóstico financeiro

### Passo 3: Adicionar Nó LLM

No editor do Flowise:

1. **Arraste um nó LLM** para o canvas:
   - Procure por "ChatOpenAI", "OpenAI", "Anthropic", ou outro provedor LLM
   - Ou use "Chat Model" se disponível

2. **Configure o nó LLM:**
   - **Model Name**: Escolha um modelo (ex: `gpt-3.5-turbo`, `gpt-4`, `claude-3-sonnet`)
   - **API Key**: Configure sua chave de API do provedor
   - **Temperature**: 0.7 (recomendado para diagnósticos)
   - **Max Tokens**: 1000-2000 (suficiente para diagnóstico)

3. **Conecte o nó:**
   - Conecte o nó LLM ao nó de entrada (Input)
   - Conecte o nó LLM ao nó de saída (Output)

### Passo 4: Configurar Prompt

Adicione um nó de **Prompt Template** ou configure o prompt diretamente no nó LLM:

```
Você é um consultor financeiro especializado em ajudar psicólogos e profissionais da saúde que são autônomos e enfrentam desafios financeiros.

Contexto do Lead:
- Nome: {{leadName}}
- Profissão: {{leadProfession}}
- Maior desafio financeiro: {{leadChallenge}}
- Interesse em grupo: {{leadGroupAccepted}}

Gere um diagnóstico financeiro personalizado, profissional e acolhedor que:
1. Identifique o principal desafio mencionado
2. Forneça análises e ações práticas e específicas
3. Considere a realidade de profissionais autônomos da área de saúde
4. Mantenha um tom empático e encorajador
5. Inclua passos de ação concretos e realizáveis
6. Seja relevante para a situação específica do lead

Formato desejado:
- Saudação personalizada
- Identificação da situação/diagnóstico
- Ações recomendadas (bullet points)
- Insights específicos para profissionais da saúde (se aplicável)
- Mensagem sobre comunidade (se aplicável)
- Assinatura da Equipe FinanPsi

Mantenha o diagnóstico focado, prático e acolhedor. Evite jargões técnicos complexos demais.
```

### Passo 5: Salvar e Testar

1. **Salve o chatflow**
2. **Teste manualmente** no Flowise:
   - Use o botão "Test" ou "Run" no chatflow
   - Envie uma mensagem de teste
   - Verifique se retorna resposta do LLM

3. **Teste via API:**
   ```bash
   curl -X POST http://localhost:3001/api/v1/prediction/f3b01d6d-1321-4199-b6bb-77fd306093e3 \
     -H "Content-Type: application/json" \
     -d '{
       "question": "Teste de diagnóstico",
       "inputs": {
         "leadName": "Teste",
         "leadEmail": "teste@teste.com",
         "leadProfession": "Psicólogo",
         "leadChallenge": "Dívidas",
         "leadGroupAccepted": true
       }
     }'
   ```

### Passo 6: Verificar Logs

Após configurar, teste registrando um lead e verifique os logs:

```bash
docker compose logs -f web | grep Flowise
```

**Deve aparecer:**
```
[Flowise] Diagnóstico gerado com sucesso em XXXXms
[Diagnóstico] Método: flowise
```

## Provedores LLM Suportados

O Flowise suporta vários provedores:

- **OpenAI**: GPT-3.5, GPT-4
- **Anthropic**: Claude 3
- **Google**: Gemini
- **Local**: Ollama, LM Studio
- **Outros**: Hugging Face, Cohere, etc.

## Configuração de Variáveis de Ambiente (Opcional)

Se preferir configurar a API key via variável de ambiente no Flowise:

```yaml
# docker-compose.yml (serviço flowise)
environment:
  - PORT=3000
  - OPENAI_API_KEY=sua_chave_aqui  # Se usar OpenAI
  - ANTHROPIC_API_KEY=sua_chave_aqui  # Se usar Anthropic
```

## Troubleshooting

### Erro: "Model does not exist"
- ✅ Verifique se o modelo está configurado no nó LLM
- ✅ Verifique se a API key está correta
- ✅ Verifique se o modelo está disponível no seu plano da API

### Erro: "Chatflow not found"
- ✅ Verifique se o `FLOWISE_CHATFLOW_ID` está correto no `.env`
- ✅ Verifique se o chatflow foi salvo no Flowise

### Erro: "Timeout"
- ✅ Aumente `FLOWISE_TIMEOUT` no `.env` (padrão: 30000ms)
- ✅ Verifique se o modelo LLM está respondendo

### Resposta vazia
- ✅ Verifique se o prompt está configurado corretamente
- ✅ Verifique se o nó LLM está conectado corretamente
- ✅ Teste o chatflow diretamente na interface do Flowise

## Próximos Passos

Após configurar corretamente:

1. ✅ O sistema usará Flowise quando `DIAGNOSIS_PREFER_FLOWISE=true`
2. ✅ Fallback automático para regras se Flowise falhar
3. ✅ Cache de diagnósticos para melhor performance
4. ✅ Logs detalhados para monitoramento

