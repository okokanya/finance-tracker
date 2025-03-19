import AccountCard from '@/components/accounts/account-card';
import AccountsModals from '@/components/accounts/accounts-modals';
import TotalBalance from '@/components/accounts/total-balance';
import Button from '@/components/base/button';
import Text from '@/components/base/text';
import Title from '@/components/base/title';
import texts from '@/features/accounts/accounts.texts';
import { useAccountsController } from '@/features/accounts/controllers/accounts.controller';
import { useAddAccountTransactionController } from '@/features/accounts/controllers/add-account-transaction.controller';
import { useAddAccountController } from '@/features/accounts/controllers/add-account.controller';
import { useManageAccountController } from '@/features/accounts/controllers/manage-account.controller';

export default function Accounts() {
  const { accountsData, isAccountsLoading, accountsError } = useAccountsController();
  const { isAddAccountLoading, setAddAccountModalOpen } = useAddAccountController();
  const { isUpdateAccountLoading, onManageAccountClicked } = useManageAccountController();
  const { isAddAccountTransactionLoading, onAddAccountTransactionClicked } =
    useAddAccountTransactionController();

  const isLoading =
    isAccountsLoading ||
    isAddAccountLoading ||
    isUpdateAccountLoading ||
    isAddAccountTransactionLoading;

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
        <Button className="justify-self-start" onClick={() => setAddAccountModalOpen(true)}>
          {texts.accounts.addAccount}
        </Button>
      </section>
      <section className="flex w-full flex-wrap gap-2">
        {accountsData?.accounts.map(account => (
          <AccountCard
            key={account.id}
            account={account}
            onAddTransactionClick={() =>
              onAddAccountTransactionClicked(account, accountsData.accounts)
            }
            onManageClick={() => onManageAccountClicked(account)}
          />
        ))}
      </section>
      <AccountsModals />
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: texts.accounts.title,
    },
  };
}
