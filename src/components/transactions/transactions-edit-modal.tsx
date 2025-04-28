import { useEffect, useState } from 'react';
import Modal from '../base/modal';
import Button from '../base/button';

type SelectOption = { value: string; label: string };

type TransactionData = {
  id: string;
  accountName: string | null;
  categoryName: string | null;
  comment: string | null;
  amount: number;
  date: string;
  type?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: (transaction: TransactionData) => Promise<void>;
  onDeleteSuccess?: () => void;
  onDuplicateSuccess?: () => Promise<void>;
  transaction: TransactionData;
  title: string;
};

const months = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export default function EditTransactionModal({
  isOpen,
  onClose,
  onSaveSuccess,
  onDeleteSuccess,
  onDuplicateSuccess,
  transaction,
  title
}: Props) {
  const [accounts, setAccounts] = useState<SelectOption[]>([]);
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [account, setAccount] = useState(transaction.accountName || '');
  const [category, setCategory] = useState(transaction.categoryName || '');
  const [comment, setComment] = useState(transaction.comment || '');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  // Инициализация даты
  useEffect(() => {
    if (transaction.date) {
      let dayPart = '';
      let monthPart = '';
      let yearPart = '';

      if (transaction.date.includes('.')) {
        [dayPart, monthPart, yearPart] = transaction.date.split('.');
      } else if (transaction.date.includes('-')) {
        [yearPart, monthPart, dayPart] = transaction.date.split('-');
      }

      setDay(dayPart || '01');
      setMonth(monthPart || '01');
      setYear(yearPart || new Date().getFullYear().toString());
    }
  }, [transaction.date]);

  // Загрузка счетов и категорий
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [accountsRes, categoriesRes] = await Promise.all([
          fetch('/api/transactions/transactions-accounts-list'),
          fetch('/api/transactions/transactions-categories-list'),
        ]);

        const accountsData = await accountsRes.json();
        const categoriesData = await categoriesRes.json();

        setAccounts(accountsData.map((a: string) => ({ value: a, label: a })));
        setCategories(categoriesData.map((c: string) => ({ value: c, label: c })));
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    if (isOpen) fetchOptions();
  }, [isOpen]);

  const handleSave = async () => {
    if (!day || !month || !year) return;

    setIsSaving(true);
    try {
      const newDate = `${day}.${month}.${year}`;
      const payload = {
        accountName: account,
        categoryName: category,
        amount: Number(amount),
        comment,
        date: newDate,
        type: transaction.type
      };

      const res = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      const { transaction: updatedTransaction } = await res.json();
      await onSaveSuccess(updatedTransaction);
      onClose();
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить эту операцию?')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error(await res.text());

      if (onDeleteSuccess) await onDeleteSuccess();
      onClose();
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopy = async () => {
    setIsDuplicating(true);
    try {
      const res = await fetch(`/api/transactions/${transaction.id}/duplicate`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error(await res.text());

      if (onDuplicateSuccess) await onDuplicateSuccess();
      onClose();
    } catch (error) {
      console.error('Duplicate error:', error);
    } finally {
      setIsDuplicating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4 mt-4">
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="text-sm text-gray-500">Счёт</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              disabled={isSaving || isDeleting || isDuplicating}
            >
              <option value="">Выберите счёт</option>
              {accounts.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="w-1/2">
            <label className="text-sm text-gray-500">Категория</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSaving || isDeleting || isDuplicating}
            >
              <option value="">Выберите категорию</option>
              {categories.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500">Сумма</label>
          <input
            type="text"
            inputMode="numeric"
            className="w-full border rounded px-2 py-1"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
            disabled={isSaving || isDeleting || isDuplicating}
          />
        </div>

        <div className="flex gap-2">
          <div className="w-1/3">
            <label className="text-sm text-gray-500">День</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              disabled={isSaving || isDeleting || isDuplicating}
            >
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i} value={String(i + 1).padStart(2, '0')}>
                  {String(i + 1).padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>

          <div className="w-1/3">
            <label className="text-sm text-gray-500">Месяц</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              disabled={isSaving || isDeleting || isDuplicating}
            >
              {months.map((m, i) => {
                const value = String(i + 1).padStart(2, '0');
                return (
                  <option key={value} value={value}>{m}</option>
                );
              })}
            </select>
          </div>

          <div className="w-1/3">
            <label className="text-sm text-gray-500">Год</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={isSaving || isDeleting || isDuplicating}
            >
              {Array.from({ length: 6 }, (_, i) => 2020 + i).map((y) => (
                <option key={y} value={y.toString()}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500">Комментарий</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSaving || isDeleting || isDuplicating}
          />
        </div>

        <div className="flex justify-between items-center flex-wrap">
          <div className="flex gap-5 w-full mb-5">
            <Button
              onClick={handleSave}
              variant="primary"
              disabled={isSaving || isDeleting || isDuplicating}
              className='w-[70%]'
            >
              {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>

            <Button
              onClick={onClose}
              variant="secondary"
              disabled={isSaving || isDeleting || isDuplicating}
              className='w-[30%]'
            >
              Отмена
            </Button>
          </div>

          <div className="flex gap-5 w-full mb-5">
            <Button
              onClick={handleDelete}
              variant="error"
              disabled={isSaving || isDeleting || isDuplicating}
              className="text-red-500 hover:text-red-700 w-[50%]"
            >
              {isDeleting ? 'Удаление...' : 'Удалить операцию'}
            </Button>

            <Button
              onClick={handleCopy}
              variant="secondary"
              disabled={isSaving || isDeleting || isDuplicating}
              className='w-[50%]'
            >
              {isDuplicating ? 'Дублирование...' : 'Дублировать'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
