update vehicle_business_unique SET DATA = JSON_REPLACE(DATA, '$.price', ROUND(JSON_EXTRACT(DATA, '$.price') * 1.25));
delete from zone where type='SmugglingBizStorage';
