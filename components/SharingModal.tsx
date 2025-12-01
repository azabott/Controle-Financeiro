import React, { useState, useEffect } from 'react';
import { X, UserPlus, Users, Trash2, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface SharingModalProps {
  currentUser: User;
  onClose: () => void;
}

export const SharingModal: React.FC<SharingModalProps> = ({ currentUser, onClose }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [sharedUsers, setSharedUsers] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Carregar lista de pessoas com quem eu compartilhei
  useEffect(() => {
    const permissions = JSON.parse(localStorage.getItem('finansmart_permissions') || '{}');
    const myShares: string[] = [];
    
    // Procura no objeto de permissões quem aponta para o meu email
    Object.entries(permissions).forEach(([guestEmail, ownerEmail]) => {
      if (ownerEmail === currentUser.email) {
        myShares.push(guestEmail);
      }
    });

    setSharedUsers(myShares);
  }, [currentUser.email]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!inviteEmail) return;
    if (inviteEmail === currentUser.email) {
      setError("Você não pode compartilhar com você mesmo.");
      return;
    }

    // Verificar se o usuário existe no "banco de dados" simulado (opcional, mas bom para UX)
    const allUsers = JSON.parse(localStorage.getItem('finansmart_users') || '[]');
    const userExists = allUsers.find((u: User) => u.email === inviteEmail);
    
    // Nota: Em um app real, enviariamos um email. Aqui, apenas damos permissão direta.
    // Permitimos compartilhar mesmo que o usuário ainda não tenha criado conta (ele terá acesso assim que criar).

    const permissions = JSON.parse(localStorage.getItem('finansmart_permissions') || '{}');
    
    // Regra: Um usuário só pode acessar UMA conta compartilhada por vez nesta simulação simples
    if (permissions[inviteEmail]) {
      setError("Este usuário já faz parte de outra conta família.");
      return;
    }

    // Salvar permissão: inviteEmail TEM ACESSO AOS DADOS DE currentUser.email
    permissions[inviteEmail] = currentUser.email;
    localStorage.setItem('finansmart_permissions', JSON.stringify(permissions));

    setSharedUsers([...sharedUsers, inviteEmail]);
    setInviteEmail('');
    setSuccess(`Acesso concedido a ${inviteEmail}`);
  };

  const handleRemove = (emailToRemove: string) => {
    const permissions = JSON.parse(localStorage.getItem('finansmart_permissions') || '{}');
    delete permissions[emailToRemove];
    localStorage.setItem('finansmart_permissions', JSON.stringify(permissions));
    
    setSharedUsers(sharedUsers.filter(email => email !== emailToRemove));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="bg-indigo-600 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Users size={24} />
            <h2 className="text-xl font-bold">Conta Família</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Compartilhe o acesso aos seus lançamentos financeiros. As pessoas adicionadas poderão visualizar e adicionar novas transações na sua conta.
          </p>

          <form onSubmit={handleInvite} className="mb-6">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
              Adicionar Membro
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="E-mail do familiar"
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                required
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
                title="Adicionar"
              >
                <UserPlus size={20} />
              </button>
            </div>
            {error && <p className="text-rose-500 text-xs mt-2 flex items-center gap-1"><AlertCircle size={12}/> {error}</p>}
            {success && <p className="text-emerald-600 text-xs mt-2">{success}</p>}
          </form>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">
              Membros com Acesso ({sharedUsers.length})
            </label>
            
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {sharedUsers.length === 0 ? (
                <div className="text-center py-4 text-slate-400 bg-slate-50 rounded-lg text-sm border border-slate-100 border-dashed">
                  Você ainda não compartilhou sua conta.
                </div>
              ) : (
                sharedUsers.map(email => (
                  <div key={email} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm hover:border-indigo-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {email.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{email}</span>
                    </div>
                    <button
                      onClick={() => handleRemove(email)}
                      className="text-slate-400 hover:text-rose-500 p-1.5 hover:bg-rose-50 rounded transition-all"
                      title="Remover acesso"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-xs text-slate-500 text-center">
          Os membros convidados precisam fazer login com o e-mail cadastrado.
        </div>
      </div>
    </div>
  );
};