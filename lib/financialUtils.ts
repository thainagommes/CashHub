import { Transaction, Category } from './types';

export function calculateTotal(transactions: Transaction[], type: 'income' | 'expense'): number {
  return transactions
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getTransactionsByCategory(transactions: Transaction[], categories: Category[]) {
  const categoryMap = new Map(categories.map(c => [c.id, c.name]));
  const result: { [key: string]: number } = {};

  transactions.forEach(t => {
    const categoryName = categoryMap.get(t.categoryId) || 'Outros';
    result[categoryName] = (result[categoryName] || 0) + t.amount;
  });

  return result;
}

export function getMonthlyData(transactions: Transaction[]) {
  const monthly: { [key: string]: { income: number; expense: number } } = {};

  transactions.forEach(t => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthly[monthKey]) {
      monthly[monthKey] = { income: 0, expense: 0 };
    }

    monthly[monthKey][t.type] += t.amount;
  });

  return Object.entries(monthly).map(([month, data]) => ({
    month,
    income: data.income,
    expense: data.expense,
    balance: data.income - data.expense,
  }));
}

export function getUpcomingBills(transactions: Transaction[]): Transaction[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas o dia

  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return transactions
    .filter(t => t.type === 'expense' && t.dueDate)
    .filter(t => {
      const dueDate = new Date(t.dueDate!);
      dueDate.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas o dia
      return dueDate >= now && dueDate <= nextWeek;
    })
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
}