import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  debugger: process.env.SMTP_DEBUG === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendWelcomeEmail(to: string, name: string) {
  await transporter.sendMail({
    from: '"FinanPsi" <no-reply@finanpsi.com.br>',
    to,
    subject: "Bem-vindo ao Diagnóstico Financeiro & Comunidade VIP!",
    text: `Olá ${name},\n\nObrigado por se inscrever... (link e instruções)`,
    html: `<p>Olá ${name},</p><p>Obrigado por se inscrever...</p>`,
  });
}
