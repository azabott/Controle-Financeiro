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

export const COLORS = ['#0070F0', '#00B0FF', '#00F0FF', '#0040A0', '#0060C0', '#40C0FF', '#0080E0', '#003080', '#50D0FF', '#0050B0'];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', description: 'Salário Mensal', amount: 5000, type: 'income', category: 'Salário', date: new Date().toISOString().split('T')[0] },
  { id: '2', description: 'Aluguel', amount: 1500, type: 'expense', category: 'Moradia', date: new Date().toISOString().split('T')[0] },
  { id: '3', description: 'Conta de Luz', amount: 180, type: 'expense', category: 'Conta de Luz', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  { id: '4', description: 'Internet Fibra', amount: 100, type: 'expense', category: 'Internet', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  { id: '5', description: 'Supermercado', amount: 600, type: 'expense', category: 'Alimentação', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
];