Config.Storages["lscs_storage"] = {
    label = "Coffre LSCS",
    type = "trunk",
    owner = "lscs",
    position = vector3(443.83, -974.49, 30.69),
    size = vec2(0.8, 3.2),
    heading = 180.77,
    minZ = 29.69,
    maxZ = 31.69,
}

Config.Storages["lscs_cloakroom"] = {
    label = "Vestiaire - LSCS",
    type = "cloakroom",
    owner = "lscs",
    position = vector3(451.38, -994.47, 30.69),
    size = vec2(1.2, 5.0),
    heading = -0.10,
    minZ = 29.69,
    maxZ = 31.69,
    targetOptions = getCloakroomTargetOptions("lscs", "lscs_cloakroom", "soz-core:client:police:OpenCloakroomMenu"),
}
