import LogoutButton from '@/components/LogoutButton';
import MainWrap from '@/components/mainWrap';

Profile.title = 'Профиль';

export default function Profile() {
  return (
    <MainWrap>
      <h1>Профиль</h1>
      <LogoutButton />
    </MainWrap>
  );
}
