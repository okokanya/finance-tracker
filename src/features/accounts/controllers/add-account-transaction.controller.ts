import { OptionType } from '@/components/base/select/option-type';
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

  const onAddAccountTransactionClicked = (
    account: AccountResponse,
    accounts: AccountResponse[]
  ) => {
    const allowedTypes = account.type === 'regular' ? ACCOUNT_TYPES : ['regular'];
    const accountsForTransfer: OptionType<string>[] = [];
    const allAccounts = new Map();

    accounts.forEach(data => {
      allAccounts.set(data.id, data);

      if (data.id !== account.id && allowedTypes.includes(data.type)) {
        accountsForTransfer.push({ title: data.name, value: data.id });
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
  ): boolean => {
    if (!accountToAddTransaction) return false;

    if (type === 'transfer') {
      if (amount > accountToAddTransaction.balance && accountToAddTransaction.type !== 'debt_i_owe')
        return false;

      const targetAccount = allAccountsForTransfer?.get(targetAccountId);
      if (targetAccount && targetAccount.type === 'debt_i_owe' && amount > targetAccount.balance)
        return false;
    }

    if (
      type === 'topup' &&
      accountToAddTransaction.type === 'debt_i_owe' &&
      amount > accountToAddTransaction.balance
    ) {
      return false;
    }

    return true;
  };

  return {
    isAddAccountTransactionLoading,
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
