delete from halloween_pumpkin_hunt;
UPDATE player SET metadata=JSON_REMOVE(metadata, "$.halloween2022");
