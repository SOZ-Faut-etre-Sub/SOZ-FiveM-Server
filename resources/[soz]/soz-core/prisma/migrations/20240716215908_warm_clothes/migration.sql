-- AlterTable
ALTER TABLE `category` ADD COLUMN `warm_score` INTEGER NOT NULL DEFAULT 0;

UPDATE category SET warm_score=1 WHERE id=2;
UPDATE category SET warm_score=1 WHERE id=3;
UPDATE category SET warm_score=3 WHERE id=4;
UPDATE category SET warm_score=3 WHERE id=5;
UPDATE category SET warm_score=3 WHERE id=6;
UPDATE category SET warm_score=1 WHERE id=7;
UPDATE category SET warm_score=1 WHERE id=8;
UPDATE category SET warm_score=3 WHERE id=9;
UPDATE category SET warm_score=3 WHERE id=10;
UPDATE category SET warm_score=2 WHERE id=11;
UPDATE category SET warm_score=3 WHERE id=12;
UPDATE category SET warm_score=0 WHERE id=13;
UPDATE category SET warm_score=1 WHERE id=14;

UPDATE category SET warm_score=2 WHERE id=16;
UPDATE category SET warm_score=1 WHERE id=17;
UPDATE category SET warm_score=0 WHERE id=18;
UPDATE category SET warm_score=2 WHERE id=19;
UPDATE category SET warm_score=3 WHERE id=20;
UPDATE category SET warm_score=0 WHERE id=21;
UPDATE category SET warm_score=1 WHERE id=22;
UPDATE category SET warm_score=1 WHERE id=23;
UPDATE category SET warm_score=0 WHERE id=24;

UPDATE category SET warm_score=0 WHERE id=26;
UPDATE category SET warm_score=1 WHERE id=27;
UPDATE category SET warm_score=2 WHERE id=28;
UPDATE category SET warm_score=1 WHERE id=29;
UPDATE category SET warm_score=1 WHERE id=30;
UPDATE category SET warm_score=3 WHERE id=31;
UPDATE category SET warm_score=3 WHERE id=32;

UPDATE category SET warm_score=2 WHERE id=33;
UPDATE category SET warm_score=2 WHERE id=34;
UPDATE category SET warm_score=1 WHERE id=35;
UPDATE category SET warm_score=3 WHERE id=36;
UPDATE category SET warm_score=2 WHERE id=37;
UPDATE category SET warm_score=3 WHERE id=38;
UPDATE category SET warm_score=2 WHERE id=39;
UPDATE category SET warm_score=3 WHERE id=40;

UPDATE category SET warm_score=1 WHERE id=50;

UPDATE category SET warm_score=0 WHERE id=52;

UPDATE category SET warm_score=1 WHERE id=61;
UPDATE category SET warm_score=1 WHERE id=62;
UPDATE category SET warm_score=3 WHERE id=63;
UPDATE category SET warm_score=3 WHERE id=64;
UPDATE category SET warm_score=2 WHERE id=65;
UPDATE category SET warm_score=0 WHERE id=66;
