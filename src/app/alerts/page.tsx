'use client';

import { useState } from 'react';
import Navigation from '../../../components/Navigation';
import { useAlerts, useTransactions } from '../../../hooks/useFinancialData';
import { getUpcomingBills } from '../../../lib/financialUtils';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { AlertCircle, Bell, CheckCircle, Plus, Sparkles } from 'lucide-react';
import AlertModal from '../../../components/AlertModal';
import { Alert } from '../../../lib/types';

export default function AlertsPage() {
  const [alerts, setAlerts] = useAlerts();
  const [transactions] = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const upcomingBills = getUpcomingBills(transactions);

  const handleMarkAsRead = (id: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const handleDeleteAlert = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este alerta?')) {
      setAlerts(alerts.filter(alert => alert.id !== id));
    }
  };

  const handleSaveAlert = (alertData: Omit<Alert, 'id'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: Date.now().toString(),
    };
    setAlerts([...alerts, newAlert]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-yellow-50">
      <Navigation />
      <main className="md:ml-64 pb-20 md:pb-0">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-red-600 bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
                Alertas
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Fique atento às suas contas e notificações</p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Novo Alerta
            </Button>
          </div>

          {/* Contas a Vencer */}
          <Card className="mb-6 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                Contas a Vencer (Próximos 7 dias)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingBills.length > 0 ? (
                <div className="space-y-3">
                  {upcomingBills.map((bill) => (
                    <div key={bill.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl hover:shadow-md transition-all duration-300">
                      <div>
                        <p className="font-semibold text-gray-900">{bill.description}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Vence em: {new Date(bill.dueDate!).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 px-3 py-1">
                        R$ {bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-gray-500">Nenhuma conta próxima do vencimento.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alertas Personalizados */}
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                Alertas Personalizados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length > 0 ? (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:shadow-md transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-500 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">{alert.message}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(alert.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!alert.read && (
                          <Button size="sm" onClick={() => handleMarkAsRead(alert.id)} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleDeleteAlert(alert.id)} className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all">
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-gray-500">Nenhum alerta personalizado.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modal de Alerta */}
      <AlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAlert}
      />
    </div>
  );
}
