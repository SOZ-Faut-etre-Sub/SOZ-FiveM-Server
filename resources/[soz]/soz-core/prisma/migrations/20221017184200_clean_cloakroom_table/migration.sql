-- Set the cloakroom storages to 500 of items.
UPDATE storages SET inventory = '[{"name":"work_clothes","slot":1,"type":"outfit","amount":500}]', owner = 'ffs' WHERE type = 'cloakroom' AND inventory IS NULL;
