Config.Storages["food_fridge"] = {
    label = "Frigo Château Marius",
    type = "fridge",
    owner = "food",
    position = vector3(-1878.76, 2066.86, 141.02),
    size = vector2(0.5, 1.5),
    offsetUpZ = 2.0,
    heading = 251.1,
}

Config.Storages["food_fridge2"] = {
    label = "Frigo Château Marius",
    type = "fridge",
    owner = "food",
    position = vector3(-1927.72, 2042.20, 140.73),
    size = vector2(1.0, 3.4),
    offsetUpZ = 2.0,
    heading = 257.32,
}

Config.Storages["food_fridge3"] = {
    label = "Frigo Château Marius",
    type = "fridge",
    owner = "food",
    position = vector3(-1926.27, 2048.37, 140.73),
    size = vector2(1.0, 3.6),
    offsetUpZ = 2.0,
    heading = 256.38,
}

Config.Storages["food_fridge4"] = {
    label = "Frigo Château Marius",
    type = "fridge",
    owner = "food",
    position = vector3(-1924.85, 2054.54, 140.73),
    size = vector2(1.5, 3.4),
    offsetUpZ = 2.0,
    heading = 256.22,
}

Config.Storages["food_storage"] = {
    label = "Stockage Château Marius",
    type = "storage",
    owner = "food",
    position = vector3(-1888.19, 2060.61, 141.0),
    size = vector2(1.25, 1.0),
    minZ = 140.0,
    maxZ = 142.3,
    heading = 340.0,
}

Config.Storages["food_boss_storage"] = {
    label = "Coffre patron",
    type = "boss_storage",
    owner = "food",
    position = vector3(-1890.94, 2065.11, 140.97),
    size = vector2(0.5, 1.25),
    heading = 160.2,
}

Config.Storages["food_cloakroom"] = {
    label = "Vestiaire - Château Marius",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(-1866.8, 2059.98, 141.0),
    size = vec2(0.5, 1.5),
    minZ = 140.0,
    maxZ = 142.5,
    heading = 340.76,
    targetOptions = getCloakroomTargetOptions("food", "food_cloakroom"),
}

