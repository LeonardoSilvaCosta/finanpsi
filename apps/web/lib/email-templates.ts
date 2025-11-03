// Função auxiliar para formatar diagnóstico em HTML
function getDiagnosisSectionHTML(diagnosis: string): string {
  // Escapar HTML e converter quebras de linha e markdown básico
  const escaped = diagnosis
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
  
  return `
              <!-- Diagnóstico Personalizado -->
              <div style="background-color: #f0f4ff; border: 1px solid #667eea; border-radius: 8px; padding: 25px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px; color: #667eea; font-size: 20px; font-weight: 600;">
                  📊 Seu Diagnóstico Financeiro Personalizado
                </h3>
                <div style="color: #1a1a1a; font-size: 15px; line-height: 1.7;">${escaped}</div>
              </div>
  `
}

export function generateWelcomeEmailHTML(name: string, diagnosis?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finanpsi.com.br'
  const diagnosisUrl = `${baseUrl}/diagnostico`

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao FinanPsi</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Cabeçalho -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">FinanPsi</h1>
              <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">Planejamento Financeiro para Psicólogos</p>
            </td>
          </tr>
          
          <!-- Conteúdo Principal -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                Olá, ${name}! 👋
              </h2>
              
              <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                É um prazer ter você conosco! Recebemos seu interesse no <strong>Diagnóstico Financeiro</strong> e estamos animados para ajudar você a organizar suas finanças e superar bloqueios emocionais relacionados ao dinheiro.
              </p>
              
              ${diagnosis ? getDiagnosisSectionHTML(diagnosis) : `
              <p style="margin: 0 0 30px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Nos próximos passos, você receberá um diagnóstico personalizado baseado nas informações que compartilhou conosco.
              </p>
              `}
              
              <!-- Botão CTA -->
              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td align="center" style="padding: 0;">
                    <a href="${diagnosisUrl}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                      Acessar Meu Diagnóstico
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Próximos Passos -->
              <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 18px; font-weight: 600;">
                  O que vem por aí:
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #4a4a4a; font-size: 15px; line-height: 1.8;">
                  <li style="margin-bottom: 10px;">📊 Diagnóstico financeiro personalizado</li>
                  <li style="margin-bottom: 10px;">📚 Acesso ao curso online prático</li>
                  <li style="margin-bottom: 10px;">👥 Comunidade VIP de apoio (se você se interessou)</li>
                  <li style="margin-bottom: 10px;">💡 Estratégias práticas para investir no seu crescimento</li>
                </ul>
              </div>
              
              <p style="margin: 30px 0 20px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Estamos aqui para apoiar sua jornada de transformação financeira. Qualquer dúvida, é só responder este email!
              </p>
              
              <p style="margin: 20px 0 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Com carinho,<br>
                <strong>Equipe FinanPsi</strong>
              </p>
            </td>
          </tr>
          
          <!-- Rodapé -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 10px; color: #6c757d; font-size: 14px;">
                <strong>FinanPsi</strong> - Planejamento Financeiro para Psicólogos
              </p>
              <p style="margin: 0 0 10px; color: #6c757d; font-size: 12px;">
                Email: <a href="mailto:contato@finanpsi.com.br" style="color: #667eea; text-decoration: none;">contato@finanpsi.com.br</a>
              </p>
              <p style="margin: 20px 0 0; color: #adb5bd; font-size: 11px; line-height: 1.5;">
                Você está recebendo este email porque se inscreveu na plataforma FinanPsi.<br>
                Não deseja mais receber nossos emails? <a href="${baseUrl}/unsubscribe" style="color: #667eea; text-decoration: underline;">Clique aqui</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

export function generateWelcomeEmailText(name: string, diagnosis?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finanpsi.com.br'
  const diagnosisUrl = `${baseUrl}/diagnostico`

  return `
Olá, ${name}!

É um prazer ter você conosco! Recebemos seu interesse no Diagnóstico Financeiro e estamos animados para ajudar você a organizar suas finanças e superar bloqueios emocionais relacionados ao dinheiro.

${diagnosis ? `
═══════════════════════════════════════════════════════
📊 SEU DIAGNÓSTICO FINANCEIRO PERSONALIZADO
═══════════════════════════════════════════════════════

${diagnosis}

═══════════════════════════════════════════════════════
` : `
Nos próximos passos, você receberá um diagnóstico personalizado baseado nas informações que compartilhou conosco.

ACESSE SEU DIAGNÓSTICO:
${diagnosisUrl}
`}

O QUE VEM POR AÍ:
📊 Diagnóstico financeiro personalizado
📚 Acesso ao curso online prático
👥 Comunidade VIP de apoio (se você se interessou)
💡 Estratégias práticas para investir no seu crescimento

Estamos aqui para apoiar sua jornada de transformação financeira. Qualquer dúvida, é só responder este email!

Com carinho,
Equipe FinanPsi

---
FinanPsi - Planejamento Financeiro para Psicólogos
Email: contato@finanpsi.com.br
Site: ${baseUrl}

Você está recebendo este email porque se inscreveu na plataforma FinanPsi.
Não deseja mais receber nossos emails? Acesse: ${baseUrl}/unsubscribe
  `.trim()
}

