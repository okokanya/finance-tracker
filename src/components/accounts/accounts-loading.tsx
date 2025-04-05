import Spinner from '@/components/base/spinner';
import texts from '@/features/accounts/accounts.texts';

export default function AccountsLoading() {
  return (
    <div className="flex h-[calc(100dvh-267px)] w-screen flex-col items-center justify-center md:h-[calc(100dvh-421px)]">
      <Spinner className="size-8 md:size-9" />
      <p className="mt-4 text-center text-sm text-gray-500 md:mt-5 md:text-base">
        {texts.accounts.loading}
      </p>
    </div>
  );
}
