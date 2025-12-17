import { useLocalStorage } from './useLocalStorage';
import { Category, Transaction, Goal, Alert } from '../lib/types';

export function useCategories() {
  return useLocalStorage<Category[]>('categories', []);
}

export function useTransactions() {
  return useLocalStorage<Transaction[]>('transactions', []);
}

export function useGoals() {
  return useLocalStorage<Goal[]>('goals', []);
}

export function useAlerts() {
  return useLocalStorage<Alert[]>('alerts', []);
}