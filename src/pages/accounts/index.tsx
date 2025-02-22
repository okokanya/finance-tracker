import AccountCard from '@/components/accounts/account-card/account-card';
import TotalBalance from '@/components/accounts/total-balance/total-balance';
import Button from '@/components/button';
import Modal from '@/components/modal/modal';
import Text from '@/components/text/text';
import Title from '@/components/title/title';
import { useAccountsController } from '@/features/accounts/accounts.controller';

Accounts.title = 'Счета';

export default function Accounts() {
  const { accountsData, isLoading, error, isAddModalOpen, setAddModalOpen } =
    useAccountsController();

  if (isLoading) return <span>Загрузка...</span>;

  if (error) return <span>Error: {error.message}</span>;

  return (
    <>
      <section className="mt-10 w-full">
        <div className="flex w-full flex-wrap items-baseline justify-between gap-2">
          <Title variant="h1">Счета</Title>
          <div className="flex flex-wrap items-baseline gap-2">
            <Text className="mb-0.5 text-gray-500">Общая сумма всех счетов</Text>
            <TotalBalance amount={accountsData?.totalBalance ?? 0} />
          </div>
        </div>
      </section>
      <section className="w-full">
        <Button className="justify-self-start" onClick={() => setAddModalOpen(true)}>
          Добавить счет
        </Button>
      </section>
      <section className="flex w-full flex-wrap gap-2">
        {accountsData?.accounts.map(account => <AccountCard key={account.id} account={account} />)}
      </section>
      {isAddModalOpen && (
        <Modal title="title" isOpen={true} onClose={() => setAddModalOpen(false)}>
          <p>Test</p>
        </Modal>
      )}
    </>
  );
}
