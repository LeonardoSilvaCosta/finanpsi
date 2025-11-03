import nodemailer from 'nodemailer'
import {
  generateWelcomeEmailHTML,
  generateWelcomeEmailText,
} from './email-templates'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true', // Gmail: false em 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  logger: process.env.SMTP_DEBUG === 'true',
  debug: process.env.SMTP_DEBUG === 'true',
})

let verifiedOnce = false

async function verifyOnce() {
  if (verifiedOnce) return
  try {
    await transporter.verify()
    verifiedOnce = true
    // eslint-disable-next-line no-console
    console.log('[SMTP] Transporte verificado com sucesso')
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[SMTP] Falha ao verificar transporte:', err)
  }
}

export async function sendWelcomeEmail(to: string, name: string, diagnosis?: string) {
  await verifyOnce()
  const fromAddress = process.env.SMTP_USER || 'no-reply@finanpsi.com.br'
  
  // Gerar templates HTML e texto (inclui diagnóstico se disponível)
  const htmlContent = generateWelcomeEmailHTML(name, diagnosis)
  const textContent = generateWelcomeEmailText(name, diagnosis)
  
  return transporter.sendMail({
    from: `"FinanPsi" <${fromAddress}>`,
    replyTo: 'no-reply@finanpsi.com.br',
    to,
    subject: 'Bem-vindo ao Diagnóstico Financeiro & Comunidade VIP!',
    text: textContent,
    html: htmlContent,
  })
}
