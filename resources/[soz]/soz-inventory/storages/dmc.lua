Config.Storages["dmc_boss_storage"] = {
    label = "Stockage Patron DeMetal Company",
    type = "boss_storage",
    owner = "dmc",
    position = vector3(1079.02, -1978.35, 31.47),
    size = vec2(4.20, 1.00),
    heading = 55,
    minZ = 30.47,
    maxZ = 33.27,
}

Config.Storages["dmc_storage"] = {
    label = "Stockage DeMetal Company",
    type = "metal_storage",
    owner = "dmc",
    position = vector3(1075.59, -2010.84, 32.08),
    size = vec2(1.20, 2.80),
    heading = 55,
    minZ = 31.08,
    maxZ = 33.08,
}

Config.Storages["dmc_fridge"] = {
    label = "Frigo - DeMetal Company",
    type = "fridge",
    owner = "dmc",
    position = vector3(1085.60, -2016.04, 41.48),
    size = vec2(1.00, 1.80),
    heading = 145,
    minZ = 40.48,
    maxZ = 42.88,
}
Config.Storages["dmc_converter"] = {
    label = "Convertisseur - DeMetal Company",
    type = "metal_converter",
    owner = "dmc",
    position = vector3(1111.87, -2009.54, 31.01),
    size = vec2(3.40, 3.20),
    minZ = 30.01,
    maxZ = 32.81,
    heading = 55,
}

Config.Storages["dmc_incinerator"] = {
    label = "Incinérateur - DeMetal Company",
    type = "metal_incinerator",
    owner = "dmc",
    position = vector3(1086.27, -2003.68, 31.28),
    size = vec2(4.20, 2.80),
    minZ = 30.28,
    maxZ = 32.08,
    heading = 318,
}

Config.Storages["dmc_cloackroom"] = {
    label = "Vestiaire - DeMetal Company",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(1083.18, -2014.34, 41.48),
    size = vec2(1.00, 3.80),
    minZ = 40.48,
    maxZ = 43.08,
    heading = 145,
    targetOptions = getCloakroomTargetOptions("dmc", "dmc_cloackroom"),
}

Config.Storages["dmc_armory"] = {
    label = "Armurerie - DeMetal Company",
    type = "armory",
    owner = "dmc",
    position = vector3(1071.54, -2005.44, 31.53),
    size = vec2(1.25, 1.80),
    heading = 145.38,
    minZ = 30.53,
    maxZ = 32.53,
}