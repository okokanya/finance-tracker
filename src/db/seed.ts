import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { db } from './db';
import * as schema from './schema';

const main = async () => {
  try {
    console.log('Seeding database...');

    await db.delete(schema.transactions);
    await db.delete(schema.categories);
    await db.delete(schema.accounts);
    await db.delete(schema.users);

    //#region users
    const user1Id = uuidv4();
    const user2Id = uuidv4();

    await db.insert(schema.users).values([
      {
        id: user1Id,
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@example.com',
        password: await bcrypt.hash('password123', 10),
      },
      {
        id: user2Id,
        firstName: 'Мария',
        lastName: 'Петрова',
        email: 'maria@example.com',
        password: await bcrypt.hash('password123', 10),
        phone: '+7 (999) 999-99-99',
      },
    ]);
    //#endregion

    //#region accounts
    const account1Id = uuidv4();
    const account2Id = uuidv4();
    const account3Id = uuidv4();
    const account4Id = uuidv4();
    const account5Id = uuidv4();

    await db.insert(schema.accounts).values([
      {
        id: account1Id,
        userId: user1Id,
        name: 'Основной счёт',
        type: 'regular',
        balance: 50000,
        isArchived: false,
      },
      {
        id: account2Id,
        userId: user1Id,
        name: 'Сбережения',
        description: 'Накопления на отпуск',
        type: 'savings',
        balance: 150000,
        isArchived: false,
      },
      {
        id: account3Id,
        userId: user1Id,
        name: 'Долг Петра',
        description: 'Одолжил на ремонт',
        type: 'debt_they_owe',
        balance: 25000,
        isArchived: false,
      },
      {
        id: account4Id,
        userId: user1Id,
        name: 'Автокредит',
        type: 'debt_i_owe',
        balance: 2500,
        isArchived: false,
      },
      {
        id: account5Id,
        userId: user1Id,
        name: 'Архивный счет',
        type: 'regular',
        balance: 50000,
        isArchived: true,
      },
    ]);
    //#endregion

    //#region categories
    const category1Id = uuidv4();
    const category2Id = uuidv4();
    const category3Id = uuidv4();
    const category4Id = uuidv4();

    await db.insert(schema.categories).values([
      {
        id: category1Id,
        userId: user1Id,
        name: 'Продукты',
        type: 'expense',
      },
      {
        id: category2Id,
        userId: user1Id,
        name: 'Зарплата',
        type: 'income',
        description: 'Ежемесячный доход',
      },
      {
        id: category3Id,
        userId: user1Id,
        name: 'Транспорт',
        type: 'expense',
        description: 'Проезд и такси',
      },
      {
        id: category4Id,
        userId: user1Id,
        name: 'Подработка',
        type: 'income',
        description: 'Дополнительный доход',
      },
    ]);
    //#endregion

    //#region transactions
    await db.insert(schema.transactions).values([
      {
        id: uuidv4(),
        userId: user1Id,
        accountId: account1Id,
        categoryId: category2Id,
        type: 'topup',
        amount: 3000,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      },
      {
        id: uuidv4(),
        userId: user1Id,
        accountId: account1Id,
        categoryId: category2Id,
        type: 'topup',
        amount: 60000,
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-10'),
      },
      {
        id: uuidv4(),
        userId: user1Id,
        accountId: account1Id,
        categoryId: category1Id,
        type: 'withdrawal',
        amount: 5000,
        comment: 'Покупки в Магните',
        createdAt: new Date('2024-03-11'),
        updatedAt: new Date('2024-03-11'),
      },
      {
        id: uuidv4(),
        userId: user1Id,
        accountId: account1Id,
        targetAccountId: account2Id,
        type: 'transfer',
        amount: 20000,
        comment: 'Перевод в сбережения',
        createdAt: new Date('2024-03-12'),
        updatedAt: new Date('2024-03-12'),
      },
      {
        id: uuidv4(),
        userId: user1Id,
        accountId: account1Id,
        categoryId: category3Id,
        type: 'withdrawal',
        amount: 2000,
        comment: 'Такси',
        createdAt: new Date('2024-03-13'),
        updatedAt: new Date('2024-03-13'),
      },
      {
        id: uuidv4(),
        userId: user1Id,
        accountId: account1Id,
        targetAccountId: account5Id,
        type: 'transfer',
        amount: 50000,
        comment: 'Перевод в архивный счет',
        createdAt: new Date('2025-03-01'),
        updatedAt: new Date('2025-03-01'),
      },
    ]);
    //#endregion
  } catch (error) {
    console.error(error);
    throw new Error('Failed to seed database');
  }
};

main();
