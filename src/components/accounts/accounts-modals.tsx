import ActionModal from '@/components/accounts/action-modal';
import AddAccountModal from '@/components/accounts/add-account-modal';
import AddAccountTransactionModal from '@/components/accounts/add-account-transaction-modal';
import ManageAccountModal from '@/components/accounts/manage-account-modal/manage-account-modal';
import texts from '@/features/accounts/accounts.texts';
import { useAddAccountTransactionController } from '@/features/accounts/controllers/add-account-transaction.controller';
import { useAddAccountController } from '@/features/accounts/controllers/add-account.controller';
import { useManageAccountController } from '@/features/accounts/controllers/manage-account.controller';

export default function AccountsModals() {
  const {
    isAddAccountModalOpen,
    setAddAccountModalOpen,
    onAddAccount,
    isRepeatAddAccountModalOpen,
    onRepeatAddAccount,
    onCloseRepeatAddAccountModal,
  } = useAddAccountController();

  const {
    isManageAccountModalOpen,
    hasAccountDataChanged,
    accountToManage,
    onUpdateAccount,
    onCloseManageAccountModal,
    onDeleteAccount,
    onArchiveAccount,
    isRepeatUpdateAccountModalOpen,
    onRepeatUpdateAccount,
    onCloseRepeatUpdateAccountModal,
    isRepeatDeleteAccountModalOpen,
    onRepeatDeleteAccount,
    onCloseRepeatDeleteAccountModal,
    isRepeatArchiveAccountModalOpen,
    onRepeatArchiveAccount,
    onCloseRepeatArchiveAccountModal,
  } = useManageAccountController();

  const {
    isAddAccountTransactionModalOpen,
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
  } = useAddAccountTransactionController();

  const isShowManageAccountModal = isManageAccountModalOpen && accountToManage;

  const isShowAddAccountTransactionModal =
    isAddAccountTransactionModalOpen && accountToAddTransaction && accountsForTransfer;

  return (
    <>
      {isAddAccountModalOpen && (
        <AddAccountModal
          isOpen={isAddAccountModalOpen}
          onClose={() => setAddAccountModalOpen(false)}
          onSuccess={onAddAccount}
        />
      )}
      {isRepeatAddAccountModalOpen && (
        <ActionModal
          title={texts.addAccount.repeatAction.title}
          description={texts.addAccount.repeatAction.description}
          isOpen={isRepeatAddAccountModalOpen}
          onClose={onCloseRepeatAddAccountModal}
          onSuccess={onRepeatAddAccount}
        />
      )}
      {isShowManageAccountModal && (
        <ManageAccountModal
          account={accountToManage}
          isOpen={isManageAccountModalOpen}
          hasAccountDataChanged={hasAccountDataChanged}
          onClose={onCloseManageAccountModal}
          onUpdate={onUpdateAccount}
          onDelete={onDeleteAccount}
          onArchive={onArchiveAccount}
        />
      )}
      {isRepeatUpdateAccountModalOpen && (
        <ActionModal
          title={texts.manageAccount.repeatUpdateAction.title}
          description={texts.manageAccount.repeatUpdateAction.description}
          isOpen={isRepeatUpdateAccountModalOpen}
          onClose={onCloseRepeatUpdateAccountModal}
          onSuccess={onRepeatUpdateAccount}
        />
      )}
      {isRepeatDeleteAccountModalOpen && (
        <ActionModal
          title={texts.manageAccount.repeatDeleteAction.title}
          description={texts.manageAccount.repeatDeleteAction.description}
          isOpen={isRepeatDeleteAccountModalOpen}
          onClose={onCloseRepeatDeleteAccountModal}
          onSuccess={onRepeatDeleteAccount}
        />
      )}
      {isRepeatArchiveAccountModalOpen && (
        <ActionModal
          title={texts.manageAccount.repeatArchiveAction.title}
          description={texts.manageAccount.repeatArchiveAction.description}
          isOpen={isRepeatArchiveAccountModalOpen}
          onClose={onCloseRepeatArchiveAccountModal}
          onSuccess={onRepeatArchiveAccount}
        />
      )}
      {isShowAddAccountTransactionModal && (
        <AddAccountTransactionModal
          account={accountToAddTransaction}
          accounts={accountsForTransfer}
          isShowTransactionAmountTitle={isShowTransactionAmountTitle}
          isTransferOperation={isTransferOperation}
          submitButtonText={submitButtonText}
          isTransactionValid={isTransactionValid}
          isOpen={isAddAccountTransactionModalOpen}
          onClose={onCloseAddAccountTransactionModal}
          onSuccess={onAddAccountTransaction}
        />
      )}
      {isRepeatAddAccountTransactionModalOpen && (
        <ActionModal
          title={texts.accountTransaction.repeatAction.title}
          description={texts.accountTransaction.repeatAction.description}
          isOpen={isRepeatAddAccountTransactionModalOpen}
          onClose={onCloseRepeatAddAccountTransactionModal}
          onSuccess={onRepeatAddAccountTransaction}
        />
      )}
    </>
  );
}
