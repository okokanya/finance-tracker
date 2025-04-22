import { useEffect, useState } from 'react';
import { ModalProps } from '../base/modal';
import Modal from '../base/modal';

type SelectOption = { value: string; label: string };

type Props = ModalProps & {
  transaction: {
    accountName: string | null;
    categoryName: string | null;
    comment: string | null;
    amount: number;
    date: string;
  };
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

  const [day, setDay] = useState<string>(transaction.date.split('-')[2]);
  const [month, setMonth] = useState<string>(months[+transaction.date.split('-')[1] - 1]);
  const [year, setYear] = useState<string>(transaction.date.split('-')[0]);

  useEffect(() => {
    const fetchOptions = async () => {
      const [accountsRes, categoriesRes] = await Promise.all([
        fetch('/api/transactions/transactions-accounts-list'),
        fetch('/api/transactions/transactions-categories-list'),
      ]);

      const accountsData = await accountsRes.json();
      const categoriesData = await categoriesRes.json();

      setAccounts(accountsData.map((a: string) => ({ value: a, label: a })));
      setCategories(categoriesData.map((c: string) => ({ value: c, label: c })));
    };

    if (isOpen) fetchOptions();
  }, [isOpen]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // разрешаем только цифры
    setAmount(value);
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
              {months.map((m, i) => (
                <option key={i} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="w-1/3">
            <label className="text-sm text-gray-500">Год</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              {Array.from({ length: 11 }, (_, i) => 2014 + i).map((y) => (
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
      </div>
    </Modal>
  );
};

export default EditTransactionModal;
