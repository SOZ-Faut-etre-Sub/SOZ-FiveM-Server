Config.Storages["oil_fridge"] = {
    label = "Frigo MTP",
    type = "fridge",
    owner = "oil",
    position = vector3(-240.68, 6076.91, 40.57),
    size = vec2(1.10, 1.00),
    heading = 315,
}

Config.Storages["oil_boss_storage"] = {
    label = "Coffre patron MTP",
    type = "boss_storage",
    owner = "oil",
    position = vector3(-247.70, 6066.21, 40.57),
    size = vec2(0.60, 2.45),
    heading = 315,
    offsetUpZ = 0,
}

Config.Storages["oil_storage"] = {
    label = "Coffre MTP",
    type = "storage",
    owner = "oil",
    position = vector3(-235.35, 6075.13, 40.57),
    size = vec2(0.60, 3.05),
    heading = 45,
}

Config.Storages["oil_tank_1"] = {
    label = "Cuve MTP",
    type = "storage_tank",
    owner = "oil",
    position = vector3(-283.67, 6054.67, 31.35),
    size = vec2(17.20, 4.40),
    heading = 225,
    offsetUpZ = 3.5,
}
Config.Storages["oil_tank_2"] = {
    label = "Cuve MTP",
    type = "storage_tank",
    owner = "oil",
    position = vector3(-289.25, 6048.79, 31.35),
    size = vec2(17.20, 4.80),
    heading = 225,
    offsetUpZ = 3.5,
}

Config.Storages["oil_male_cloakroom"] = {
    label = "Vestiaire - MTP",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(-236.93, 6085.69, 31.39),
    size = vec2(6.40, 4.20),
    minZ = 30.39,
    maxZ = 33.39,
    heading = 315,
    targetOptions = getCloakroomTargetOptions("oil", "oil_male_cloakroom", "jobs:client:fueler:OpenCloakroomMenu"),
}

Config.Storages["oil_female_cloakroom"] = {
    label = "Vestiaire - MTP",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(-233.61, 6082.43, 31.39),
    size = vec2(6.40, 4.20),
    minZ = 30.39,
    maxZ = 33.39,
    heading = 315,
    targetOptions = getCloakroomTargetOptions("oil", "oil_female_cloakroom", "jobs:client:fueler:OpenCloakroomMenu"),
}
