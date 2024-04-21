-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_gym_id_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "gym_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
