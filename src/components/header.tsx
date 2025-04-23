import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CreditCardIcon,
  DocumentCurrencyDollarIcon,
  PresentationChartLineIcon,
  Squares2X2Icon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

import { useProfileController } from '@/features/profile/profile.controller';
import texts from '@/features/profile/profile.texts';
import { cn } from '@/utils/cn';

const mainMenu = {
  items: [
    {
      link: 'accounts',
      text: 'Счета',
      icon: CreditCardIcon,
    },
    {
      link: 'categories',
      text: 'Категории',
      icon: Squares2X2Icon,
    },
    {
      link: 'operations',
      text: 'Операции',
      icon: DocumentCurrencyDollarIcon,
    },
    {
      link: 'reports',
      text: 'Отчеты',
      icon: PresentationChartLineIcon,
    },
  ],
  defaultProfile: {
    link: 'profile',
    text: 'Профиль',
    icon: UserCircleIcon,
  },
};

export default function Header() {
  const { avatarUrl } = useProfileController();
  const pathname = usePathname();

  const linkClassNames = (link: string): string => {
    return cn('text-gray-800 hover:text-blue-600', {
      ['text-blue-700']: pathname?.includes(link),
    });
  };

  const avatarConteinerClassNames = (): string => {
    return cn('size-8 rounded-full md:size-10 hover:ring-2 hover:ring-blue-600', {
      ['ring-2 ring-blue-700']: pathname?.includes(mainMenu.defaultProfile.link),
    });
  };

  return (
    <header className="order-last mx-auto inline-flex w-full min-w-[375px] border-t-[1px] border-t-gray-300 bg-white px-6 py-2 md:order-first md:border-b-[1px] md:border-t-0 md:border-b-gray-300 md:py-4">
      <div className="container mx-auto flex max-w-[1340px] items-center justify-between max-md:w-full max-md:justify-center">
        {/* Логотип */}
        <Link href="/accounts" className="uikit-show-desktop">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} className="cursor-pointer" />
        </Link>
        {/* Навигация */}
        <nav>
          <ul className="flex flex-nowrap items-center gap-8 max-md:w-full">
            {mainMenu.items.map((item, index) => (
              <li key={index}>
                <Link
                  href={`/${item.link}`}
                  className={cn('flex items-center space-x-1', linkClassNames(item.link))}
                >
                  <item.icon className="size-8" />
                  <p className="uikit-show-desktop">{item.text}</p>
                </Link>
              </li>
            ))}
            <li key={50}>
              <Link
                href={`/${mainMenu.defaultProfile.link}`}
                className={linkClassNames(mainMenu.defaultProfile.link)}
              >
                {avatarUrl ? (
                  <div className={avatarConteinerClassNames()}>
                    <Image
                      src={avatarUrl}
                      alt={texts.profileAvatar}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <mainMenu.defaultProfile.icon className="size-8 rounded-full md:size-10" />
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
