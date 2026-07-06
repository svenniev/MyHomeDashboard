import { prisma } from '../../prisma';
import { Goal } from '@prisma/client';

export function findGoalsByUserId(userId: string) {
  return prisma.goal.findMany({ where: { userId, isArchived: false } });
}

export function findGoalById(id: string) {
  return prisma.goal.findUnique({ where: { id } });
}

export function createGoal(userId: string, data: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'isArchived' | 'lastValueUpdateAt'>) {
    return prisma.goal.create({
        data: {
            ...data,
            userId,
            startDate: new Date(data.startDate),
            targetFinishDate: data.targetFinishDate ? new Date(data.targetFinishDate) : null,
        }
    });
}

export function updateGoal(id: string, data: Partial<Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) {
    return prisma.goal.update({
        where: { id },
        data: {
            ...data,
            ...(data.startDate && { startDate: new Date(data.startDate) }),
            ...(data.targetFinishDate && { targetFinishDate: new Date(data.targetFinishDate) }),
        }
    });
}

export async function archiveGoal(id: string) {
    return prisma.goal.update({
        where: { id },
        data: { isArchived: true }
    });
}

import { Prisma } from '@prisma/client';

export async function addGoalValueUpdate(goalId: string, userId: string, value: number, note?: string) {
    const goal = await findGoalById(goalId);
    if (!goal) throw new Error('Goal not found');
  
    await prisma.goalValueUpdate.create({
      data: {
        goalId,
        userId,
        value: new Prisma.Decimal(value),
        note,
        updatedAt: new Date(),
      },
    });
  
    return updateGoal(goalId, {
      currentValue: new Prisma.Decimal(value),
      lastValueUpdateAt: new Date(),
    });
  }