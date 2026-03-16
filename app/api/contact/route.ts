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
      console.warn('EMAIL_PASS não configurado no .env.local. O e-mail não será enviado, mas o log será gerado.');
      console.log('Dados do Contato:', { empresa, nome, whatsapp, mensagem });
      return NextResponse.json({ 
        message: 'Contato recebido (modo simulação)', 
        data: { empresa, nome, whatsapp, mensagem } 
      }, { status: 200 });
    }

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'E-mail enviado com sucesso' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return NextResponse.json({ error: 'Erro ao processar o contato' }, { status: 500 });
  }
}
