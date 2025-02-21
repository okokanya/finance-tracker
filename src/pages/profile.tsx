import { db } from '@/db/db';
import { users } from '@/db/schema';
import MainWrap from '@/components/mainWrap';
import { profile } from 'console';

Profile.title = "Профиль"

export default function Profile() {
  return (
    <MainWrap>
      <h1>Профиль</h1>
    </MainWrap>
  );
}
