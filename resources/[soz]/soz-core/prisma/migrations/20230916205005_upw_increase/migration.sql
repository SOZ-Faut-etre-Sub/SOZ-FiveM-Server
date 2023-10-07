UPDATE upw_facility SET data=JSON_SET(data, '$.productionPerMinute.min',60) WHERE identifier='fossil1';
UPDATE upw_facility SET data=JSON_SET(data, '$.productionPerMinute.max',120) WHERE identifier='fossil1';

UPDATE upw_facility SET data=JSON_SET(data, '$.productionPerMinute.min',3) WHERE identifier='wind1';
UPDATE upw_facility SET data=JSON_SET(data, '$.productionPerMinute.max',10) WHERE identifier='wind1';

UPDATE upw_facility SET data=JSON_SET(data, '$.productionPerMinute.min',6) WHERE identifier='hydro1';
UPDATE upw_facility SET data=JSON_SET(data, '$.productionPerMinute.max',10) WHERE identifier='hydro1';

UPDATE upw_facility SET data=JSON_SET(data, '$.productionPerMinute.min',3) WHERE identifier='solar1';
UPDATE upw_facility SET data=JSON_SET(data, '$.productionPerMinute.max',10) WHERE identifier='solar1';

