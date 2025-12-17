'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../../components/Navigation';
import { useTransactions, useCategories, useGoals, useAlerts } from '../../../hooks/useFinancialData';
import { calculateTotal, getMonthlyData, getUpcomingBills } from '../../../lib/financialUtils';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, Target, Download, Sparkles, ArrowUpRight, ArrowDownRight, Calendar, PieChart } from 'lucide-react';
import { exportTransactionsToCSV } from '../../../lib/csvExport';

export default function Dashboard() {
  const [transactions] = useTransactions();
  const [categories] = useCategories();
  const [goals] = useGoals();
  const [alerts] = useAlerts();

  const totalIncome = calculateTotal(transactions, 'income');
  const totalExpense = calculateTotal(transactions, 'expense');
  const balance = totalIncome - totalExpense;

  const monthlyData = getMonthlyData(transactions);
  const upcomingBills = getUpcomingBills(transactions);

  // Calcular estatísticas do mês atual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const monthIncome = calculateTotal(currentMonthTransactions, 'income');
  const monthExpense = calculateTotal(currentMonthTransactions, 'expense');
  const monthBalance = monthIncome - monthExpense;

  // Calcular categoria com mais gastos
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const category = categories.find(c => c.id === t.categoryId);
      const categoryName = category?.name || 'Outros';
      acc[categoryName] = (acc[categoryName] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategory = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0];

  const handleExport = () => {
    exportTransactionsToCSV(transactions, categories);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      <main className="md:ml-64 pb-20 md:pb-0">
        <div className="p-4 sm:p-6">
          {/* Header com gradiente */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Visão geral rápida das suas finanças</p>
            </div>
            <Button 
              onClick={handleExport} 
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
          </div>

          {/* Cards de KPI - Saldo Total Destacado */}
          <div className="mb-6 sm:mb-8">
            <Card className={`border-0 shadow-2xl text-white hover:shadow-3xl transition-all duration-300 ${
              balance >= 0 
                ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600' 
                : 'bg-gradient-to-br from-orange-600 via-red-600 to-pink-600'
            }`}>
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="text-center md:text-left">
                    <p className="text-white/80 text-sm font-medium mb-2">Saldo Total</p>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2">
                      R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </h2>
                    <p className="text-white/90 text-sm">
                      {balance >= 0 ? '✓ Suas finanças estão saudáveis' : '⚠ Atenção: saldo negativo'}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                      <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
                      <p className="text-xs text-white/80 mb-1">Receitas</p>
                      <p className="text-lg sm:text-xl font-bold">R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                      <ArrowDownRight className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
                      <p className="text-xs text-white/80 mb-1">Despesas</p>
                      <p className="text-lg sm:text-xl font-bold">R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cards de Resumo do Mês */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Balanço do Mês</CardTitle>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl sm:text-3xl font-bold ${monthBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {monthBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="text-gray-500">Receitas: R$ {monthIncome.toFixed(2)}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500">Despesas: R$ {monthExpense.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Categoria Top</CardTitle>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <PieChart className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {topCategory ? topCategory[0] : 'N/A'}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {topCategory ? `R$ ${topCategory[1].toLocaleString('pt-BR', { minimumFractionDigits: 2 })} gastos` : 'Sem dados'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Contas Pendentes</CardTitle>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {upcomingBills.length}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {upcomingBills.length > 0 ? 'Contas próximas do vencimento' : 'Nenhuma conta pendente'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Seção de Alertas e Metas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Contas a Vencer */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  Contas a Vencer
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingBills.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingBills.slice(0, 5).map((bill) => (
                      <div key={bill.id} className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 hover:shadow-md transition-all duration-300">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">{bill.description}</p>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Vence em: {new Date(bill.dueDate!).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 px-2 sm:px-3 py-1 text-xs">
                          R$ {bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <AlertCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-gray-500 text-sm">Nenhuma conta próxima do vencimento.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Metas Financeiras */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  Metas Financeiras
                </CardTitle>
              </CardHeader>
              <CardContent>
                {goals.length > 0 ? (
                  <div className="space-y-4">
                    {goals.map((goal) => {
                      const progress = (goal.currentAmount / goal.targetAmount) * 100;
                      return (
                        <div key={goal.id} className="space-y-3 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-900 text-sm sm:text-base">{goal.name}</span>
                            <span className="text-xs sm:text-sm font-medium text-blue-600 bg-blue-100 px-2 sm:px-3 py-1 rounded-full">
                              {progress.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                            <span className="font-medium">R$ {goal.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            <span className="font-medium">R$ {goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-gray-500 text-sm">Nenhuma meta definida.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
