import Title from '@/components/base/title';
import texts from '@/features/accounts/accounts.texts';

export default function AccountsEmpty() {
  return (
    <div className="flex h-[calc(100dvh-463px)] w-screen flex-col items-center justify-center md:h-[calc(100dvh-522px)]">
      <Title variant="h3" className="uikit-show-mobile text-center">
        {texts.accounts.empty.title}
      </Title>
      <Title className="uikit-show-desktop text-center">{texts.accounts.empty.title}</Title>
      <p className="mt-4 w-[335px] text-center text-sm text-gray-500 md:mt-5 md:w-[650px] md:text-base">
        {texts.accounts.empty.description}
      </p>
    </div>
  );
}
