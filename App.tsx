import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Transaction, SummaryData, CategoryData, ChartDataPoint, DateFilterType, User } from './types';
import { INITIAL_TRANSACTIONS, COLORS } from './constants';
import { SummaryCards } from './components/SummaryCards';
import { Charts } from './components/Charts';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { GeminiAdvisor } from './components/GeminiAdvisor';
import { Login } from './components/Login';
import { SharingModal } from './components/SharingModal';
import { Wallet, Calendar, Filter, LogOut, User as UserIcon, Users, Share2, Info } from 'lucide-react';

const App: React.FC = () => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Data Ownership State (Para suportar compartilhamento)
  const [dataOwnerEmail, setDataOwnerEmail] = useState<string | null>(null);

  // App Data State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // UI State
  const [isSharingModalOpen, setIsSharingModalOpen] = useState(false);
  
  // States for Filtering
  const [filterType, setFilterType] = useState<DateFilterType>('current_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // -- Persistence Logic --

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    
    // Lógica de Compartilhamento
    const permissions = JSON.parse(localStorage.getItem('finansmart_permissions') || '{}');
    const ownerEmail = permissions[user.email] || user.email; 
    
    setDataOwnerEmail(ownerEmail);

    const storedData = localStorage.getItem(`finansmart_data_${ownerEmail}`);
    
    if (storedData) {
      setTransactions(JSON.parse(storedData));
    } else {
      if (ownerEmail === user.email) {
        setTransactions(INITIAL_TRANSACTIONS);
        localStorage.setItem(`finansmart_data_${ownerEmail}`, JSON.stringify(INITIAL_TRANSACTIONS));
      } else {
        setTransactions([]);
      }
    }
  };

  // Quando as transações mudarem, salvar no localStorage do DONO DOS DADOS
  useEffect(() => {
    if (dataOwnerEmail && currentUser) {
      localStorage.setItem(`finansmart_data_${dataOwnerEmail}`, JSON.stringify(transactions));
    }
  }, [transactions, dataOwnerEmail, currentUser]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setDataOwnerEmail(null);
    setTransactions([]);
    setIsSharingModalOpen(false);
  }, []);

  // -- Security: Auto Logout on Inactivity --
  useEffect(() => {
    if (!currentUser) return;

    const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutes in milliseconds
    let timeoutId: ReturnType<typeof setTimeout>;

    const doLogout = () => {
      handleLogout();
      alert("Por segurança, sua sessão foi encerrada após 10 minutos de inatividade.");
    };

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(doLogout, INACTIVITY_LIMIT);
    };

    // Events to track activity
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    
    // Add listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // Initial start
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [currentUser, handleLogout]);


  // -- Filter Logic --
  const filteredTransactions = useMemo(() => {
    if (!currentUser) return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return transactions.filter(t => {
      const tDate = new Date(t.date + 'T00:00:00'); // Force local time handling for date string
      
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
  }, [transactions, filterType, customStartDate, customEndDate, currentUser]);

  // -- Data Processing for Dashboard (Uses Filtered Data) --

  const summary: SummaryData = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
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
      .sort((a, b) => Number(b.value) - Number(a.value)); // Sort highest expenses first
  }, [filteredTransactions]);

  const timeData: ChartDataPoint[] = useMemo(() => {
    // Sort transactions by date first
    const sorted = [...filteredTransactions].sort((a, b) => a.date.localeCompare(b.date));
    
    // Group by date
    const grouped = sorted.reduce((acc, curr) => {
      const dateObj = new Date(curr.date);
      // Format date as DD/MM
      const dateStr = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      
      if (!acc[dateStr]) {
        acc[dateStr] = { date: dateStr, income: 0, expense: 0 };
      }
      if (curr.type === 'income') {
        acc[dateStr].income += curr.amount;
      } else {
        acc[dateStr].expense += curr.amount;
      }
      return acc;
    }, {} as Record<string, ChartDataPoint>);

    return Object.values(grouped);
  }, [filteredTransactions]);

  // -- Handlers --

  const addTransaction = (newTx: Omit<Transaction, 'id'>) => {
    // Basic ID generation that works in all environments
    const transaction: Transaction = {
      ...newTx,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // -- Render --

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // Verificar se estou visualizando dados de outra pessoa
  const isSharedView = dataOwnerEmail !== currentUser.email;

  return (
    <div className="min-h-screen bg-slate-100 pb-20 font-sans relative">
      {/* Header com a nova cor Azul Elétrico */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#0070F0] p-2.5 rounded-xl text-white shadow-lg shadow-blue-200">
              <Wallet size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight leading-none">FinanSmart</h1>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-[#0070F0] bg-blue-50 px-2 py-0.5 rounded-full">Personal Finance</span>
                {isSharedView && (
                   <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-100">
                     <Users size={10} /> Conta Família ({dataOwnerEmail})
                   </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
               <UserIcon size={16} className="text-[#0070F0]" />
               <span className="truncate max-w-[100px]">{currentUser.name}</span>
             </div>
             
             <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
             
             <button
                onClick={() => setIsSharingModalOpen(true)}
                className="hidden md:flex items-center gap-2 text-slate-500 hover:text-[#0070F0] transition-colors text-sm font-medium bg-slate-50 hover:bg-blue-50 px-3 py-2 rounded-lg border border-transparent hover:border-blue-100"
                title="Compartilhar Conta"
             >
                <Share2 size={18} />
                <span className="hidden lg:inline">Compartilhar</span>
             </button>

             <button 
               onClick={handleLogout}
               className="flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors text-sm font-medium bg-slate-50 hover:bg-rose-50 px-3 py-2 rounded-lg"
               title="Sair"
             >
               <LogOut size={18} />
             </button>
          </div>
        </div>
      </header>

      {/* Shared View Warning Banner */}
      {isSharedView && (
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm text-amber-800">
            <Info size={16} />
            <span>
              Você está visualizando e editando os dados financeiros de <strong>{dataOwnerEmail}</strong>.
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Mobile Actions Bar */}
        <div className="md:hidden flex justify-end mb-4">
             <button
                onClick={() => setIsSharingModalOpen(true)}
                className="flex items-center gap-2 text-[#0070F0] bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100 font-medium text-sm w-full justify-center"
             >
                <Share2 size={18} />
                Gerenciar Família
             </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Filter size={20} className="text-[#0070F0]" />
            <span>Filtrar Período:</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'current_month', label: 'Mês Atual' },
              { id: 'last_30_days', label: 'Últimos 30 Dias' },
              { id: 'current_year', label: 'Ano Atual' },
              { id: 'custom', label: 'Personalizado' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterType(filter.id as DateFilterType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterType === filter.id 
                    ? 'bg-[#0070F0] text-white shadow-md shadow-blue-200' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {filterType === 'custom' && (
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <Calendar size={16} className="text-slate-400" />
              <input 
                type="date" 
                value={customStartDate} 
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="bg-transparent text-sm text-slate-600 focus:outline-none"
              />
              <span className="text-slate-400">-</span>
              <input 
                type="date" 
                value={customEndDate} 
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="bg-transparent text-sm text-slate-600 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Gemini Advisor Section */}
        <GeminiAdvisor transactions={filteredTransactions} />

        {/* Dashboard Summary */}
        <section className="animate-fade-in-up">
           <SummaryCards summary={summary} />
        </section>

        {/* Charts Section */}
        <section className="animate-fade-in-up delay-100">
          <Charts timeData={timeData} categoryData={categoryData} />
        </section>

        {/* Add Transaction Form */}
        <div className="animate-fade-in-up delay-200">
           <TransactionForm onAddTransaction={addTransaction} />
        </div>

        {/* Transactions List */}
        <div className="animate-fade-in-up delay-300">
          <TransactionList 
            transactions={filteredTransactions} 
            onDeleteTransaction={deleteTransaction} 
          />
        </div>

      </main>

      {/* Modals */}
      {isSharingModalOpen && currentUser && (
        <SharingModal 
          currentUser={currentUser} 
          onClose={() => setIsSharingModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;