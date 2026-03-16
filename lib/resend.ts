import { Resend } from 'resend';

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const EMAIL_CONFIG = {
  from: 'Administrative <onboarding@resend.dev>',
  to: 'admnistrativebi@gmail.com',
};

/**
 * Envia um e-mail formatado via Resend.
 * No plano gratuito, o 'from' deve ser 'onboarding@resend.dev'.
 */
export async function sendEmail({ subject, html }: { subject: string; html: string }) {
  if (!resend) {
    console.warn('RESEND: RESEND_API_KEY não configurada. E-mail não enviado.');
    return { success: false, error: 'API Key missing' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [EMAIL_CONFIG.to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('RESEND ERROR:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('RESEND FATAL ERROR:', err);
    return { success: false, error: err };
  }
}
