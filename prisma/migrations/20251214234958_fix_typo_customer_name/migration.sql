/*
  Warnings:

  - You are about to drop the column `costumerCPF` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `costumerName` on the `Order` table. All the data in the column will be lost.
  - Added the required column `customerCPF` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "costumerCPF",
DROP COLUMN "costumerName",
ADD COLUMN     "customerCPF" TEXT NOT NULL,
ADD COLUMN     "customerName" TEXT NOT NULL;
