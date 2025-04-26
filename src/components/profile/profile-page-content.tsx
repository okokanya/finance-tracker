import Image from 'next/image';
import { Button as HeadlessButton, Input as HeadlessInput } from '@headlessui/react';
import { ArrowLongLeftIcon, CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Button from '@/components/base/button';
import Input from '@/components/base/input';
import Title from '@/components/base/title';
import MainWrap from '@/components/main-wrap';
import { useProfileController } from '@/features/profile/profile.controller';
import texts from '@/features/profile/profile.texts';
import { profileFormSchema, type ProfileFormSuccessResult } from '@/features/profile/profile.types';
import { cn } from '@/utils/cn';

export default function ProfilePageContent() {
  const {
    profileData,
    avatarUrl,
    onLogout,
    onBackClicked,
    onUpdateAvatarClicked,
    onDeleteAvatarClicked,
    hasProfileFormChanges,
    onUpdatePrifileData,
  } = useProfileController();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProfileFormSuccessResult>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: profileData?.firstName || '',
      lastName: profileData?.lastName || '',
      email: profileData?.email || '',
      phone: profileData?.phone || '',
      currentPassword: '',
      newPassword: '',
      repeatNewPassword: '',
    },
  });

  const formValues = watch();
  const hasChanges = hasProfileFormChanges(formValues);

  const onSubmit = (data: ProfileFormSuccessResult) => {
    onUpdatePrifileData(data);
    reset({
      currentPassword: '',
      newPassword: '',
      repeatNewPassword: '',
    });
  };

  return (
    <MainWrap
      wrapperClassName="h-[calc(100vh-49px)] md:h-[calc(100vh-73px)]"
      className="justify-start"
    >
      <section className="w-full px-5 py-5 md:w-[768px] md:px-6 md:py-8">
        <div className="flex w-full flex-row items-start justify-start gap-2 self-stretch">
          <HeadlessButton
            className={cn(
              'flex h-7 w-7 flex-col items-center justify-center text-gray-500 hover:text-gray-800 focus:outline-none md:h-8',
              'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gray-800'
            )}
            onClick={onBackClicked}
          >
            <ArrowLongLeftIcon className="size-7" />
          </HeadlessButton>
          <Title variant="h3" className="uikit-show-mobile">
            {texts.settings}
          </Title>
          <Title className="uikit-show-desktop">{texts.settings}</Title>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex w-full flex-col items-center gap-2 rounded-[12px] bg-transparent md:mt-5 md:items-start md:bg-white md:px-6 md:py-8"
        >
          <div className="relative">
            <div
              className={cn(
                'flex size-[92px] items-center justify-center rounded-full bg-white md:size-[124px]',
                { ['border border-gray-400 md:border-2']: !avatarUrl }
              )}
            >
              {avatarUrl ? (
                <div className="group relative size-full">
                  <Image
                    src={avatarUrl}
                    alt={texts.profileAvatar}
                    width={92}
                    height={92}
                    className="size-full rounded-full object-cover"
                  />
                  <HeadlessButton
                    onClick={onDeleteAvatarClicked}
                    title={texts.deleteAvatar}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <XMarkIcon className="size-8 text-white" />
                  </HeadlessButton>
                </div>
              ) : (
                <p className="text-center text-sm md:text-base">{texts.addAvatar}</p>
              )}
            </div>
            <div className="absolute bottom-0 left-[72px] md:left-[84px]">
              <HeadlessInput
                type="file"
                accept="image/*"
                className="hidden"
                id="avatar-upload"
                onChange={onUpdateAvatarClicked}
              />
              <HeadlessButton
                title={avatarUrl ? texts.changeAvatar : texts.addAvatar}
                onClick={() => document.getElementById('avatar-upload')?.click()}
                className="flex size-10 items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600"
              >
                <CameraIcon className="size-6 text-white" />
              </HeadlessButton>
            </div>
          </div>
          <div className="mt-2 flex w-full flex-col flex-wrap justify-stretch gap-2 md:flex-row">
            <Input
              label={texts.firstNameTitle}
              placeholder={texts.firstNamePlaceholder}
              wrapperClassName="w-full md:min-w-[332px] flex-1"
              className="w-full"
              errorText={errors.firstName?.message}
              type="text"
              {...register('firstName')}
            />
            <Input
              label={texts.lastNameTitle}
              placeholder={texts.lastNamePlaceholder}
              wrapperClassName="w-full md:min-w-[332px] flex-1"
              className="w-full"
              errorText={errors.lastName?.message}
              type="text"
              {...register('lastName')}
            />
          </div>
          <div className="flex w-full flex-col flex-wrap justify-stretch gap-2 md:flex-row">
            <Input
              label={texts.emailTitle}
              placeholder={texts.emailPlaceholder}
              wrapperClassName="w-full md:min-w-[332px] flex-1"
              className="w-full"
              errorText={errors.email?.message}
              type="email"
              {...register('email')}
            />
            <Input
              label={texts.phoneTitle}
              placeholder={texts.phonePlaceholder}
              wrapperClassName="w-full md:min-w-[332px] flex-1"
              className="w-full"
              errorText={errors.phone?.message}
              type="text"
              {...register('phone')}
            />
          </div>
          <p className="mt-4 w-full text-left text-sm font-bold md:text-base">
            {texts.chagePasswordTitle}
          </p>
          <Input
            label={texts.passwordTitle}
            placeholder={texts.passwordPlaceholder}
            wrapperClassName="w-full md:w-[332px] flex-1"
            className="w-full"
            errorText={errors.currentPassword?.message}
            type="password"
            autoComplete="new-password"
            {...register('currentPassword')}
          />
          <div className="flex w-full flex-col flex-wrap justify-stretch gap-2 md:flex-row">
            <Input
              label={texts.newPasswordTitle}
              placeholder={texts.passwordPlaceholder}
              wrapperClassName="w-full md:min-w-[332px] flex-1"
              className="w-full"
              errorText={errors.newPassword?.message}
              type="password"
              {...register('newPassword')}
            />
            <Input
              label={texts.repeatNewPasswordTitle}
              placeholder={texts.passwordPlaceholder}
              wrapperClassName="w-full md:min-w-[332px] flex-1"
              className="w-full"
              errorText={errors.repeatNewPassword?.message}
              type="password"
              {...register('repeatNewPassword')}
            />
          </div>
          <div className="mt-4 flex w-full flex-col gap-2 md:flex-row">
            <Button type="submit" disabled={!hasChanges}>
              {texts.saveChanges}
            </Button>
            <Button variant="secondary" onClick={onLogout}>
              {texts.logout}
            </Button>
          </div>
        </form>
      </section>
    </MainWrap>
  );
}
