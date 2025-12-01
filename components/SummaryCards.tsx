import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';
import { SummaryData } from '../types';

interface SummaryCardsProps {
  summary: SummaryData;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Card Entrada - Gradiente Verde/Esmeralda */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-3xl shadow-lg shadow-emerald-200 text-white transition-transform hover:scale-[1.02]">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 blur-xl"></div>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-emerald-100 font-medium text-sm mb-1">Entradas</p>
            <h3 className="text-3xl font-bold">R$ {summary.totalIncome.toFixed(2)}</h3>
          </div>
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
            <ArrowUpCircle size={28} className="text-white" />
          </div>
        </div>
      </div>

      {/* Card Saída - Gradiente Vermelho/Rosa */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-pink-600 p-6 rounded-3xl shadow-lg shadow-rose-200 text-white transition-transform hover:scale-[1.02]">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 blur-xl"></div>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-rose-100 font-medium text-sm mb-1">Saídas</p>
            <h3 className="text-3xl font-bold">R$ {summary.totalExpense.toFixed(2)}</h3>
          </div>
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
            <ArrowDownCircle size={28} className="text-white" />
          </div>
        </div>
      </div>

      {/* Card Saldo - Gradiente Azul/Indigo */}
      <div className={`relative overflow-hidden p-6 rounded-3xl shadow-lg transition-transform hover:scale-[1.02] text-white
        ${summary.balance >= 0 
          ? 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-200' 
          : 'bg-gradient-to-br from-orange-500 to-red-500 shadow-orange-200'
        }`}>
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 blur-xl"></div>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-white/80 font-medium text-sm mb-1">Saldo Atual</p>
            <h3 className="text-3xl font-bold">R$ {summary.balance.toFixed(2)}</h3>
          </div>
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
            <Wallet size={28} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};