import { Transaction } from './types';

export const CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Conta de Luz',
  'Água',
  'Internet',
  'Lazer',
  'Saúde',
  'Educação',
  'Salário',
  'Freelance',
  'Investimentos',
  'Outros'
];

export const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6', '#0ea5e9', '#84cc16'];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', description: 'Salário Mensal', amount: 5000, type: 'income', category: 'Salário', date: new Date().toISOString().split('T')[0] },
  { id: '2', description: 'Aluguel', amount: 1500, type: 'expense', category: 'Moradia', date: new Date().toISOString().split('T')[0] },
  { id: '3', description: 'Supermercado', amount: 600, type: 'expense', category: 'Alimentação', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  { id: '4', description: 'Conta de Luz', amount: 180, type: 'expense', category: 'Conta de Luz', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  { id: '5', description: 'Internet Fibra', amount: 100, type: 'expense', category: 'Internet', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
];