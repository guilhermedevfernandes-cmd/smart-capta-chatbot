
# 🚀 Servidor Proxy - Smart Capta Bot

Este é o servidor proxy que resolve problemas de CORS ao conectar o widget do chatbot com a API da Abacus.AI.

## 📋 O que é este proxy?

O proxy atua como intermediário entre o widget do chatbot (frontend) e a API da Abacus.AI (backend), resolvendo problemas de CORS que ocorrem quando tentamos fazer chamadas diretas da API a partir do navegador.

### Fluxo de Comunicação

```
Widget (Navegador) → Proxy (Vercel) → API Abacus.AI
                    ←                ←
```

## 🚀 Deploy no Vercel

### Pré-requisitos

1. Conta no [Vercel](https://vercel.com) (gratuita)
2. [Vercel CLI](https://vercel.com/download) instalado (opcional)

### Método 1: Deploy via Interface Web (Mais Fácil)

1. **Faça login no Vercel**: Acesse [vercel.com](https://vercel.com)

2. **Importe o Projeto**:
   - Clique em "Add New" → "Project"
   - Importe o repositório do GitHub ou faça upload manual da pasta `proxy/`

3. **Configure o Projeto**:
   - Framework Preset: **Other**
   - Root Directory: `.` (raiz do projeto)
   - Build Settings: Deixe em branco

4. **Deploy**:
   - Clique em "Deploy"
   - Aguarde o deploy finalizar (1-2 minutos)

5. **Copie a URL**:
   - Após o deploy, você receberá uma URL como: `https://seu-projeto.vercel.app`
   - Sua URL da API será: `https://seu-projeto.vercel.app/api/chat`

### Método 2: Deploy via CLI

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Navegar até a pasta do proxy
cd proxy/

# 3. Fazer login no Vercel
vercel login

# 4. Deploy
vercel --prod
```

Após o deploy, você receberá a URL do seu proxy.

## 🧪 Testar o Proxy

Após o deploy, teste se o proxy está funcionando:

```bash
# Substitua SUA-URL-DO-VERCEL pela URL do seu deploy
curl -X POST https://SUA-URL-DO-VERCEL.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "deployment_token": "d2b5f2e65f2041bcb49bd2dd32b52132",
    "deployment_id": "1a8d9c52a",
    "messages": [
      {"is_user": true, "text": "Olá"}
    ]
  }'
```

Se tudo estiver funcionando, você receberá uma resposta JSON com a mensagem do bot.

## 📁 Estrutura de Arquivos

```
proxy/
├── api/
│   └── chat.js          # Função serverless que processa as requisições
├── vercel.json          # Configuração do Vercel com CORS
├── package.json         # Dependências do projeto
├── .gitignore          # Arquivos a ignorar no Git
└── README.md           # Este arquivo
```

## 🔧 Configuração

O proxy já vem configurado e pronto para uso. Não é necessário alterar nada.

### Headers CORS Configurados

```javascript
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## 🐛 Solução de Problemas

### Erro 405 - Método não permitido

- **Causa**: Requisição não está usando o método POST
- **Solução**: Certifique-se de enviar requisições POST para `/api/chat`

### Erro 400 - Parâmetros inválidos

- **Causa**: Faltam parâmetros obrigatórios
- **Solução**: Verifique se está enviando `deployment_token`, `deployment_id` e `messages`

### Erro 500 - Erro interno

- **Causa**: Problema ao conectar com a API da Abacus.AI
- **Solução**: Verifique os logs no dashboard do Vercel

### Ver Logs no Vercel

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique no seu projeto
3. Vá em "Deployments"
4. Clique no deployment mais recente
5. Vá em "Functions" → "chat" para ver os logs

## 🔐 Segurança

### Recomendações Importantes

1. **Restringir Origens**: Por padrão, o proxy aceita requisições de qualquer origem (`*`). Para produção, restrinja para seu domínio:

```javascript
// Em api/chat.js, linha 22:
res.setHeader('Access-Control-Allow-Origin', 'https://seu-dominio.com');
```

2. **Limitar Taxa de Requisições**: Considere implementar rate limiting para evitar abuso

3. **Monitoramento**: Monitore o uso através do dashboard do Vercel

## 📞 Suporte

Se você encontrar problemas:

1. Verifique os logs no dashboard do Vercel
2. Teste o proxy usando o comando curl acima
3. Consulte a documentação completa no arquivo `GUIA-COMPLETO.md`

## 📄 Licença

MIT License - Sinta-se livre para usar e modificar conforme necessário.
