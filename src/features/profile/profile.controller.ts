import { ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';

import { useNotificationStore } from '@/components/notification/notification.store';
import { PROFILE_KEY, PROFILE_QUERY_KEY } from '@/features/profile/profile.constants';
import { useLogout, useProfile, useUpdateProfile } from '@/features/profile/profile.queries';
import { useIsProfileEnable, useProfileStoreActions } from '@/features/profile/profile.store';
import texts from '@/features/profile/profile.texts';
import { ProfileFormSuccessResult, User } from '@/features/profile/profile.types';
import { getClientSideCookie } from '@/utils/client-side-cookie';

export const useProfileController = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const isProfileEnable = useIsProfileEnable();
  const { data: profileData, isPending: isProfileLoading } = useProfile(isProfileEnable);
  const { mutate: mutateLogout, isPending: isLogoutLoading } = useLogout();
  const { mutate: mutateUpdateProfile } = useUpdateProfile();
  const { setIsProfileEnable } = useProfileStoreActions();
  const show = useNotificationStore(store => store.show);
  const avatarUrl = profileData?.avatar
    ? `data:image/jpeg;base64,${Buffer.from(profileData.avatar).toString('base64')}`
    : null;

  useEffect(() => {
    const profile = getClientSideCookie(PROFILE_KEY);

    if (profile) {
      setIsProfileEnable(true);
    } else {
      setIsProfileEnable(false);
    }
  }, [setIsProfileEnable]);

  const onLogin = (user: User) => {
    queryClient.setQueryData(PROFILE_QUERY_KEY, user);
    setIsProfileEnable(true);
  };

  const onLogout = () => {
    mutateLogout(undefined, {
      onSuccess: () => {
        setIsProfileEnable(false);
        queryClient.clear();
        router.replace('/signin');
      },
    });
  };

  const onBackClicked = () => {
    router.back();
  };

  const onUpdateAvatarClicked = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      show(texts.pleaseSelectImageFile);
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      show(texts.imageSizeShouldBeLessThan);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = e => {
        const base64String = e.target?.result as string;
        const base64Data = base64String.split(',')[1];

        if (!profileData) return;

        mutateUpdateProfile(
          { avatarBase64Data: base64Data },
          {
            onSuccess: () => {
              show(texts.avatarUpdatedSuccessfully);
            },
            onError: () => {
              show(texts.failedUpdateAvatar);
            },
          }
        );
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing avatar:', error);
      show(texts.errorProcessingAvatar);
    }
  };

  const onDeleteAvatarClicked = () => {
    if (!profileData) return;

    mutateUpdateProfile(
      { deleteAvatar: true },
      {
        onSuccess: () => {
          show(texts.avatarDeletedSuccessfully);
        },
        onError: () => {
          show(texts.failedDeleteAvatar);
        },
      }
    );
  };

  const hasProfileFormChanges = (currentValues: ProfileFormSuccessResult) => {
    if (!profileData) return false;

    return Object.entries(currentValues).some(([key, value]) => {
      if (key === 'currentPassword' || key === 'newPassword' || key === 'repeatNewPassword') {
        return value !== '';
      }
      if (key === 'phone') {
        return value !== (profileData.phone || '');
      }
      return value !== profileData[key as keyof typeof profileData];
    });
  };

  const onUpdatePrifileData = (data: ProfileFormSuccessResult) => {
    if (!profileData) return;

    const updateData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      repeatNewPassword: data.repeatNewPassword,
    };

    mutateUpdateProfile(
      { profileData: updateData },
      {
        onSuccess: () => {
          show(texts.profileUpdatedSuccessfully);
        },
        onError: () => {
          show(texts.failedUpdateProfile);
        },
      }
    );
  };

  return {
    profileData,
    avatarUrl,
    isProfileLoading: isProfileLoading || isLogoutLoading,
    onLogin,
    onLogout,
    onBackClicked,
    onUpdateAvatarClicked,
    onDeleteAvatarClicked,
    hasProfileFormChanges,
    onUpdatePrifileData,
  };
};
