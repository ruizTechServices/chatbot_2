/*
  Warnings:

  - You are about to drop the `ChecklistItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ChecklistItem";

-- CreateTable
CREATE TABLE "checklist_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isChecked" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklist_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "checklist_items_name_key" ON "checklist_items"("name");
