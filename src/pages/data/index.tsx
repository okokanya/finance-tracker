import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

import { AccountsResponse } from '@/features/accounts/accounts.types';
import { Category, Transaction, User } from '@/models';

export default function Data() {
  const { data: users, isPending: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      return res.json();
    },
  });

  const { data: accountsData, isPending: isLoadingAccounts } = useQuery<AccountsResponse>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const res = await fetch('/api/accounts');
      return res.json();
    },
  });

  const { data: transactions, isPending: isLoadingTransactions } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await fetch('/api/transactions');
      return res.json();
    },
  });

  const { data: categories, isPending: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch(`/api/categories?userId=${users ? users[0].id : '1'}`);
      const data = await res.json();
      return data.data;
    },
    enabled: !!users,
  });

  const isLoading =
    isLoadingUsers || isLoadingAccounts || isLoadingTransactions || isLoadingCategories;

  return (
    <div className="flex min-h-screen flex-col items-center justify-between">
      <main className="container mx-auto p-4">
        {isLoading ? (
          <p className="text-yellow-400">загрузка...</p>
        ) : (
          <div className="space-y-8">
            {/* Users Section */}
            <section>
              <h2 className="mb-4 text-2xl font-bold">Пользователи</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {users?.map(user => (
                  <div key={user.id} className="rounded-lg bg-white p-4 shadow">
                    <div className="flex items-center gap-4">
                      {user.avatar && (
                        <div className="h-12 w-12 overflow-hidden rounded-full">
                          <Image
                            src={`/api/users/avatar?userId=${user.id}`}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        {user.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Accounts Section */}
            <section>
              <h2 className="mb-4 text-2xl font-bold">{`Счета. Сумма: ${accountsData?.totalBalance}`}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {accountsData?.accounts.map(account => (
                  <div key={account.id} className="rounded-lg bg-white p-4 shadow">
                    <h3 className="font-bold">{account.name}</h3>
                    <p className="text-2xl font-bold">{account.balance} ₽</p>
                    <p className="text-sm text-gray-500">{account.description ?? 'Нет описания'}</p>
                    <p className="text-sm text-gray-500">{account.type}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Transactions Section */}
            <section>
              <h2 className="mb-4 text-2xl font-bold">Последние транзакции</h2>
              <div className="space-y-2">
                {transactions?.slice(0, 5).map(transaction => (
                  <div key={transaction.id} className="rounded-lg bg-white p-4 shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">{transaction.comment ?? 'Нет комментария'}</p>
                        <p className="text-sm text-gray-500">{transaction.type}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <p
                        className={`text-lg font-bold ${
                          transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {transaction.amount} ₽
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Categories Section */}
            <section>
              <h2 className="mb-4 text-2xl font-bold">Категории</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {categories?.map(category => (
                  <div key={category.id} className="rounded-lg bg-white p-4 shadow">
                    <p className="font-bold">{category.name}</p>
                    <p className="text-sm text-gray-500">
                      {category.description ?? 'Нет описания'}
                    </p>
                    <p className="text-sm text-gray-500">{category.type}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
