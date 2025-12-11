'use client';

import { useState } from 'react';
import Navigation from '../../../components/Navigation';
import { useTransactions, useCategories } from '../../../hooks/useFinancialData';
import { calculateTotal, getMonthlyData } from '../../../lib/financialUtils';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar, Sparkles, TrendingUp } from 'lucide-react';
import { exportTransactionsToCSV } from '../../../lib/csvExport';

export default function ReportsPage() {
  const [transactions] = useTransactions();
  const [categories] = useCategories();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedCategory, setSelectedCategory] = useState('all');

  const years = Array.from(new Set(transactions.map(t => new Date(t.date).getFullYear()))).sort();

  const filteredTransactions = transactions.filter(t => {
    const year = new Date(t.date).getFullYear().toString();
    const categoryMatch = selectedCategory === 'all' || t.categoryId === selectedCategory;
    return year === selectedYear && categoryMatch;
  });

  const monthlyData = getMonthlyData(filteredTransactions);
  const totalIncome = calculateTotal(filteredTransactions, 'income');
  const totalExpense = calculateTotal(filteredTransactions, 'expense');

  // Dados para gráfico de linha (tendência)
  const trendData = monthlyData.map(month => ({
    ...month,
    balance: month.income - month.expense,
  }));

  // Dados para gráfico de pizza (despesas por categoria)
  const expenseByCategory = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const category = categories.find(c => c.id === t.categoryId);
      const categoryName = category?.name || 'Outros';
      acc[categoryName] = (acc[categoryName] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#f97316'];
  const pieData = Object.entries(expenseByCategory).map(([name, value], index) => ({
    name,
    value,
    fill: COLORS[index % COLORS.length],
  }));

  const handleExport = () => {
    exportTransactionsToCSV(filteredTransactions, categories);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Navigation />
      <main className="md:ml-64 pb-20 md:pb-0">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                Relatórios
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Análise detalhada das suas finanças</p>
            </div>
            <Button onClick={handleExport} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <Download className="w-4 h-4" />
              Exportar Relatório
            </Button>
          </div>

          {/* Filtros */}
          <Card className="mb-6 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Categorias</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <CardHeader>
                <CardTitle className="text-white/90 text-sm">Receitas Totais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold">
                  R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-red-500 to-pink-600 text-white">
              <CardHeader>
                <CardTitle className="text-white/90 text-sm">Despesas Totais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold">
                  R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>
            <Card className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-white ${
              totalIncome - totalExpense >= 0 
                ? 'bg-gradient-to-br from-blue-600 to-indigo-600' 
                : 'bg-gradient-to-br from-orange-600 to-red-600'
            }`}>
              <CardHeader>
                <CardTitle className="text-white/90 text-sm">Saldo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold">
                  R$ {(totalIncome - totalExpense).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Evolução Mensal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                    <Bar dataKey="income" fill="#10b981" name="Receitas" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="expense" fill="#ef4444" name="Despesas" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Tendência de Saldo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Saldo']}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                    <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-pink-600" />
                Despesas por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
