import Spinner from '@/components/base/spinner';
import MainWrap from '@/components/main-wrap';
import texts from '@/features/profile/profile.texts';

export default function ProfileLoading() {
  return (
    <MainWrap wrapperClassName="h-[calc(100vh-49px)] md:h-[calc(100vh-73px)]">
      <Spinner className="size-8 md:size-9" />
      <p className="mt-4 text-center text-sm text-gray-500 md:mt-5 md:text-base">{texts.loading}</p>
    </MainWrap>
  );
}
