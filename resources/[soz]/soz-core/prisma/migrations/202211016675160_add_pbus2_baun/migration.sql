INSERT INTO vehicles (model, hash, name, price, category, required_licence, size)
VALUES ('pbus2', 345756458, 'Bus Festif', 0, 'Utility', 'car', 1);

INSERT INTO player_vehicles (vehicle, hash, mods, `condition`, plate, garage, job, category, fuel, engine, body, state, life_counter, boughttime)
VALUES ('pbus2', 345756458, '{}', '{}', 'BAUN 573', 'baun_bahama', 'baun', 'car', 100, 1000, 1000, 3, 3, DEFAULT);
