import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Wallet, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    // Simulação de delay de rede
    setTimeout(() => {
      const storedUsers = JSON.parse(localStorage.getItem('finansmart_users') || '[]');

      if (isRegistering) {
        // Lógica de Cadastro
        if (!name || !email || password.length < 6) {
          setError('Preencha todos os campos. A senha deve ter no mínimo 6 caracteres.');
          setIsLoading(false);
          return;
        }

        const userExists = storedUsers.find((u: User) => u.email === email);
        if (userExists) {
          setError('Este e-mail já está cadastrado.');
          setIsLoading(false);
          return;
        }

        const newUser: User = { name, email, password };
        localStorage.setItem('finansmart_users', JSON.stringify([...storedUsers, newUser]));
        
        setIsRegistering(false);
        setSuccessMessage('Conta criada com sucesso! Faça login para continuar.');
        setPassword(''); // Limpar senha para forçar digitação no login
        setIsLoading(false);

      } else {
        // Lógica de Login
        const user = storedUsers.find((u: User) => u.email === email && u.password === password);

        if (user) {
          onLogin({ name: user.name, email: user.email });
        } else {
          setError('E-mail ou senha incorretos.');
          setIsLoading(false);
        }
      }
    }, 1500);
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setSuccessMessage('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/20 blur-3xl"></div>
        <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-3xl"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-emerald-500/20 blur-3xl"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white/50 w-full max-w-md p-8 rounded-3xl shadow-2xl relative z-10 animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg shadow-indigo-200 mb-4">
            <Wallet size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">FinanSmart</h1>
          <p className="text-slate-500 text-sm mt-2">
            {isRegistering ? 'Crie sua conta gratuita' : 'Gerencie suas finanças com inteligência'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {isRegistering && (
            <div className="space-y-2 animate-fade-in">
              <label className="text-sm font-semibold text-slate-600 ml-1">Nome Completo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="Seu nome"
                  required={isRegistering}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 ml-1">E-mail</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 ml-1">Senha</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 text-rose-600 text-xs font-medium border border-rose-100 animate-pulse text-center">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-medium border border-emerald-100 animate-fade-in text-center">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </span>
            ) : (
              <>
                {isRegistering ? 'Criar Conta' : 'Acessar Painel'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}
            <button 
              onClick={toggleMode}
              className="ml-1 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors focus:outline-none"
            >
              {isRegistering ? 'Fazer Login' : 'Cadastre-se grátis'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};