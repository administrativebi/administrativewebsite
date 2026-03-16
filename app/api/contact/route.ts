import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/resend';

export async function POST(req: Request) {
  try {
    const { empresa, nome, whatsapp, mensagem } = await req.json();

    const result = await sendEmail({
      subject: `Novo Contato Site: ${empresa}`,
      html: `
        <h2>Novo Contato via Site - Administrative PaaS</h2>
        <p><strong>Empresa:</strong> ${empresa}</p>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp}</p>
        <p><strong>Mensagem:</strong> ${mensagem}</p>
        <hr />
        <p><small>Este e-mail foi enviado automaticamente pelo sistema Administrative via Resend.</small></p>
      `,
    });

    if (result.success) {
      return NextResponse.json({ message: 'E-mail enviado com sucesso via Resend' }, { status: 200 });
    }

    // Caso falte a API KEY, entra em modo simulação para não quebrar o site
    console.warn('E-mail não enviado. Verifique se RESEND_API_KEY está configurada na Vercel.');
    console.log('Dados do Contato:', { empresa, nome, whatsapp, mensagem });
    
    return NextResponse.json({ 
      message: 'Contato recebido (modo simulação)', 
      data: { empresa, nome, whatsapp, mensagem } 
    }, { status: 200 });

  } catch (error: any) {
    console.error('ERRO FATAL NA ROTA DE CONTATO:', error);
    return NextResponse.json({ error: 'Erro interno ao processar o contato', details: error.message }, { status: 500 });
  }
}
