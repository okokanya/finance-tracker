import AccountCard from '@/components/accounts/account-card';
import AccountsEmpty from '@/components/accounts/accounts-empty';
import AccountsError from '@/components/accounts/accounts-error';
import AccountsLoading from '@/components/accounts/accounts-loading';
import AccountsModals from '@/components/accounts/accounts-modals';
import AccountsPageContent from '@/components/accounts/accounts-page-content';
import TotalBalance from '@/components/accounts/total-balance';
import Button from '@/components/base/button';
import texts from '@/features/accounts/accounts.texts';
import { useAccountsController } from '@/features/accounts/controllers/accounts.controller';
import { useAddAccountTransactionController } from '@/features/accounts/controllers/add-account-transaction.controller';
import { useAddAccountController } from '@/features/accounts/controllers/add-account.controller';
import { useManageAccountController } from '@/features/accounts/controllers/manage-account.controller';

export default function Accounts() {
  const { accountsData, isAccountsLoading, isAccountsError, refetchAccounts } =
    useAccountsController();
  const { isAddAccountLoading, setAddAccountModalOpen } = useAddAccountController();
  const { isUpdateAccountLoading, onManageAccountClicked } = useManageAccountController();
  const { isAddAccountTransactionLoading, isTransactionAvailable, onAddAccountTransactionClicked } =
    useAddAccountTransactionController();

  const isLoading =
    isAccountsLoading ||
    isAddAccountLoading ||
    isUpdateAccountLoading ||
    isAddAccountTransactionLoading;

  if (isLoading) return <AccountsPageContent mainContent={<AccountsLoading />} />;

  if (isAccountsError)
    return <AccountsPageContent mainContent={<AccountsError repeatOnError={refetchAccounts} />} />;

  return (
    <>
      <AccountsPageContent
        totalBalance={<TotalBalance amount={accountsData?.totalBalance ?? 0} />}
        addButton={
          <Button className="justify-self-start" onClick={() => setAddAccountModalOpen(true)}>
            {texts.accounts.addAccount}
          </Button>
        }
        mainContent={
          accountsData?.accounts.length === 0 ? (
            <AccountsEmpty />
          ) : (
            accountsData?.accounts.map(account => (
              <AccountCard
                key={account.id}
                account={account}
                isTransactionAvailable={isTransactionAvailable(account, accountsData?.accounts)}
                onAddTransactionClick={() =>
                  onAddAccountTransactionClicked(account, accountsData.accounts)
                }
                onManageClick={() => onManageAccountClicked(account)}
              />
            ))
          )
        }
      />
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
