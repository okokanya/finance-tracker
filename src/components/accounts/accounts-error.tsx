import Button from '@/components/base/button';
import Title from '@/components/base/title';
import texts from '@/features/accounts/accounts.texts';

type Props = {
  repeatOnError: () => void;
};

export default function AccountsError({ repeatOnError }: Props) {
  return (
    <div className="flex h-[calc(100dvh-200px)] w-screen flex-col items-center justify-center md:h-[calc(100dvh-350px)]">
      <Title variant="h3" className="uikit-show-mobile text-center">
        {texts.accounts.repeatAction.title}
      </Title>
      <Title className="uikit-show-desktop text-center">{texts.accounts.repeatAction.title}</Title>
      <p className="mt-4 text-center text-sm text-gray-500 md:mt-5 md:text-base">
        {texts.accounts.repeatAction.description}
      </p>
      <Button onClick={repeatOnError} className="mt-5 md:mt-6">
        {texts.repeat}
      </Button>
    </div>
  );
}
