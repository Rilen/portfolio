export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://rilen.github.io",
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
      
      if (data.error) {
        throw new Error(data.error.message || "Erro no Gemini");
      }

      const botReply = data.candidates[0].content.parts[0].text;

      return new Response(JSON.stringify({ reply: botReply }), { headers: corsHeaders });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message || "Erro na conexão com IA" }), { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  }
};
