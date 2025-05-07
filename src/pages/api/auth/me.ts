import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db/db';
import { users } from '@/db/schema';
import { profileFormSchema, User } from '@/features/profile/profile.types';
import { userSchema } from '@/models';
import { getUser } from '@/utils/get-user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return await GET(req, res);
    case 'PUT':
      return await PUT(req, res);
    default:
      return res.status(405).end();
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = await getUser(req);

    const data = await db
      .select()
      .from(users)
      .where(eq(users.id, String(userId)))
      .limit(1);

    if (!data || data.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const responseUser: User = {
      id: data[0].id,
      firstName: data[0].firstName,
      lastName: data[0].lastName,
      email: data[0].email,
      phone: data[0].phone,
      avatar: data[0].avatar,
    };

    res.status(200).json(responseUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
}

async function PUT(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = await getUser(req);
    const { avatarBase64Data, profileData, deleteAvatar } = req.body;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, String(userId)))
      .limit(1);

    if (!existingUser.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateData: Partial<typeof users.$inferSelect> = {
      updatedAt: new Date(),
    };

    if (avatarBase64Data) {
      try {
        const buffer = Buffer.from(avatarBase64Data, 'base64');
        updateData.avatar = buffer;
      } catch (error) {
        console.error('Error processing avatar:', error);
        return res.status(400).json({ error: 'Invalid avatar data' });
      }
    }

    if (deleteAvatar) {
      updateData.avatar = null;
    }

    if (profileData) {
      const { currentPassword, newPassword, repeatNewPassword, ...data } =
        profileFormSchema.parse(profileData);

      Object.assign(updateData, data);

      if (currentPassword) {
        if (!newPassword || !repeatNewPassword) {
          return res
            .status(400)
            .json({ error: 'New password and confirmation are required when changing password' });
        }

        if (newPassword !== repeatNewPassword) {
          return res.status(400).json({ error: 'New passwords do not match' });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, existingUser[0].password);
        if (!isPasswordValid) {
          return res.status(400).json({ error: 'Current password is incorrect' });
        }

        updateData.password = await bcrypt.hash(newPassword, 10);
      }
    }

    const parsedUpdate = userSchema.partial().parse(updateData);

    const [updatedUser] = await db
      .update(users)
      .set(parsedUpdate)
      .where(eq(users.id, String(userId)))
      .returning();

    const responseUser: User = {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar,
    };

    return res.status(200).json(responseUser);
  } catch (error) {
    console.error('Error updating user:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ error: 'Failed to update user' });
  }
}
