
/**
 * Função Serverless para Proxy da API da Abacus.AI
 * 
 * Esta função atua como intermediária entre o widget do chatbot e a API da Abacus.AI,
 * resolvendo problemas de CORS que ocorrem quando o widget tenta fazer chamadas
 * diretas da API a partir do navegador.
 * 
 * Como funciona:
 * 1. Recebe requisições POST do widget com as mensagens do chat
 * 2. Encaminha a requisição para a API da Abacus.AI (https://api.abacus.ai/v0/getChatResponse)
 * 3. Retorna a resposta com headers CORS apropriados
 */

export default async function handler(req, res) {
  // ============================================
  // CONFIGURAÇÃO DE CORS
  // ============================================
  
  // Permite requisições de qualquer origem (você pode restringir para seu domínio específico)
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Permite os métodos necessários
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  // Permite os headers necessários
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Responde a requisições OPTIONS (preflight) enviadas pelo navegador
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ============================================
  // VALIDAÇÃO DO MÉTODO HTTP
  // ============================================
  
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido. Use POST.'
    });
  }

  try {
    // ============================================
    // EXTRAÇÃO DOS DADOS DA REQUISIÇÃO
    // ============================================
    
    const {
      deployment_token,
      deployment_id,
      messages,
      llm_name = null,
      num_completion_tokens = null,
      system_message = null,
      temperature = 0.0,
      filter_key_values = null,
      search_score_cutoff = null,
      chat_config = null,
      doc_infos = null,
      conversation_id = null
    } = req.body;

    // ============================================
    // VALIDAÇÃO DOS PARÂMETROS OBRIGATÓRIOS
    // ============================================
    
    if (!deployment_token || !deployment_id) {
      return res.status(400).json({
        success: false,
        error: 'deployment_token e deployment_id são obrigatórios'
      });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'messages deve ser um array'
      });
    }

    // ============================================
    // CHAMADA À API DA ABACUS.AI
    // ============================================
    
    console.log('Enviando requisição para Abacus.AI...');
    
    const abacusResponse = await fetch('https://api.abacus.ai/v0/getChatResponse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        deployment_token,
        deployment_id,
        messages,
        llm_name,
        num_completion_tokens,
        system_message,
        temperature,
        filter_key_values,
        search_score_cutoff,
        chat_config,
        doc_infos,
        conversation_id
      })
    });

    // ============================================
    // TRATAMENTO DE ERROS DA API
    // ============================================
    
    if (!abacusResponse.ok) {
      const errorText = await abacusResponse.text();
      console.error('Erro da API Abacus.AI:', errorText);
      
      return res.status(abacusResponse.status).json({
        success: false,
        error: `Erro da API Abacus.AI: ${abacusResponse.status}`,
        details: errorText
      });
    }

    // ============================================
    // RETORNO DA RESPOSTA
    // ============================================
    
    const data = await abacusResponse.json();
    console.log('Resposta recebida com sucesso');
    
    return res.status(200).json({
      success: true,
      ...data
    });

  } catch (error) {
    // ============================================
    // TRATAMENTO DE ERROS GERAIS
    // ============================================
    
    console.error('Erro no proxy:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
}
