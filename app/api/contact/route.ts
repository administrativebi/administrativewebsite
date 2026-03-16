import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { empresa, nome, whatsapp, mensagem } = await req.json();

    // Configuração do transportador (SMTP)
    // Para fins de demonstração, vamos usar o Gmail com senha de app se disponível
    // Caso contrário, apenas logamos o erro de falta de credenciais
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'admnistrativebi@gmail.com',
        pass: process.env.EMAIL_PASS || '', // Senha de App do Gmail (precisa ser configurada no .env)
      },
    });

    const mailOptions = {
      from: 'admnistrativebi@gmail.com',
      to: 'admnistrativebi@gmail.com',
      subject: `Novo Contato Site: ${empresa}`,
      text: `
        Empresa: ${empresa}
        Nome: ${nome}
        WhatsApp: ${whatsapp}
        Mensagem: ${mensagem}
      `,
      html: `
        <h2>Novo Contato via Site</h2>
        <p><strong>Empresa:</strong> ${empresa}</p>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp}</p>
        <p><strong>Mensagem:</strong> ${mensagem}</p>
      `,
    };

    if (!process.env.EMAIL_PASS) {
      console.warn('CRITICAL: EMAIL_PASS não configurado no .env.local. O e-mail não será enviado. Entrando em modo simulação.');
      console.log('DADOS QUE SERIAM ENVIADOS:', { empresa, nome, whatsapp, mensagem });
      return NextResponse.json({ 
        message: 'Contato recebido (modo simulação - EMAIL_PASS ausente)', 
        data: { empresa, nome, whatsapp, mensagem } 
      }, { status: 200 });
    }

    try {
      console.log(`Tentando enviar e-mail para admnistrativebi@gmail.com via Gmail SMTP...`);
      const info = await transporter.sendMail(mailOptions);
      console.log('E-mail enviado com sucesso! MessageId:', info.messageId);
      return NextResponse.json({ message: 'E-mail enviado com sucesso', messageId: info.messageId }, { status: 200 });
    } catch (sendError: any) {
      console.error('ERRO SMTP AO ENVIAR E-MAIL:', sendError);
      return NextResponse.json({ 
        error: 'Erro no servidor de e-mail ao enviar', 
        details: sendError.message,
        code: sendError.code 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('ERRO FATAL NA ROTA DE CONTATO:', error);
    return NextResponse.json({ error: 'Erro interno ao processar o contato', details: error.message }, { status: 500 });
  }
}
