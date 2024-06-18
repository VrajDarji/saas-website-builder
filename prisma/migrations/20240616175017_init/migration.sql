/*
  Warnings:

  - The values [price_1OYxkqFj9oKEERu1NbKUxXxN,price_1OYxkqFj9oKEERu1KfJGWxgN] on the enum `Plan` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Plan_new" AS ENUM ('price_1PSMpfGpi1UZMbZFYQ4oz4TC', 'price_1PSMqkGpi1UZMbZF3B49DHW6');
ALTER TABLE "Subscription" ALTER COLUMN "plan" TYPE "Plan_new" USING ("plan"::text::"Plan_new");
ALTER TYPE "Plan" RENAME TO "Plan_old";
ALTER TYPE "Plan_new" RENAME TO "Plan";
DROP TYPE "Plan_old";
COMMIT;
