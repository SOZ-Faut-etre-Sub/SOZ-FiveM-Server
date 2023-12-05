UPDATE field SET data = JSON_SET(data, '$.refill.delay', 3600000) WHERE identifier = 'stonk_delivery';
