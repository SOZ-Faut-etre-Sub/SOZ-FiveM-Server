UPDATE upw_facility SET data=JSON_SET(data, '$.maxCapacity',15000) WHERE identifier='fossil1';
UPDATE upw_facility SET data=JSON_SET(data, '$.maxCapacity',2250) WHERE identifier='wind1';
UPDATE upw_facility SET data=JSON_SET(data, '$.maxCapacity',2250) WHERE identifier='hydro1';


UPDATE upw_facility SET data=JSON_SET(data, '$.productionPerMinute.min',60) WHERE identifier='fossil1';
UPDATE upw_facility SET data=JSON_SET(data, '$.productionPerMinute.max',120) WHERE identifier='fossil1';

UPDATE upw_facility SET data=JSON_SET(data, '$.productionPerMinute.min',1.2) WHERE identifier='wind1';
UPDATE upw_facility SET data=JSON_SET(data, '$.productionPerMinute.max',12) WHERE identifier='wind1';

UPDATE upw_facility SET data=JSON_SET(data, '$.productionPerMinute.min',6) WHERE identifier='hydro1';
UPDATE upw_facility SET data=JSON_SET(data, '$.productionPerMinute.max',9.6) WHERE identifier='hydro1';

ALTER TABLE upw_stations ADD COLUMN job TEXT;
INSERT INTO upw_stations (station, stock, max_stock, price, position, job) VALUES ('stationUpw', 0, 600, 0, '{"x":580.59,"y":2787.12,"z":41.07,"w":-176.0}', 'upw');
INSERT INTO upw_chargers (station, position, active) VALUES ('stationUpw', '{"x":580.59,"y":2787.12,"z":41.07,"w":-176.0}',1);

INSERT INTO upw_facility (type, identifier, data) VALUES ('plant', 'solar1', '{"active":true,"maxWaste":1000,"productionPerMinute":{"max":12,"min":1.2},"waste":0.0,"wastePerMinute":0,"maxCapacity":2250,"zones":{"energyZone":{"sy":5,"sx":5,"maxZ":9,"minZ":4.9,"heading":290,"coords":{"z":5.56,"y":-4594.7,"x":4481.2}}},"pollutionPerUnit":0.05,"type":"plant","capacity":0.0}');
