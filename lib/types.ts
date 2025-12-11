export interface Category {
  id: string;
  name: string;
  color: string;
  type: 'income' | 'expense';
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  date: string; // ISO string
  type: 'income' | 'expense';
  isRecurring?: boolean;
  dueDate?: string; // for bills
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface Alert {
  id: string;
  type?: 'bill' | 'goal' | 'custom';
  message: string;
  date: string;
  read?: boolean;
}