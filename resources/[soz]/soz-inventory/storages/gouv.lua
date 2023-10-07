Config.Storages["gouv_fridge"] = {
    label = "Frigo Gouvernement",
    type = "fridge",
    owner = "gouv",
    position = vector3(-533.09, -592.43, 34.68),
    size = vec2(0.80, 0.80),
    heading = 0,
    minZ = 33.68,
    maxZ = 35.68,
}

Config.Storages["gouv_storage"] = {
    label = "Coffre Gouvernement",
    type = "storage",
    owner = "gouv",
    position = vector3(-530.99, -596.52, 34.68),
    size = vec2(0.80, 2.60),
    heading = 270.0,
    minZ = 33.68,
    maxZ = 35.68,
}

Config.Storages["gouv_boss_storage"] = {
    label = "Stockage Patron Gouvernement",
    type = "boss_storage",
    owner = "gouv",
    position = vector3(-530.60, -591.20, 34.68),
    size = vec2(3.20, 0.20),
    heading = 180,
    minZ = 33.68,
    maxZ = 35.68,
}

Config.Storages["gouv_cloakroom"] = {
    label = "Vestiaire - Gouvernement",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(-538.53, -582.20, 34.68),
    size = vec2(0.80, 3.20),
    minZ = 33.68,
    maxZ = 35.68,
    heading = 180,
    targetOptions = getCloakroomTargetOptions("gouv", "gouv_cloakroom"),
}
