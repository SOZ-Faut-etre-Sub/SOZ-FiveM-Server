Config.Storages["lsmc_fridge"] = {
    label = "Frigo LSMC",
    type = "fridge",
    owner = "lsmc",
    position = vector3(387.78, -1402.00, 37.99),
    size = vec2(6.80, 0.80),
    heading = 320,
}

Config.Storages["lsmc_armory"] = {
    label = "Stockage des armes LSMC",
    type = "armory",
    owner = "lsmc",
    position = vector3(391.75, -1427.29, 29.43),
    size = vec2(1.00, 4.60),
    heading = 320,
    minZ = 28.43,
    maxZ = 30.43,
}

Config.Storages["lsmc_stash"] = {
    label = "Stockage des médecins",
    type = "storage",
    owner = "lsmc",
    position = vector3(377.00, -1391.75, 37.99),
    size = vec2(1.10, 5.60),
    heading = 320,
}

Config.Storages["lsmc_boss_storage"] = {
    label = "Coffre Patron LSMC",
    type = "boss_storage",
    owner = "lsmc",
    position = vector3(374.06, -1412.06, 38.04),
    size = vec2(2.60, 0.80),
    heading = 51.07,
}

Config.Storages["lsmc_organ"] = {
    label = "Stockage des organes",
    type = "organ",
    owner = "lsmc",
    position = vector3(367.90, -1417.04, 32.51),
    size = vec2(0.80, 3.20),
    heading = 230,
    minZ = 31.51,
    maxZ = 32.51,
}

Config.Storages["lsmc_male_cloakroom"] = {
    label = "Vestiaire pour hommes - LSMC",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(365.05, -1391.05, 37.99),
    size = vec2(0.80, 4.00),
    minZ = 36.99,
    maxZ = 38.99,
    heading = 49.35,
    targetOptions = getCloakroomTargetOptions("lsmc", "lsmc_male_cloakroom"),
}

Config.Storages["lsmc_female_cloakroom"] = {
    label = "Vestiaire pour femmes - LSMC",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(356.14, -1384.64, 37.99),
    size = vec2(0.80, 5.60),
    minZ = 36.99,
    maxZ = 38.99,
    heading = 49.61,
    targetOptions = getCloakroomTargetOptions("lsmc", "lsmc_female_cloakroom"),
}
