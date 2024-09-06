/*
  Warnings:

  - Made the column `user_id` on table `ActiveSession` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ActiveSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "active_token" TEXT,
    "last_activity" DATETIME,
    CONSTRAINT "ActiveSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ActiveSession" ("active_token", "id", "last_activity", "user_id") SELECT "active_token", "id", "last_activity", "user_id" FROM "ActiveSession";
DROP TABLE "ActiveSession";
ALTER TABLE "new_ActiveSession" RENAME TO "ActiveSession";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
