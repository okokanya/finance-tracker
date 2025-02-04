import Image from 'next/image';
import Link from 'next/link';
// import { CreditCardIcon, XCircleIcon } from '@heroicons/react@2.2.0/24/outline/ems';
// import { XCircleIcon } from '@heroicons/react/16/solid';
import {
  CreditCardIcon,
  DocumentCurrencyDollarIcon,
  PresentationChartLineIcon,
  Squares2X2Icon,
  UserIcon,
} from '@heroicons/react/24/outline';

const items = [
  {
    link: '',
    text: 'счета',
    icon: 'CreditCardIcon',
    image: '/logo',
    isImage: false,
  },
  {
    link: 'categories',
    text: 'категории',
    icon: 'Squares2X2Icon',
    image: '/logo',
    isImage: false,
  },
  {
    link: 'operations',
    text: 'операции',
    icon: 'DocumentCurrencyDollarIcon',
    image: '/logo',
    isImage: false,
  },
  {
    link: 'reports',
    text: 'отчеты',
    icon: 'PresentationChartLineIcon',
    image: '/logo',
    isImage: false,
  },
  {
    link: 'me',
    text: 'профиль',
    icon: 'UserIcon',
    image: '/avatar.png',
    isImage: true,
  },
];

const iconComponents: Record<string, React.ElementType> = {
  CreditCardIcon,
  Squares2X2Icon,
  DocumentCurrencyDollarIcon,
  PresentationChartLineIcon,
  UserIcon,
};

export function getIconElement(icon: string) {
  const IconComponent = iconComponents[icon];
  return IconComponent ? <IconComponent className="size-4" /> : null;
}

const Header: React.FC = () => {
  return (
    <header className="max-w-[1180px]p-4 order-last mx-auto inline-flex w-full shadow-md md:order-first">
      <div className="container mx-auto flex max-w-[1440px] items-center justify-between max-md:w-full max-md:justify-center">
        {/* Логотип */}
        <Link href="/" className="hidden md:inline">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} className="cursor-pointer" />
        </Link>
        {/* Навигация */}
        <nav>
          <ul className="flex flex-nowrap max-md:w-full">
            {items.map((item, index) => (
              <li key={index}>
                <Link
                  href={`/${item.link}`}
                  className="flex items-center space-x-2 rounded-lg p-2 hover:bg-gray-100"
                >
                  {item.isImage ? (
                    <Image
                      src={item.image}
                      alt={item.text}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <>
                      {getIconElement(item.icon)}
                      <span className="hidden md:inline">{item.text}</span>
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
