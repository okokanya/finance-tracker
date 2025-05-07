import ProfileLoading from '@/components/profile/profile-loading';
import ProfilePageContent from '@/components/profile/profile-page-content';
import { useProfileController } from '@/features/profile/profile.controller';
import texts from '@/features/profile/profile.texts';

export default function Profile() {
  const { isProfileLoading } = useProfileController();

  if (isProfileLoading) return <ProfileLoading />;

  return <ProfilePageContent />;
}

export async function getServerSideProps() {
  return {
    props: {
      title: texts.title,
    },
  };
}
