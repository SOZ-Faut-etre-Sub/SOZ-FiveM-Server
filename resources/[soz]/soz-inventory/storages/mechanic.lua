Config.Storages["bennys_stash"] = {
    label = "Stockage de New Gahray",
    type = "storage",
    owner = "bennys",
    position = vector3(-224.16, -1318.89, 30.63),
    size = vec2(1.5, 3.0),
    offsetUpZ = 2.0,
}

Config.Storages["bennys_stash_north"] = {
    label = "Stockage de New Gahray",
    type = "storage",
    owner = "bennys",
    position = vector3(1901.15, 3071.08, 46.92),
    size = vec2(1.8, 0.8),
}

Config.Storages["bennys_boss_storage"] = {
    label = "Coffre Patron New Gahray",
    type = "boss_storage",
    owner = "bennys",
    position = vector3(-196.99, -1314.76, 31.09),
    size = vec2(1.5, 3.0),
}

Config.Storages["bennys_boss_storage_north"] = {
    label = "Coffre Patron New Gahray",
    type = "boss_storage",
    owner = "bennys",
    position = vector3(1908.63, 3092.91, 46.93),
    size = vec2(1.2, 1.6),
}

Config.Storages["bennys_fridge"] = {
    label = "Frigo New Gahray",
    type = "fridge",
    owner = "bennys",
    position = vector3(-204.2, -1340.54, 34.89),
    size = vec2(2.0, 2.0),
}

Config.Storages["bennys_fridge_north"] = {
    label = "Frigo New Gahray",
    type = "fridge",
    owner = "bennys",
    position = vector3(1916.05, 3085.72, 51.75),
    size = vec2(2.4, 3.2),
}

Config.Storages["bennys_cloakroom"] = {
    label = "Vestiaire - New Gahray",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(-204.44, -1330.74, 34.89),
    size = vec2(3.0, 2.8),
    minZ = 33.89,
    maxZ = 37.89,
    heading = 0,
    targetOptions = getCloakroomTargetOptions("bennys", "bennys_cloakroom", "soz-core:client:job:bennys:open-cloakroom"),
}

Config.Storages["bennys_cloakroom_north"] = {
    label = "Vestiaire - New Gahray",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(1904.47, 3089.13, 46.93),
    size = vec2(1.0, 1.0),
    minZ = 45.93,
    maxZ = 46.932,
    heading = 331.00,
    targetOptions = getCloakroomTargetOptions("bennys", "bennys_cloakroom_north", "soz-core:client:job:bennys:open-cloakroom"),
}
