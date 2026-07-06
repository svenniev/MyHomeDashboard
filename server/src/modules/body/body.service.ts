import { prisma } from '../../prisma';
import { BodyCompositionEntry } from '@prisma/client';

export function findBodyCompositionByUserId(userId: string) {
  return prisma.bodyCompositionEntry.findMany({
    where: { userId },
    orderBy: { measuredAt: 'desc' },
  });
}

export function findLatestBodyCompositionByUserId(userId: string) {
    return prisma.bodyCompositionEntry.findFirst({
        where: { userId },
        orderBy: { measuredAt: 'desc' },
    });
}

export function createBodyCompositionEntry(userId: string, data: Omit<BodyCompositionEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    return prisma.bodyCompositionEntry.create({
        data: {
            ...data,
            userId,
            measuredAt: new Date(data.measuredAt),
        }
    });
}

export function updateBodyCompositionEntry(id: string, data: Partial<Omit<BodyCompositionEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) {
    return prisma.bodyCompositionEntry.update({
        where: { id },
        data: {
            ...data,
            ...(data.measuredAt && { measuredAt: new Date(data.measuredAt) }),
        }
    });
}

export function deleteBodyCompositionEntry(id: string) {
    return prisma.bodyCompositionEntry.delete({ where: { id } });
}

export function findBodyCompositionEntryById(id: string) {
    return prisma.bodyCompositionEntry.findUnique({ where: { id } });
}