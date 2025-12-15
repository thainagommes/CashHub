'use client';

import { useState } from 'react';
import Navigation from '../../../components/Navigation';
import { useCategories } from '../../../hooks/useFinancialData';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Settings as SettingsIcon, Plus, Edit, Trash2, Save, Sparkles, Tag } from 'lucide-react';

export default function SettingsPage() {
  const [categories, setCategories] = useCategories();
  const [newCategory, setNewCategory] = useState({ name: '', type: 'expense' as 'income' | 'expense', color: '#3b82f6' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const category = {
        id: Date.now().toString(),
        name: newCategory.name,
        type: newCategory.type,
        color: newCategory.color,
      };
      setCategories([...categories, category]);
      setNewCategory({ name: '', type: 'expense', color: '#3b82f6' });
    }
  };

  const handleEditCategory = (id: string) => {
    setEditingId(id);
  };

  const handleSaveEdit = (id: string, updatedCategory: any) => {
    setCategories(categories.map(cat => cat.id === id ? updatedCategory : cat));
    setEditingId(null);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <Navigation />
      <main className="md:ml-64 pb-20 md:pb-0">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-700 via-slate-700 to-zinc-700 bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
                Configurações
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Personalize seu sistema financeiro</p>
            </div>
          </div>

          {/* Configurações Gerais */}
          <Card className="mb-6 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <SettingsIcon className="w-5 h-5 text-white" />
                </div>
                Configurações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Moeda</label>
                  <Select defaultValue="BRL">
                    <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                      <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Idioma</label>
                  <Select defaultValue="pt-BR">
                    <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gerenciamento de Categorias */}
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                Gerenciar Categorias
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Adicionar Nova Categoria */}
              <div className="mb-6 p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-purple-600" />
                  Adicionar Nova Categoria
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Nome da categoria"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  />
                  <Select value={newCategory.type} onValueChange={(value: any) => setNewCategory({ ...newCategory, type: value })}>
                    <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Receita</SelectItem>
                      <SelectItem value="expense">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="h-10 cursor-pointer"
                  />
                  <Button onClick={handleAddCategory} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </Button>
                </div>
              </div>

              {/* Lista de Categorias */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-4">Categorias Existentes</h3>
                {categories.map((category) => (
                  <div key={category.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-purple-300 transition-all duration-300 bg-gradient-to-r from-white to-gray-50">
                    {editingId === category.id ? (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1 w-full">
                        <Input
                          value={category.name}
                          onChange={(e) => handleSaveEdit(category.id, { ...category, name: e.target.value })}
                          className="border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                        />
                        <Select value={category.type} onValueChange={(value: any) => handleSaveEdit(category.id, { ...category, type: value })}>
                          <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="income">Receita</SelectItem>
                            <SelectItem value="expense">Despesa</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="color"
                          value={category.color}
                          onChange={(e) => handleSaveEdit(category.id, { ...category, color: e.target.value })}
                          className="h-10 cursor-pointer"
                        />
                        <Button size="sm" onClick={() => setEditingId(null)} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                          <Save className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 mb-3 sm:mb-0">
                          <div
                            className="w-6 h-6 rounded-lg shadow-md"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <div>
                            <span className="font-semibold text-gray-900">{category.name}</span>
                            <span className="ml-2 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                              {category.type === 'income' ? 'Receita' : 'Despesa'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditCategory(category.id)} className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteCategory(category.id)} className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
