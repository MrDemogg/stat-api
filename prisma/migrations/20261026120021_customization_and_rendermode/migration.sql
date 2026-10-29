-- CreateEnum
CREATE TYPE "MetricRenderModes" AS ENUM ('Events', 'Counts');

-- AlterTable
ALTER TABLE "Metric" ADD COLUMN     "renderMode" "MetricRenderModes" NOT NULL DEFAULT 'Counts',
ALTER COLUMN "description" SET DEFAULT '';

-- AlterTable
ALTER TABLE "MetricPoint" ADD COLUMN     "customization" TEXT DEFAULT '',
ALTER COLUMN "data" DROP NOT NULL,
ALTER COLUMN "data" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "description" SET DEFAULT '';
