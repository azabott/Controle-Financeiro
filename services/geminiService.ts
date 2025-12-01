import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (transactions: Transaction[]): Promise<string> => {
  try {
    // Prepare a summary of transactions for the AI
    const transactionSummary = transactions.map(t => 
      `- ${t.date}: ${t.description} (${t.category}) - R$ ${t.amount.toFixed(2)} [${t.type === 'income' ? 'Entrada' : 'Saída'}]`
    ).join('\n');

    const prompt = `
      Você é um consultor financeiro pessoal especialista.
      Analise as seguintes transações financeiras recentes do usuário e forneça:
      1. Uma breve análise do padrão de gastos.
      2. 3 dicas práticas e acionáveis para economizar dinheiro baseadas nesses dados específicos.
      3. Um breve comentário motivacional sobre a saúde financeira.

      Mantenha a resposta formatada, amigável e direta (máximo de 200 palavras).
      
      Transações:
      ${transactionSummary}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar uma análise no momento.";
  } catch (error) {
    console.error("Error fetching Gemini advice:", error);
    return "Erro ao conectar com o consultor financeiro. Verifique sua chave de API ou tente novamente mais tarde.";
  }
};