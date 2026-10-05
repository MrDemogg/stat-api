/*
  Warnings:

  - You are about to drop the column `timestamp` on the `MetricPoint` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ingestKey]` on the table `Metric` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId,title]` on the table `Metric` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[metricId,date]` on the table `MetricPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ownerId,title]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ingestKey` to the `Metric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `MetricPoint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Metric" ADD COLUMN     "ingestKey" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MetricPoint" DROP COLUMN "timestamp",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Metric_ingestKey_key" ON "Metric"("ingestKey");

-- CreateIndex
CREATE UNIQUE INDEX "Metric_projectId_title_key" ON "Metric"("projectId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "MetricPoint_metricId_date_key" ON "MetricPoint"("metricId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Project_ownerId_title_key" ON "Project"("ownerId", "title");
