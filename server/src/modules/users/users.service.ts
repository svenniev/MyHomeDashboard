import { prisma } from '../../prisma';
import { ApplicationUser } from '@prisma/client';
import { hashPassword } from '../auth/password.service';

export async function createUser(
  data: Omit<ApplicationUser, 'id' | 'passwordHash' | 'createdAt' | 'updatedAt'> & { password?: string }
): Promise<ApplicationUser> {
  if (!data.password) {
    throw new Error('Password is required to create a user');
  }
  const passwordHash = await hashPassword(data.password);
  
  return prisma.applicationUser.create({
    data: {
      email: data.email,
      firstName: data.firstName,
      passwordHash,
      middleName: data.middleName,
      lastName: data.lastName,
      nickname: data.nickname,
      heightCm: data.heightCm,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
    },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.applicationUser.findUnique({
    where: { email },
  });
}

export async function findUserById(id: string) {
    return prisma.applicationUser.findUnique({
      where: { id },
    });
  }

export async function updateUser(
    id: string,
    data: Partial<Omit<ApplicationUser, 'id' | 'email' | 'passwordHash' | 'createdAt' | 'updatedAt'>>
    ) {
    return prisma.applicationUser.update({
        where: { id },
        data: {
            ...data,
            ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
        },
    });
}
