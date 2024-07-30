UPDATE upw_facility SET data=JSON_SET(data, '$.productionPerMinute.min',2) WHERE identifier='wind1';
UPDATE upw_facility SET data=JSON_SET(data, '$.productionPerMinute.max',5) WHERE identifier='wind1';

UPDATE upw_facility SET data=JSON_SET(data, '$.productionPerMinute.min',0) WHERE identifier='hydro1';
UPDATE upw_facility SET data=JSON_SET(data, '$.productionPerMinute.max',0) WHERE identifier='hydro1';
