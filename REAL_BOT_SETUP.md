# 🤖 Guia de Ativação: RilenBot Real (Edge AI)

Para transformar o seu chat de uma "demonstração" em uma ferramenta de IA funcional, siga o guia abaixo. Este método utiliza o plano gratuito da **Cloudflare** e do **Google Gemini**, mantendo o custo zero.

## 1. Gerar Chave do Gemini
1. Acesse o [Google AI Studio](https://aistudio.google.com/).
2. Clique em **"Get API Key"**.
3. Crie uma nova chave para o modelo **Gemini 1.5 Flash**.
4. Copie a chave (você a usará no passo 2).

## 2. Criar o Cloudflare Worker (O Cérebro)
Como você é especialista em **CyberSecurity**, não vamos colocar a chave no HTML. Vamos usar um Worker:

1. Acesse o painel da [Cloudflare](https://dash.cloudflare.com/).
2. Vá em **Workers & Pages** -> **Create worker**.
3. Salve o Worker com um nome como `rilen-bot-api`.
4. Vá em **Settings** -> **Variables** -> **Add variable**.
   - Name: `GEMINI_API_KEY`
   - Value: `AIzaSyDLk4l3H3vM2gy9LZ9AuvUZjcAMYSkLBIg`
   - *Clique em "Save and deploy"*.
5. Vá em **Edit Code** e cole o código abaixo:

```javascript
export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // Em produção, mude para sua URL do GitHub Pages
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
      const { question } = await request.json();
      
      const systemInstruction = `Você é o RilenBot, assistente do Rilen Tavares Lima.
      Perfil: 25+ anos de TI, especialista em Big Data, IA e CyberSecurity.
      Diferencial: PcD (Implante Coclear), foco em Deep Work.
      Projetos: Preve-Ostras, Boostmark, BibleDS, IrrigaSeca, Sindi-Fácil.
      Responda de forma técnica, empática e concisa em Português.
      Se falarem sobre contratação, direcione para rilen.lima@gmail.com ou LinkedIn.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: `INSTRUÇÃO DE SISTEMA: ${systemInstruction}` }] },
            { role: "user", parts: [{ text: question }] }
          ]
        })
      });

      const data = await response.json();
      const botReply = data.candidates[0].content.parts[0].text;

      return new Response(JSON.stringify({ reply: botReply }), { headers: corsHeaders });

    } catch (err) {
      return new Response(JSON.stringify({ error: "Erro na conexão com IA" }), { status: 500, headers: corsHeaders });
    }
  }
};
```

## 3. Conectar o HTML ao Worker
No seu arquivo `index.html`, procure a função `chatSend.addEventListener` e substitua o bloco `setTimeout` (o mock) por esta chamada real:

```javascript
/* Substitua o mock por este fetch: */
const response = await fetch("https://SUA_URL_DO_WORKER.workers.dev", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: text })
});
const data = await response.json();
appendMessage('RilenBot', data.reply);
```

---

## ✅ Checklist Final de V3
- [ ] **EmailJS**: Testou o envio do formulário? Certifique-se de que o `template_id` está configurado para o seu e-mail.
- [ ] **Imagens**: Confira se `images/rilenbot-avatar.png` e `images/PreveOstras.png` carregam no site live.
- [ ] **Links**: Verifique se o link do currículo ou LinkedIn abre em nova aba (`target="_blank"`).
