import Papa from 'papaparse';
import { Transaction, Category } from './types';

export function exportTransactionsToCSV(transactions: Transaction[], categories: Category[]) {
  const categoryMap = new Map(categories.map(c => [c.id, c.name]));

  const data = transactions.map(t => ({
    Data: new Date(t.date).toLocaleDateString('pt-BR'),
    Tipo: t.type === 'income' ? 'Receita' : 'Despesa',
    Descrição: t.description,
    Categoria: categoryMap.get(t.categoryId) || 'Outros',
    Valor: t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    'Data de Vencimento': t.dueDate ? new Date(t.dueDate).toLocaleDateString('pt-BR') : '',
  }));

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transacoes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}