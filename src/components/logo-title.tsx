import logo from '@public/logo.svg';
import Title from '@/components/title/title'
import Image from 'next/image';

const LogoTitle = () => {
return (
  <div className='mb-6 hidden sm:flex  items-center justify-center h-14 whitespace-nowrap'>
    <Image
    src={logo}
    alt="Логотип трекера"
    width={40}
    height={40}
    />
    <Title variant="h2">Finance Tracker</Title>
  </div>
  )
}

export default LogoTitle;
