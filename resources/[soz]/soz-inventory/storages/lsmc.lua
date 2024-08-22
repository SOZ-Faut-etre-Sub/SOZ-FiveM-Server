Config.Storages["lsmc_fridge"] = {
    label = "Frigo LSMC",
    type = "fridge",
    owner = "lsmc",
    position = vector3(387.78, -1402.00, 37.99),
    size = vec2(6.80, 0.80),
    heading = 320,
}

Config.Storages["lsmc_north_fridge"] = {
    label = "Frigo LSMC Nord",
    type = "fridge",
    owner = "lsmc",
    position = vector3(1820.94, 3677.60, 38.28),
    size = vec2(1.00, 1.60),
    heading = 300,
    minZ = 37.28,
    maxZ = 39.28,
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

Config.Storages["lsmc_north_stash"] = {
    label = "Stockage des médecins Nord",
    type = "storage",
    owner = "lsmc",
    position = vector3(1825.85, 3674.69, 33.23),
    size = vec2(1.30, 0.60),
    heading = 320,
    minZ = 32.23,
    maxZ = 34.23,
}

Config.Storages["lsmc_boss_storage"] = {
    label = "Coffre Patron LSMC",
    type = "boss_storage",
    owner = "lsmc",
    position = vector3(374.06, -1412.06, 38.04),
    size = vec2(2.60, 0.80),
    heading = 51.07,
}

Config.Storages["lsmc_north_boss_storage"] = {
    label = "Coffre Patron LSMC Nord",
    type = "boss_storage",
    owner = "lsmc",
    position = vector3(1826.23, 3674.01, 37.18),
    size = vec2(1.00, 1.20),
    heading = 29.75,
    minZ = 36.18,
    maxZ = 38.18,
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

Config.Storages["lsmc_north_organ"] = {
    label = "Stockage des organes",
    type = "organ",
    owner = "lsmc",
    position = vector3(1821.94, 3681.11, 34.38),
    size = vec2(1.00, 2.40),
    heading = 120,
    minZ = 33.38,
    maxZ = 34.18,
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

Config.Storages["lsmc_north_cloakroom"] = {
    label = "Vestiaire - LSMC Nord",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(1837.87, 3682.32, 34.28),
    size = vec2(0.75, 2.55),
    minZ = 33.28,
    maxZ = 35.28,
    heading = 299.58,
    targetOptions = getCloakroomTargetOptions("lsmc", "lsmc_north_cloakroom"),
}
