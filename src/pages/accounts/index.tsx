import AccountCard from '@/components/accounts/account-card/account-card';
import AddAccountModal from '@/components/accounts/add-account-modal/add-account-modal';
import ActionModal from '@/components/accounts/action-modal/action-modal';
import TotalBalance from '@/components/accounts/total-balance/total-balance';
import Button from '@/components/button';
import Text from '@/components/text/text';
import Title from '@/components/title/title';
import texts from '@/features/accounts/accounts.texts';
import { useAccountsController } from '@/features/accounts/controllers/accounts.controller';
import { useAddAccountController } from '@/features/accounts/controllers/add-account.controller';

Accounts.title = texts.accounts.title;

export default function Accounts() {
  const { accountsData, isAccountsLoading, accountsError } = useAccountsController();

  const {
    isAddAccountLoading,
    isAddModalOpen,
    setAddModalOpen,
    onAddFormSuccess,
    isRepeatAddModalOpen,
    onRepeatAddFormSuccess,
    onCloseRepeatAddModal,
  } = useAddAccountController();


  const isLoading = isAccountsLoading || isAddAccountLoading;

  if (isLoading) return <span>Загрузка...</span>;

  if (accountsError) return <span>Error: {accountsError.message}</span>;

  return (
    <>
      <section className="mt-10 w-full">
        <div className="flex w-full flex-wrap items-baseline justify-between gap-2">
          <Title variant="h1">{texts.accounts.title}</Title>
          <div className="flex flex-wrap items-baseline gap-2">
            <Text className="mb-0.5 text-gray-500">{texts.accounts.totalAmount}</Text>
            <TotalBalance amount={accountsData?.totalBalance ?? 0} />
          </div>
        </div>
      </section>
      <section className="w-full">
        <Button className="justify-self-start" onClick={() => setAddModalOpen(true)}>
          {texts.accounts.addAccount}
        </Button>
      </section>
      <section className="flex w-full flex-wrap gap-2">
        {accountsData?.accounts.map(account => <AccountCard key={account.id} account={account} />)}
      </section>
      {isAddModalOpen && (
        <AddAccountModal
          isOpen={isAddModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSuccess={onAddFormSuccess}
        />
      )}
      {isRepeatAddModalOpen && (
        <ActionModal
          title={texts.addAccount.repeadAction.title}
          description={texts.addAccount.repeadAction.description}
          isOpen={isRepeatAddModalOpen}
          onClose={onCloseRepeatAddModal}
          onSuccess={onRepeatAddFormSuccess}
        />
      )}
    </>
  );
}
