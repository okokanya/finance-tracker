import ActionModal from '@/components/accounts/action-modal/action-modal';
import AddAccountModal from '@/components/accounts/add-account-modal/add-account-modal';
import ManageAccountModal from '@/components/accounts/manage-account-modal/manage-account-modal';
import texts from '@/features/accounts/accounts.texts';
import { useAddAccountController } from '@/features/accounts/controllers/add-account.controller';
import { useManageAccountController } from '@/features/accounts/controllers/manage-account.controller';

const AccountsModals: React.FC = () => {
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
      {isManageAccountModalOpen && accountToManage && (
        <ManageAccountModal
          account={accountToManage}
          isOpen={isManageAccountModalOpen}
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
    </>
  );
};

export default AccountsModals;
