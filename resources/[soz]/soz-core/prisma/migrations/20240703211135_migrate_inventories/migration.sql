-- Migrate existing data to the new inventory system
INSERT INTO inventories (id, type, configuration, items)
SELECT name, type, JSON_OBJECT('maxSlots', max_slots, 'maxWeight', max_weight), IFNULL(inventory, '[]') FROM storages;

-- Migrate the player inventories
INSERT INTO inventories (id, type, configuration, items)
SELECT CONCAT('player_', citizenId), 'player', JSON_OBJECT('owner', citizenId), IFNULL(inventory, '[]') FROM player;

-- Update the type of the inventories
UPDATE inventories SET type = 'house_fridge' WHERE id LIKE 'house_fridge_%' AND type = 'fridge';
UPDATE inventories SET type = 'house_stash' WHERE id LIKE 'house_stash_%' AND type = 'stash';
UPDATE inventories SET type = 'ice_machine' WHERE id LIKE '%ice_machine%';
