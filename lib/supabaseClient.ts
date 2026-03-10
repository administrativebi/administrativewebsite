import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Database features will not work correctly.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Função para registrar cliques de analytics no Supabase
 * @param botao_id Identificador único do botão
 * @param section Seção onde o botão se encontra
 */
export const trackClick = async (botao_id: string, section: string) => {
  const { error } = await supabase
    .from('analytics_clicks')
    .insert([{ botao_id, section, timestamp: new Date().toISOString() }]);
  
  if (error) console.error('Error tracking click:', error);
};

/**
 * Função para salvar logs do chat de IA
 */
export const logAiChat = async (user_query: string, ai_response: string, sentiment_score: number = 0) => {
  const { error } = await supabase
    .from('ai_chat_logs')
    .insert([{ user_query, ai_response, sentiment_score, created_at: new Date().toISOString() }]);
  
  if (error) console.error('Error logging chat:', error);
};
