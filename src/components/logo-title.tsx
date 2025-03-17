import Image from 'next/image';
import logo from '@public/logo.svg';

import Title from '@/components/base/title';

const LogoTitle = () => {
  return (
    <div className="mb-6 hidden h-14 items-center justify-center whitespace-nowrap sm:flex">
      <Image src={logo} alt="Логотип трекера" width={40} height={40} />
      <Title variant="h2">Finance Tracker</Title>
    </div>
  );
};

export default LogoTitle;
