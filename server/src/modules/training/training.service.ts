import { prisma } from '../../prisma';
import { TrainingType, TrainingLog, Prisma } from '@prisma/client';

// Training Types
export function findTrainingTypes() {
  return prisma.trainingType.findMany({ where: { isActive: true } });
}

export function createTrainingType(data: Omit<TrainingType, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) {
    return prisma.trainingType.create({ data: {
        ...data,
        summarySchemaJson: data.summarySchemaJson || Prisma.JsonNull,
    } });
}

export function updateTrainingType(id: string, data: Partial<Omit<TrainingType, 'id' | 'createdAt' | 'updatedAt'>>) {
    return prisma.trainingType.update({ where: { id }, data: {
        ...data,
        summarySchemaJson: data.summarySchemaJson || Prisma.JsonNull,
    } });
}

export function deactivateTrainingType(id: string) {
    return prisma.trainingType.update({ where: { id }, data: { isActive: false } });
}

export function findTrainingTypeById(id: string) {
    return prisma.trainingType.findUnique({ where: { id } });
}

// Training Logs
export function findTrainingLogsByUserId(userId: string) {
    return prisma.trainingLog.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      include: { trainingType: true },
    });
  }
  
  export function findTrainingLogById(id: string) {
    return prisma.trainingLog.findUnique({ where: { id }, include: { trainingType: true } });
  }
  
  export function createTrainingLog(userId: string, data: Omit<TrainingLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    return prisma.trainingLog.create({
      data: {
        ...data,
        summaryJson: data.summaryJson || Prisma.JsonNull,
        userId,
        startedAt: new Date(data.startedAt),
        endedAt: data.endedAt ? new Date(data.endedAt) : null,
      },
    });
  }
  
  export function updateTrainingLog(id: string, data: Partial<Omit<TrainingLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) {
    return prisma.trainingLog.update({
      where: { id },
      data: {
        ...data,
        summaryJson: data.summaryJson || Prisma.JsonNull,
        ...(data.startedAt && { startedAt: new Date(data.startedAt) }),
        ...(data.endedAt && { endedAt: new Date(data.endedAt) }),
      },
    });
  }
  
  export function deleteTrainingLog(id: string) {
    return prisma.trainingLog.delete({ where: { id } });
  }