import { z } from 'zod';

import texts from '@/features/profile/profile.texts';
import { userSchema } from '@/models';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatar: Buffer | null;
};

export const profileFormSchema = userSchema
  .omit({
    id: true,
    phone: true,
    avatar: true,
    password: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    phone: z
      .union([z.string().regex(/^\+?[0-9\s-()]+$/, texts.wrongPhoneNumber), z.string().length(0)])
      .optional()
      .transform(e => (e === '' ? undefined : e)),
    currentPassword: z
      .union([z.string().min(8, texts.passwordMinLength), z.string().length(0)])
      .optional()
      .transform(e => (e === '' ? undefined : e)),
    newPassword: z
      .union([z.string().min(8, texts.passwordMinLength), z.string().length(0)])
      .optional()
      .transform(e => (e === '' ? undefined : e)),
    repeatNewPassword: z
      .union([z.string().min(8, texts.passwordMinLength), z.string().length(0)])
      .optional()
      .transform(e => (e === '' ? undefined : e)),
  })
  .refine(
    data => {
      if (data.newPassword || data.repeatNewPassword) {
        return data.newPassword === data.repeatNewPassword;
      }
      return true;
    },
    {
      message: texts.passwordsNotMatch,
      path: ['repeatNewPassword'],
    }
  );

export type ProfileFormSuccessResult = z.infer<typeof profileFormSchema>;

export type ProfileUpdateRequest = {
  avatarBase64Data?: string;
  deleteAvatar?: boolean;
  profileData?: ProfileFormSuccessResult;
};
