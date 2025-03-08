import { sql } from 'drizzle-orm';
import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';

import { ACCOUNT_TYPES, CATEGORY_TYPES, TRANSACTION_TYPES } from '@/types/enums';

const timestamps = {
  createdAt: integer('createdAt', { mode: 'timestamp' })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull()
    .$onUpdateFn(() => new Date()),
};

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(uuid),
  firstName: text('firstName', { length: 30 }).notNull(),
  lastName: text('lastName', { length: 30 }).notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: text('phone'),
  avatar: blob('avatar', { mode: 'buffer' }),
  ...timestamps,
});

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey().$defaultFn(uuid),
  userId: text('userId')
    .notNull()
    .references(() => users.id),
  name: text('name', { length: 30 }).notNull(),
  description: text('description', { length: 200 }),
  type: text('type', { enum: ACCOUNT_TYPES }).notNull(),
  balance: integer('balance', { mode: 'number' }).notNull().default(0),
  isArchived: integer('isArchived', { mode: 'boolean' }).notNull(),
  ...timestamps,
});

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey().$defaultFn(uuid),
  userId: text('userId')
    .notNull()
    .references(() => users.id),
  name: text('name', { length: 30 }).notNull(),
  description: text('description', { length: 200 }),
  type: text('type', { enum: CATEGORY_TYPES }).notNull(),
  ...timestamps,
});

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey().$defaultFn(uuid),
  userId: text('userId')
    .notNull()
    .references(() => users.id),
  accountId: text('accountId')
    .notNull()
    .references(() => accounts.id),
  categoryId: text('categoryId').references(() => categories.id),
  targetAccountId: text('targetAccountId').references(() => accounts.id),
  type: text('type', { enum: TRANSACTION_TYPES }).notNull(),
  amount: integer('amount', { mode: 'number' }).notNull(),
  comment: text('comment', { length: 200 }),
  ...timestamps,
});
