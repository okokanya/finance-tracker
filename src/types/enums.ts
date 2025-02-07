export const ACCOUNT_TYPES = ['regular', 'savings', 'debt_i_owe', 'debt_they_owe'] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const CATEGORY_TYPES = ['income', 'expense'] as const;
export type CategoryType = (typeof CATEGORY_TYPES)[number];

export const TRANSACTION_TYPES = ['topup', 'withdrawal', 'transfer'] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];
