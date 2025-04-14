import React from 'react';

import Title from '@/components/base/title';
import texts from '@/features/accounts/accounts.texts';

type Props = {
  totalBalance?: React.ReactNode;
  addButton?: React.ReactNode;
  mainContent: React.ReactNode;
};

export default function AccountsPageContent({ totalBalance, addButton, mainContent }: Props) {
  return (
    <>
      <section className="mt-5 w-full md:mt-10">
        <div className="flex w-full flex-col flex-wrap items-baseline justify-between gap-4 md:h-9 md:flex-row md:gap-2">
          <Title className="uikit-show-mobile self-start">{texts.accounts.title}</Title>
          <Title variant="h1" className="uikit-show-desktop self-start">
            {texts.accounts.title}
          </Title>
          {totalBalance && (
            <div className="flex flex-col-reverse flex-wrap items-baseline gap-0.5 md:flex-row md:gap-2">
              <p className="text-sm text-gray-500 md:mb-0.5 md:self-end md:text-base">
                {texts.accounts.totalBalance}
              </p>
              {totalBalance}
            </div>
          )}
        </div>
      </section>
      {addButton && <section className="w-full">{addButton}</section>}
      <section className="flex w-full flex-wrap gap-2 pb-7">{mainContent}</section>
    </>
  );
}
