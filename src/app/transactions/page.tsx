'use client';

import { useState } from 'react';
import Navigation from '../../../components/Navigation';
import { useTransactions, useCategories } from '../../../hooks/useFinancialData';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Search, Filter, Plus, Edit, Trash2, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useTransactions();
  const [categories] = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory = filterCategory === 'all' || transaction.categoryId === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterCategory('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <Navigation />
      <main className="md:ml-64 pb-20 md:pb-0">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                Transações
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Gerencie todas as suas movimentações financeiras</p>
            </div>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="w-4 h-4" />
              Nova Transação
            </Button>
          </div>

          {/* Filtros */}
          <Card className="mb-6 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Buscar transações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  />
                </div>
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger className="border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="income">Receitas</SelectItem>
                    <SelectItem value="expense">Despesas</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleClearFilters} className="flex items-center gap-2 hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-all">
                  <Filter className="w-4 h-4" />
                  Limpar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Transações */}
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Histórico de Transações
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                  {filteredTransactions.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length > 0 ? (
                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => {
                    const category = categories.find(c => c.id === transaction.categoryId);
                    return (
                      <div key={transaction.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-green-300 transition-all duration-300 bg-gradient-to-r from-white to-gray-50">
                        <div className="flex items-center gap-4 mb-3 sm:mb-0">
                          <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {transaction.type === 'income' ? (
                              <ArrowUpRight className="w-5 h-5 text-green-600" />
                            ) : (
                              <ArrowDownRight className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-gray-600">
                              {category?.name} • {new Date(transaction.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          <Badge className={`${
                            transaction.type === 'income' 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                              : 'bg-gradient-to-r from-red-500 to-pink-600'
                          } text-white border-0 px-3 py-1`}>
                            {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </Badge>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteTransaction(transaction.id)} className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">Nenhuma transação encontrada.</p>
                  <p className="text-gray-400 text-sm mt-2">Tente ajustar os filtros ou adicione uma nova transação.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
