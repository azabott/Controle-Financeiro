import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Transaction, TransactionType } from '../types';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date) return;

    onAddTransaction({
      description,
      amount: parseFloat(amount),
      type,
      category,
      date,
    });

    // Reset form
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <PlusCircle className="text-[#0070F0]" size={20} />
        Adicionar Nova Transação
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div className="lg:col-span-1">
           <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Tipo</label>
           <div className="flex bg-slate-100 p-1 rounded-lg">
             <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Entrada
             </button>
             <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Saída
             </button>
           </div>
        </div>

        <div className="lg:col-span-1">
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Descrição</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Supermercado"
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070F0]/50 focus:border-[#0070F0] text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Valor (R$)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070F0]/50 focus:border-[#0070F0] text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070F0]/50 focus:border-[#0070F0] text-sm"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
           <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Data</label>
           <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070F0]/50 focus:border-[#0070F0] text-sm"
            required
          />
        </div>

        <button
          type="submit"
          className="lg:col-span-5 mt-2 w-full bg-[#0070F0] hover:bg-[#0040A0] text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-200"
        >
          <PlusCircle size={20} />
          Registrar Lançamento
        </button>
      </form>
    </div>
  );
};