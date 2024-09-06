/*
  Warnings:

  - You are about to drop the column `mode` on the `Mode` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Mode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "playlist_id" INTEGER,
    CONSTRAINT "Mode_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Mode" ("id", "playlist_id") SELECT "id", "playlist_id" FROM "Mode";
DROP TABLE "Mode";
ALTER TABLE "new_Mode" RENAME TO "Mode";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
