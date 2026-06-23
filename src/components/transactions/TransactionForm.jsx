import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CATEGORY_LABELS } from '@/lib/constants';

const incomeCategories = ['salary', 'freelance', 'investments', 'gifts', 'other_income'];
const expenseCategories = ['food', 'transport', 'housing', 'utilities', 'entertainment', 'health', 'education', 'clothing', 'subscriptions', 'other_expense'];

export default function TransactionForm({ open, onClose, onSubmit }) {
  const [type, setType] = useState('expense');
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit({
      ...form,
      type,
      amount: parseFloat(form.amount),
    });
    setSaving(false);
    setForm({ title: '', amount: '', category: '', date: new Date().toISOString().split('T')[0], notes: '' });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Новая транзакция</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Tabs value={type} onValueChange={(v) => { setType(v); setForm(f => ({ ...f, category: '' })); }}>
            <TabsList className="w-full">
              <TabsTrigger value="expense" className="flex-1">Расход</TabsTrigger>
              <TabsTrigger value="income" className="flex-1">Доход</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label>Сумма</Label>
            <Input
              type="number"
              placeholder="0"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              className="text-2xl font-bold h-14 text-center"
              required
              min="0.01"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label>Название</Label>
            <Input
              placeholder="Описание транзакции"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Категория</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Дата</Label>
              <Input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Заметка</Label>
            <Textarea
              placeholder="Необязательно"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={saving}>
            {saving ? 'Сохранение...' : 'Добавить'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}