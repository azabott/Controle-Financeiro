import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Transaction } from '../types';
import { getFinancialAdvice } from '../services/geminiService';

interface GeminiAdvisorProps {
  transactions: Transaction[];
}

export const GeminiAdvisor: React.FC<GeminiAdvisorProps> = ({ transactions }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetAdvice = async () => {
    if (transactions.length === 0) {
      setAdvice("Adicione algumas transações primeiro para que eu possa analisar seus dados!");
      return;
    }

    setLoading(true);
    const result = await getFinancialAdvice(transactions);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg mb-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-white opacity-10"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="text-yellow-300" />
            Assistente Financeiro IA
          </h3>
          <button
            onClick={handleGetAdvice}
            disabled={loading}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            {loading ? 'Analisando...' : 'Gerar Insights'}
          </button>
        </div>

        {advice ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-sm leading-relaxed border border-white/10 animate-fade-in">
            <p className="whitespace-pre-line">{advice}</p>
          </div>
        ) : (
          <p className="text-indigo-100 text-sm opacity-90">
            Clique em "Gerar Insights" para receber uma análise inteligente dos seus gastos e dicas personalizadas para economizar, powered by Gemini.
          </p>
        )}
      </div>
    </div>
  );
};