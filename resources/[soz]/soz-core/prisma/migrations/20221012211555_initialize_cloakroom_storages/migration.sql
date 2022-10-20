-- Set the cloakroom storages to 100 of items.
UPDATE storages SET inventory = '[{"name":"work_clothes","slot":1,"type":"outfit","amount":500}]' WHERE type = 'cloakroom' AND inventory IS NULL;
