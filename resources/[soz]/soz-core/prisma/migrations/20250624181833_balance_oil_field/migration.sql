UPDATE field SET data=JSON_SET(data, '$.refill.delay', 30000) WHERE owner='oil';
UPDATE field SET data=JSON_SET(data, '$.refill.amount', 1) WHERE owner='oil';
