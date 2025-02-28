-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "positionId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "isUser" BOOLEAN NOT NULL,
    "embedding" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
