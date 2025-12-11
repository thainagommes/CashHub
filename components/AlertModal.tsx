'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert } from '../lib/types';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (alert: Omit<Alert, 'id'>) => void;
}

export default function AlertModal({
  isOpen,
  onClose,
  onSave,
}: AlertModalProps) {
  const [formData, setFormData] = useState({
    message: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        message: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.message.trim()) {
      alert('Por favor, insira uma mensagem para o alerta');
      return;
    }

    onSave({
      message: formData.message,
      date: formData.date,
      read: false,
      type: 'custom',
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Novo Alerta Personalizado
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Mensagem do Alerta *
            </label>
            <Input
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Ex: Lembrete de pagamento do cartão"
              className="border-gray-200 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Data *
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="border-gray-200 focus:border-orange-500"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="hover:bg-gray-100">
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
              Criar Alerta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
