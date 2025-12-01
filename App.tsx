import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Transaction, SummaryData, CategoryData, ChartDataPoint, DateFilterType } from './types';
import { INITIAL_TRANSACTIONS, COLORS } from './constants';
import { SummaryCards } from './components/SummaryCards';
import { Charts } from './components/Charts';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { GeminiAdvisor } from './components/GeminiAdvisor';
import { Wallet, Filter, RefreshCw, Trash2 } from 'lucide-react';

// Helper seguro para parsing JSON
const safeJSONParse = (key: string, fallback: any) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Erro ao ler ${key} do localStorage`, e);
    return fallback;
  }
};

const App: React.FC = () => {
  // App Data State - Carrega direto do localStorage ou usa inicial
  const [transactions, setTransactions] = useState<Transaction[]>(() => 
    safeJSONParse('finansmart_transactions', INITIAL_TRANSACTIONS)
  );
  
  // States for Filtering
  const [filterType, setFilterType] = useState<DateFilterType>('current_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // -- Persistence Logic --
  useEffect(() => {
    localStorage.setItem('finansmart_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (newTransactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...newTransactionData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleResetData = useCallback(() => {
    if (window.confirm('Deseja resetar para os dados iniciais de exemplo? Todos os seus lançamentos atuais serão apagados.')) {
      setTransactions(INITIAL_TRANSACTIONS);
    }
  }, []);

  // -- Filter Logic --
  const filteredTransactions = useMemo<Transaction[]>(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return transactions.filter(t => {
      const tDate = new Date(t.date + 'T00:00:00'); // Force local time handling
      
      switch (filterType) {
        case 'current_month':
          return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
        case 'current_year':
          return tDate.getFullYear() === now.getFullYear();
        case 'last_30_days':
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 30);
          return tDate >= thirtyDaysAgo && tDate <= new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        case 'custom':
          if (!customStartDate || !customEndDate) return true;
          const start = new Date(customStartDate + 'T00:00:00');
          const end = new Date(customEndDate + 'T00:00:00');
          return tDate >= start && tDate <= end;
        default:
          return true;
      }
    });
  }, [transactions, filterType, customStartDate, customEndDate]);

  // -- Data Processing for Dashboard --

  const summary: SummaryData = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
    const totalExpense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
    
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    };
  }, [filteredTransactions]);

  const categoryData: CategoryData[] = useMemo(() => {
    const expenses = filteredTransactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const chartData: ChartDataPoint[] = useMemo(() => {
    const grouped = filteredTransactions.reduce((acc: Record<string, ChartDataPoint>, curr: Transaction) => {
      const date = curr.date;
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (curr.type === 'income') {
        acc[date].income += curr.amount;
      } else {
        acc[date].expense += curr.amount;
      }
      return acc;
    }, {} as Record<string, ChartDataPoint>);

    return (Object.values(grouped) as ChartDataPoint[])
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-15);
  }, [filteredTransactions]);

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-[#0070F0] p-2 rounded-xl shadow-lg shadow-blue-200/50">
                <Wallet className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">FinanSmart</h1>
                <p className="text-xs text-[#0070F0] font-medium bg-blue-50 px-2 py-0.5 rounded-full inline-block">Personal Finance</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <Filter size={20} className="text-[#0070F0]" />
            <span>Filtrar Período:</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button 
              onClick={() => setFilterType('current_month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === 'current_month' ? 'bg-[#0070F0] text-white shadow-md shadow-blue-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
            >
              Mês Atual
            </button>
            <button 
              onClick={() => setFilterType('last_30_days')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === 'last_30_days' ? 'bg-[#0070F0] text-white shadow-md shadow-blue-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
            >
              Últimos 30 Dias
            </button>
            <button 
              onClick={() => setFilterType('current_year')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === 'current_year' ? 'bg-[#0070F0] text-white shadow-md shadow-blue-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
            >
              Ano Atual
            </button>
            <button 
              onClick={() => setFilterType('custom')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === 'custom' ? 'bg-[#0070F0] text-white shadow-md shadow-blue-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
            >
              Personalizado
            </button>
          </div>

          {filterType === 'custom' && (
            <div className="flex items-center gap-2 animate-fade-in">
              <input 
                type="date" 
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0070F0]/50 outline-none"
              />
              <span className="text-slate-400">-</span>
              <input 
                type="date" 
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0070F0]/50 outline-none"
              />
            </div>
          )}
        </div>

        {/* AI Advisor */}
        <GeminiAdvisor transactions={filteredTransactions} />

        {/* Summary Cards */}
        <SummaryCards summary={summary} />

        {/* Charts */}
        <Charts timeData={chartData} categoryData={categoryData} />

        {/* Transaction Area */}
        <div className="flex flex-col gap-6">
          <TransactionForm onAddTransaction={handleAddTransaction} />
          <TransactionList transactions={filteredTransactions} onDeleteTransaction={handleDeleteTransaction} />
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-slate-400 text-sm flex items-center justify-center gap-4">
           <p>© 2025 FinanSmart AI</p>
           <button onClick={handleResetData} className="flex items-center gap-1 hover:text-rose-500 transition-colors">
              <Trash2 size={12} /> Limpar Todos os Dados
           </button>
        </div>

      </main>
    </div>
  );
};

export default App;