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
      <section className="mt-5 w-full md:mt-10">
        <div className="flex w-full flex-col flex-wrap items-baseline justify-between gap-4 md:flex-row md:gap-2">
          <Title className="inline md:hidden">{texts.accounts.title}</Title>
          <Title variant="h1" className="hidden md:inline">
            {texts.accounts.title}
          </Title>
          <div className="flex flex-col-reverse flex-wrap items-baseline gap-0.5 md:flex-row md:gap-2">
            <Text variant="sm" className="inline text-gray-500 md:mb-0.5 md:hidden">
              {texts.accounts.totalAmount}
            </Text>
            <Text className="hidden text-gray-500 md:mb-0.5 md:inline">
              {texts.accounts.totalAmount}
            </Text>
            <TotalBalance amount={accountsData?.totalBalance ?? 0} />
          </div>
        </div>
      </section>
      <section className="w-full">
        <Button className="justify-self-start" onClick={() => setAddAccountModalOpen(true)}>
          {texts.accounts.addAccount}
        </Button>
      </section>
      <section className="flex w-full flex-wrap gap-2 pb-7">
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
