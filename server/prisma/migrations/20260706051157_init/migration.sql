-- CreateTable
CREATE TABLE "ApplicationUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT,
    "nickname" TEXT,
    "heightCm" DECIMAL(65,30),
    "dateOfBirth" DATE,
    "profilePicturePath" TEXT,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BodyCompositionEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "measuredAt" TIMESTAMP(3) NOT NULL,
    "weightKg" DECIMAL(65,30),
    "bodyFatPercent" DECIMAL(65,30),
    "musclePercent" DECIMAL(65,30),
    "visceralFatPercent" DECIMAL(65,30),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BodyCompositionEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT,
    "longDescription" TEXT,
    "startDate" DATE NOT NULL,
    "targetFinishDate" DATE,
    "valueType" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "startValue" DECIMAL(65,30) NOT NULL,
    "currentValue" DECIMAL(65,30) NOT NULL,
    "targetValue" DECIMAL(65,30) NOT NULL,
    "lastValueUpdateAt" TIMESTAMP(3),
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalValueUpdate" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoalValueUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "thumbnailPath" TEXT,
    "summarySchemaJson" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trainingTypeId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "durationSeconds" INTEGER,
    "caloriesConsumed" INTEGER,
    "summaryJson" JSONB NOT NULL DEFAULT '{}',
    "source" TEXT NOT NULL,
    "externalDeviceSessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationUser_email_key" ON "ApplicationUser"("email");

-- CreateIndex
CREATE INDEX "BodyCompositionEntry_userId_measuredAt_idx" ON "BodyCompositionEntry"("userId", "measuredAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "TrainingType_slug_key" ON "TrainingType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingLog_externalDeviceSessionId_key" ON "TrainingLog"("externalDeviceSessionId");

-- AddForeignKey
ALTER TABLE "BodyCompositionEntry" ADD CONSTRAINT "BodyCompositionEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ApplicationUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ApplicationUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalValueUpdate" ADD CONSTRAINT "GoalValueUpdate_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalValueUpdate" ADD CONSTRAINT "GoalValueUpdate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ApplicationUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingLog" ADD CONSTRAINT "TrainingLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ApplicationUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingLog" ADD CONSTRAINT "TrainingLog_trainingTypeId_fkey" FOREIGN KEY ("trainingTypeId") REFERENCES "TrainingType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
