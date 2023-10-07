Config.Storages["sasp_fridge"] = {
    label = "Frigo SASP",
    type = "fridge",
    owner = "sasp",
    position = vector3(-572.34, -592.50, 34.68),
    size = vec2(0.8, 0.8),
    heading = 0,
    minZ = 33.68,
    maxZ = 35.68,
}

Config.Storages["sasp_storage"] = {
    label = "Coffre SASP",
    type = "storage",
    owner = "sasp",
    position = vector3(-572.87, -608.43, 34.68),
    size = vec2(0.60, 2.40),
    heading = 180.0,
    minZ = 33.68,
    maxZ = 35.68,
}

Config.Storages["sasp_boss_storage"] = {
    label = "Stockage Patron SASP",
    type = "boss_storage",
    owner = "sasp",
    position = vector3(-580.18, -590.11, 34.68),
    size = vec2(0.40, 2.40),
    heading = 270,
    minZ = 33.68,
    maxZ = 35.68,
}

Config.Storages["sasp_armory"] = {
    label = "Armurerie SASP",
    type = "armory",
    owner = "sasp",
    position = vector3(-580.25, -609.74, 34.68),
    size = vec2(0.40, 3.00),
    heading = 270.0,
    minZ = 33.68,
    maxZ = 35.68,
}

Config.Storages["sasp_ammo"] = {
    label = "Munition SASP",
    type = "ammo",
    owner = "sasp",
    position = vector3(-579.57, -607.16, 34.68),
    size = vec2(1.20, 0.60),
    heading = 0.0,
    minZ = 33.68,
    maxZ = 35.68,
}

Config.Storages["sasp_cloakroom"] = {
    label = "Vestiaire - SASP",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(-577.76, -582.41, 34.68),
    size = vec2(0.60, 3.20),
    minZ = 33.68,
    maxZ = 35.68,
    heading = 180,
    targetOptions = concatTables(getCloakroomTargetOptions("sasp", "sasp_cloakroom", "soz-core:client:police:OpenCloakroomMenu"),
                                 getPoliceCloakroomTargetOptions("sasp")),
}
