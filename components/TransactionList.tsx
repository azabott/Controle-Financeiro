import React from 'react';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDeleteTransaction }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800">Histórico de Lançamentos</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Data</th>
              <th className="p-4 font-semibold">Descrição</th>
              <th className="p-4 font-semibold">Categoria</th>
              <th className="p-4 font-semibold">Tipo</th>
              <th className="p-4 font-semibold text-right">Valor</th>
              <th className="p-4 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  Nenhum lançamento encontrado.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-600 text-sm whitespace-nowrap">
                    {new Date(t.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4 text-slate-800 font-medium text-sm">{t.description}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
                      {t.category}
                    </span>
                  </td>
                  <td className="p-4">
                    {t.type === 'income' ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <TrendingUp size={14} /> Entrada
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-600">
                        <TrendingDown size={14} /> Saída
                      </span>
                    )}
                  </td>
                  <td className={`p-4 text-right font-bold text-sm ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'expense' ? '- ' : '+ '}
                    R$ {t.amount.toFixed(2)}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => onDeleteTransaction(t.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};