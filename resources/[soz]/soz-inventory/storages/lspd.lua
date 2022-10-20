Config.Storages["lspd_fridge"] = {
    label = "Frigo LSPD",
    type = "fridge",
    owner = "lspd",
    position = vector3(599.230713, -10.196113, 81.767494),
    size = vec2(1.5, 1.5),
    heading = 160.0,
    offsetUpZ = 2.5,
}

Config.Storages["lspd_armory"] = {
    label = "Armurerie LSPD",
    type = "armory",
    owner = "lspd",
    position = vector3(609.05, -15.12, 76.81),
    size = vec2(2.0, 2.5),
    heading = 170.0,
    offsetUpZ = 2.5,
}

Config.Storages["lspd_seizure"] = {
    label = "Saisie LSPD",
    type = "seizure",
    owner = "lspd",
    position = vector3(617.77, -12.12, 76.73),
    size = vec2(6.0, 6.0),
    heading = 260,
}

Config.Storages["lspd_boss_storage"] = {
    label = "Coffre Capitaine LSPD",
    type = "boss_storage",
    owner = "lspd",
    position = vector3(625.466919, -31.868540, 90.308548),
    size = vec2(2.5, 1.0),
    heading = 255,
}

Config.Storages["lspd_storage"] = {
    label = "Coffre LSPD",
    type = "storage",
    owner = "lspd",
    position = vector3(615.95, -15.24, 90.5),
    size = vec2(2.5, 6.5),
    heading = 160,
    offsetUpZ = 2.5,
}

Config.Storages["lspd_ammo"] = {
    label = "Munition LSPD",
    type = "ammo",
    owner = "lspd",
    position = vector3(608.31, -6.02, 76.63),
    size = vec2(0.6, 2.8),
    heading = 350,
    offsetUpZ = 2.0,
}

Config.Storages["lspd_male_cloakroom"] = {
    label = "Vestiaire pour hommes - LSPD",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(626.93, 2.18, 76.63),
    size = vec2(7.0, 8.4),
    minZ = 75.62,
    maxZ = 78.62,
    heading = 350,
    targetOptions = getCloakroomTargetOptions("lspd", "lspd_male_cloakroom", "police:client:OpenCloakroomMenu"),
}

Config.Storages["lspd_female_cloakroom"] = {
    label = "Vestiaire pour femmes - LSPD",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(624.58, -5.48, 76.63),
    size = vec2(6.8, 6.4),
    minZ = 75.62,
    maxZ = 78.62,
    heading = 350,
    targetOptions = getCloakroomTargetOptions("lspd", "lspd_female_cloakroom", "police:client:OpenCloakroomMenu"),
}
