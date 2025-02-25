import MainWrap from '@/components/mainWrap';
import LogoutButton from '@/components/LogoutButton';

Profile.title = "Профиль"

export default function Profile() {
  return (
    <MainWrap>
      <h1>Профиль</h1>
      <LogoutButton/>
    </MainWrap>
  );
}
