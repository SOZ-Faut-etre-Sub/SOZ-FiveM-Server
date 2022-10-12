Config.Storages["bennys_stash"] = {
    label = "Stockage des mécanos",
    type = "storage",
    owner = "bennys",
    position = vector3(-224.16, -1318.89, 30.63),
    size = vec2(1.5, 3.0),
    offsetUpZ = 2.0,
}

Config.Storages["bennys_boss_storage"] = {
    label = "Coffre Patron Bennys",
    type = "boss_storage",
    owner = "bennys",
    position = vector3(-196.99, -1314.76, 31.09),
    size = vec2(1.5, 3.0),
}

Config.Storages["bennys_fridge"] = {
    label = "Frigo Bennys",
    type = "fridge",
    owner = "bennys",
    position = vector3(-204.2, -1340.54, 34.89),
    size = vec2(2.0, 2.0),
}

-- TODO: Recheck the position
Config.Storages["bennys_cloakroom"] = {
    label = "Vestiaire - Benny's",
    type = "cloakroom",
    owner = "bennys",
    position = vector3(-205.29, -1331.31, 34.89),
    size = vec2(5, 5),
    minZ = 33.89,
    maxZ = 37.89,
    heading = 320,
}
