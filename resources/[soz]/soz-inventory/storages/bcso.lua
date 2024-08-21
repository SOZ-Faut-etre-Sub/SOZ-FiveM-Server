Config.Storages["bcso_fridge"] = {
    label = "Frigo BCSO",
    type = "fridge",
    owner = "bcso",
    position = vector3(1856.79, 3693.02, 37.97),
    size = vec2(1.5, 1.5),
    heading = 302.0,
    offsetUpZ = 1.5,
}

Config.Storages["bcso_armory"] = {
    label = "Armurerie BCSO",
    type = "armory",
    owner = "bcso",
    position = vector3(1859.58, 3690.44, 34.27),
    size = vec2(2.5, 1.5),
    heading = 245.0,
    offsetUpZ = 1.5,
}

Config.Storages["bcso_seizure1"] = {
    label = "Saisie BCSO",
    type = "seizure",
    owner = "bcso",
    position = vector3(1849.40, 3694.20, 30.27),
    size = vec2(3.80, 5.20),
    heading = 120.0,
}

Config.Storages["bcso_seizure2"] = {
    label = "Saisie BCSO",
    type = "seizure",
    owner = "bcso",
    position = vector3(1842.50, 3689.75, 30.27),
    size = vec2(6.20, 3.20),
    heading = 30.0,
}

Config.Storages["bcso_seizure3"] = {
    label = "Saisie BCSO",
    type = "seizure",
    owner = "bcso",
    position = vector3(1840.28, 3694.13, 30.27),
    size = vec2(3.40, 3.50),
    heading = 30.0,
}

Config.Storages["bcso_boss_storage"] = {
    label = "Coffre Capitaine BCSO",
    type = "boss_storage",
    owner = "bcso",
    position = vector3(1853.46, 3687.07, 38.2),
    size = vec2(1.5, 1.5),
    heading = 125.0,
    offsetUpZ = 1.0,
}

Config.Storages["bcso_storage"] = {
    label = "Coffre BCSO",
    type = "storage",
    owner = "bcso",
    position = vector3(1854.96, 3695.17, 30.08),
    size = vec2(1.5, 3.0),
    heading = 28.0,
    offsetUpZ = 1.5,
}

Config.Storages["bcso_evidence_storage"] = {
    label = "Coffre de preuves BCSO",
    type = "evidence_storage",
    owner = "bcso",
    position = vector3(1847.09, 3691.61, 34.27),
    size = vec2(2.0, 1.80),
    heading = 208.54,
}

Config.Storages["bcso_ammo"] = {
    label = "Munition BCSO",
    type = "ammo",
    owner = "bcso",
    position = vector3(1858.19, 3699.86, 30.27),
    size = vec2(2.8, 0.4),
    heading = 30.0,
    offsetUpZ = 2.0,
}

Config.Storages["bcso_cloakroom"] = {
    label = "Vestiaire - BCSO",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(1847.27, 3693.85, 34.27),
    size = vec2(8.0, 3.6),
    minZ = 33.27,
    maxZ = 35.27,
    heading = 300,
    targetOptions = getCloakroomTargetOptions("bcso", "bcso_cloakroom", "soz-core:client:police:OpenCloakroomMenu"),
}
