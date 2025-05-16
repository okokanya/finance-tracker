import { OptionType } from '@/components/base/select/option-type';
import { ACCOUNT_LIMITS } from '@/features/accounts/accounts.constants';
import { useAddAccountTransaction } from '@/features/accounts/accounts.queries';
import {
  useAccountsForTransfer,
  useAccountsStoreActions,
  useAccountToAddTransaction,
  useAddAccountTransactionFormData,
  useAllAccountsForTransfer,
  useIsAddAccountTransactionModalOpen,
  useIsAddRepeatAccountTransactionModalOpen,
} from '@/features/accounts/accounts.store';
import texts from '@/features/accounts/accounts.texts';
import {
  AccountResponse,
  AccountTransactionType,
  AddAccountTransactionFormSuccessResult,
  TransactionValidationResult,
} from '@/features/accounts/accounts.types';
import { ACCOUNT_TYPES } from '@/types/enums';

export const useAddAccountTransactionController = () => {
  const {
    setAddAccountTransactionModalOpen,
    setAccountToAddTransaction,
    setAccountsForTransfer,
    setAllAccountsForTransfer,
    setAddAccountTransactionFormData,
    setRepeatAddAccountTransactionModalOpen,
  } = useAccountsStoreActions();

  const isAddAccountTransactionModalOpen = useIsAddAccountTransactionModalOpen();
  const isRepeatAddAccountTransactionModalOpen = useIsAddRepeatAccountTransactionModalOpen();
  const accountToAddTransaction = useAccountToAddTransaction();
  const accountsForTransfer = useAccountsForTransfer();
  const allAccountsForTransfer = useAllAccountsForTransfer();
  const addAccountTransactionFormData = useAddAccountTransactionFormData();
  const { mutate: mutateAddAccountTransaction, isPending: isAddAccountTransactionLoading } =
    useAddAccountTransaction();

  const getAllowedTypes = (account: AccountResponse): readonly string[] => {
    return account.type === 'regular' ? ACCOUNT_TYPES : ['regular'];
  };

  const isOtherAccountAvailableForTransfer = (
    account: AccountResponse,
    accountToTransfer: AccountResponse,
    allowedTypes: readonly string[]
  ): boolean => {
    return accountToTransfer.id !== account.id && allowedTypes.includes(accountToTransfer.type);
  };

  const isTransactionAvailable = (
    account: AccountResponse,
    accounts: AccountResponse[]
  ): boolean => {
    if (accounts.length === 1) {
      return false;
    } else {
      const allowedTypes = getAllowedTypes(account);
      return accounts.some(accountToTransfer =>
        isOtherAccountAvailableForTransfer(account, accountToTransfer, allowedTypes)
      );
    }
  };

  const onAddAccountTransactionClicked = (
    account: AccountResponse,
    accounts: AccountResponse[]
  ) => {
    const allowedTypes = getAllowedTypes(account);
    const accountsForTransfer: OptionType<string>[] = [];
    const allAccounts = new Map();

    accounts.forEach(accountToTransfer => {
      allAccounts.set(accountToTransfer.id, accountToTransfer);

      if (isOtherAccountAvailableForTransfer(account, accountToTransfer, allowedTypes)) {
        accountsForTransfer.push({ title: accountToTransfer.name, value: accountToTransfer.id });
      }
    });

    setAccountsForTransfer(accountsForTransfer);
    setAllAccountsForTransfer(allAccounts);
    setAccountToAddTransaction(account);
    setAddAccountTransactionModalOpen(true);
  };

  const onAddAccountTransaction = (data: AddAccountTransactionFormSuccessResult) => {
    setAddAccountTransactionModalOpen(false);

    if (!accountToAddTransaction) return;

    const transactionData = {
      ...data,
      targetAccountId: isTransferOperation(data.type) ? data.targetAccountId : null,
    };

    mutateAddAccountTransaction(
      { id: accountToAddTransaction.id, ...transactionData },
      {
        onSuccess: () => {
          clearMainData();
          setAddAccountTransactionFormData(null);
        },
        onError: () => {
          setRepeatAddAccountTransactionModalOpen(true);
          setAddAccountTransactionFormData(transactionData);
        },
      }
    );
  };

  const clearMainData = () => {
    setAccountToAddTransaction(null);
    setAccountsForTransfer(null);
    setAllAccountsForTransfer(null);
  };

  const onCloseAddAccountTransactionModal = () => {
    setAddAccountTransactionModalOpen(false);
    clearMainData();
  };

  const onRepeatAddAccountTransaction = () => {
    setRepeatAddAccountTransactionModalOpen(false);

    if (addAccountTransactionFormData) {
      onAddAccountTransaction(addAccountTransactionFormData);
    }
  };

  const onCloseRepeatAddAccountTransactionModal = () => {
    setRepeatAddAccountTransactionModalOpen(false);
    clearMainData();
    setAddAccountTransactionFormData(null);
  };

  const isShowTransactionAmountTitle = (amount: number): boolean => !isNaN(amount);

  const isTransferOperation = (value: AccountTransactionType): boolean => value === 'transfer';

  const submitButtonText = (value: AccountTransactionType): string => {
    return isTransferOperation(value)
      ? texts.accountTransaction.action.transfer
      : texts.accountTransaction.action.replenish;
  };

  const isTransactionValid = (
    type: AccountTransactionType,
    amount: number,
    targetAccountId: string
  ): TransactionValidationResult => {
    if (!accountToAddTransaction) return { isValid: false };

    if (type === 'transfer') {
      if (amount > accountToAddTransaction.balance && accountToAddTransaction.type !== 'debt_i_owe')
        return { isValid: false, error: texts.inputError.insufficientFundsForTransfer };

      const targetAccount = allAccountsForTransfer?.get(targetAccountId);
      if (!targetAccount) return { isValid: false };

      if (targetAccount.type === 'debt_i_owe' && amount > targetAccount.balance)
        return { isValid: false, error: texts.inputError.cannotRepayMoreThanDebt };

      const sourceNewBalance = accountToAddTransaction.balance + amount;
      if (
        accountToAddTransaction.type === 'debt_i_owe' &&
        sourceNewBalance > ACCOUNT_LIMITS.MAX_VALUE
      ) {
        return { isValid: false, error: texts.inputError.cannotRepayMoreThanDebt };
      }

      const targetNewBalance = targetAccount.balance + amount;
      if (targetNewBalance > ACCOUNT_LIMITS.MAX_VALUE)
        return { isValid: false, error: texts.inputError.exceedsMaxBalance };
    }

    if (type === 'topup') {
      if (
        accountToAddTransaction.type === 'debt_i_owe' &&
        amount > accountToAddTransaction.balance
      ) {
        return { isValid: false, error: texts.inputError.cannotRepayMoreThanDebt };
      }

      const newBalance = accountToAddTransaction.balance + amount;
      if (newBalance > ACCOUNT_LIMITS.MAX_VALUE)
        return { isValid: false, error: texts.inputError.exceedsMaxBalance };
    }

    return { isValid: true };
  };

  return {
    isAddAccountTransactionLoading,
    isTransactionAvailable,
    isAddAccountTransactionModalOpen,
    onAddAccountTransactionClicked,
    accountToAddTransaction,
    accountsForTransfer,
    onAddAccountTransaction,
    onCloseAddAccountTransactionModal,
    isRepeatAddAccountTransactionModalOpen,
    onRepeatAddAccountTransaction,
    onCloseRepeatAddAccountTransactionModal,
    isShowTransactionAmountTitle,
    isTransferOperation,
    submitButtonText,
    isTransactionValid,
  };
};
