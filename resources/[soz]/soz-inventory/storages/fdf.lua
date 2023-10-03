Config.Storages["fdf_fridge"] = {
    label = "Ferme de Fou",
    type = "fridge",
    owner = "fdf",
    position = vector3(2439.95, 4974.12, 46.81),
    size = vec2(1.0, 1.0),
    heading = 225.3,
    offsetUpZ = 1.5,
}

Config.Storages["fdf_fridge2"] = {
    label = "Ferme de Fou",
    type = "fridge",
    owner = "fdf",
    position = vector3(2441.24, 4980.16, 46.81),
    size = vec2(1.0, 1.0),
    heading = 223.53,
    offsetUpZ = 2.0,
}

Config.Storages["fdf_stash"] = {
    label = "Ferme de Fou",
    type = "storage",
    owner = "fdf",
    position = vector3(2529.21, 4980.51, 45.36),
    size = vec2(3.80, 7.80),
    heading = 224.77,
    minZ = 44.36,
    maxZ = 46.36,
}

Config.Storages["fdf_boss_storage"] = {
    label = "Ferme de Fou",
    type = "boss_storage",
    owner = "fdf",
    position = vector3(2438.33, 4966.09, 46.81),
    size = vec2(1.00, 2.40),
    heading = 47.37,
    minZ = 45.81,
    maxZ = 47.81,
}

Config.Storages["fdf_cloakroom_1"] = {
    label = "Vestiaire - FDF",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(2434.21, 5011.35, 46.99),
    size = vec2(0.60, 2.20),
    minZ = 45.99,
    maxZ = 47.99,
    heading = 314.41,
    targetOptions = getCloakroomTargetOptions("fdf", "fdf_cloakroom_1"),
}
