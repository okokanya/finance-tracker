import { useEffect, useState } from 'react';
import { ModalProps } from '../base/modal';
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
  type?: string; // Добавил опциональное поле type для совместимости
};

type Props = ModalProps & {
  transaction: TransactionData;
  title: string;
  children?: React.ReactNode;
};

const months = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const EditTransactionModal: React.FC<Props> = ({ isOpen, onClose, transaction, title }) => {
  const [accounts, setAccounts] = useState<SelectOption[]>([]);
  const [categories, setCategories] = useState<SelectOption[]>([]);

  const [amount, setAmount] = useState<string>(transaction.amount.toString());
  const [account, setAccount] = useState<string>(transaction.accountName || '');
  const [category, setCategory] = useState<string>(transaction.categoryName || '');
  const [comment, setComment] = useState<string>(transaction.comment || '');

  const [day, setDay] = useState<string>(transaction.date.split('.')[0]);
  const [month, setMonth] = useState<string>(transaction.date.split('.')[1]);
  const [year, setYear] = useState<string>(transaction.date.split('.')[2]);

  useEffect(() => {
    const fetchOptions = async () => {
      const [accountsRes, categoriesRes] = await Promise.all([
        fetch('/api/transactions/transactions-accounts-list'),
        fetch('/api/transactions/transactions-categories-list'),
      ]);

      if (accountsRes.ok) {
        const accountsData = await accountsRes.json();
        setAccounts(accountsData.map((a: string) => ({ value: a, label: a })));
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.map((c: string) => ({ value: c, label: c })));
      }
    };

    if (isOpen) fetchOptions();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && transaction) {
      const [d, m, y] = transaction.date.split('.');
      setYear(y);
      setMonth(m);
      setDay(d);
      setAccount(transaction.accountName || '');
      setCategory(transaction.categoryName || '');
      setAmount(transaction.amount.toString());
      setComment(transaction.comment || '');
    }
  }, [isOpen, transaction]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setAmount(value);
  };

  const handleSave = async () => {
    const newDate = `${day}.${month}.${year}`;

    const payload = {
      id: transaction.id, // Убедимся, что ID передается
      accountName: account,
      categoryName: category,
      amount: Number(amount),
      comment,
      date: newDate,
      type: transaction.type // Добавляем type, если он есть
    };

    const isChanged =
      payload.accountName !== transaction.accountName ||
      payload.categoryName !== transaction.categoryName ||
      payload.amount !== transaction.amount ||
      payload.comment !== transaction.comment ||
      payload.date !== transaction.date;

    if (!isChanged) {
      onClose();
      return;
    }

    try {
      const res = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onClose();
      } else {
        console.error('Ошибка сохранения:', await res.text());
      }
    } catch (error) {
      console.error('Ошибка запроса:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4 mt-4">
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="text-sm text-gray-500">Выберите счёт</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            >
              {accounts.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="w-1/2">
            <label className="text-sm text-gray-500">Категория</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500">Сумма</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            className="w-full border rounded px-2 py-1"
            value={amount}
            onChange={handleAmountChange}
          />
        </div>

        <div className="flex gap-2">
          <div className="w-1/3">
            <label className="text-sm text-gray-500">Число</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              {[...Array(31)].map((_, i) => (
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
            >
              {months.map((m, i) => {
                const value = String(i + 1).padStart(2, '0');
                return (
                  <option key={value} value={value}>
                    {m}
                  </option>
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
            >
              {Array.from({ length: 6 }, (_, i) => 2020 + i).map((y) => (
                <option key={y} value={y.toString()}>
                  {y}
                </option>
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
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} variant="primary">
            Сохранить
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditTransactionModal;
