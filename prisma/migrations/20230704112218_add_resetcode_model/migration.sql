-- CreateTable
CREATE TABLE "ResetCode" (
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResetCode_pkey" PRIMARY KEY ("userId")
);
