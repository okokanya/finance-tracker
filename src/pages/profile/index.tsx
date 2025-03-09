import LogoutButton from '@/components/logout-button';
import MainWrap from '@/components/mainWrap';

export default function Profile() {
  return (
    <MainWrap>
      <h1>Профиль</h1>
      <LogoutButton />
    </MainWrap>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: 'Профиль',
    },
  };
}
