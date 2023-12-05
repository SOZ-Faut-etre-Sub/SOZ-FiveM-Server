Config.Storages["taxi_fridge"] = {
    label = "Frigo Carl'jr services",
    type = "fridge",
    owner = "taxi",
    position = vector3(891.46, -173.37, 74.7),
    size = vec2(1.4, 0.8),
    heading = 328,
    offsetUpZ = 1.8,
}

Config.Storages["taxi_storage"] = {
    label = "Stockage Carl'jr services",
    type = "storage",
    owner = "taxi",
    position = vector3(899.6, -169.36, 74.17),
    size = vec2(0.6, 6),
    heading = 238,
    offsetUpZ = 2.1,
}

Config.Storages["taxi_cloakroom"] = {
    label = "Vestiaire - Carl'jr Services",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(889.1, -178.53, 74.7),
    size = vec2(0.4, 6.8),
    minZ = 73.75,
    maxZ = 75.75,
    heading = 330,
    targetOptions = getCloakroomTargetOptions("taxi", "taxi_cloakroom"),
}

Config.Storages["taxi_boss_storage"] = {
    label = "Coffre patron",
    type = "boss_storage",
    owner = "taxi",
    position = vector3(910.45, -152.13, 74.17),
    size = vec2(0.2, 2.6),
    minZ = 73.17,
    maxZ = 75.17,
    heading = 328,
}
