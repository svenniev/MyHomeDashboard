export interface Goal {
    id: string;
    title: string;
    shortDescription?: string | null;
    longDescription?: string | null;
    startDate: string;
    targetFinishDate?: string | null;
    valueType: string;
    unit: string;
    direction: 'increase' | 'decrease';
    startValue: number;
    currentValue: number;
    targetValue: number;
    lastValueUpdateAt?: string | null;
    isArchived: boolean;
}

export interface GoalValueUpdate {
    id: string;
    goalId: string;
    userId: string;
    value: number;
    updatedAt: string;
    note?: string | null;
}export interface ApplicationUser {
    id: string;
    email: string;
    firstName: string;
    middleName?: string | null;
    lastName?: string | null;
    nickname?: string | null;
    heightCm?: number | null;
    dateOfBirth?: string | null;
    profilePicturePath?: string | null;
}
