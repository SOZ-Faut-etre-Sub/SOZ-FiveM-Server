local function getCloakroomTargetOption(job, storage)
    return {
        color = job,
        type = "client",
        label = "Se changer",
        icon = "c:jobs/habiller.png",
        storage = storage,
        job = job,
        canInteract = function()
            return PlayerData.job.onduty
        end,
        action = function()
            TriggerEvent("soz-jobs:client:try-open-cloakroom", storage, "jobs:client:" .. job .. ":OpenCloakroomMenu")
        end,
    }
end

Config.Storages["garbage_storage"] = {
    label = "Coffre BlueBird",
    type = "storage",
    owner = "garbage",
    position = vector3(-619.88, -1617.2, 33.01),
    size = vec2(0.6, 3.4),
    heading = 355,
    offsetUpZ = 1.8,
}

Config.Storages["garbage_processing"] = {
    label = "Recycler BlueBird",
    type = "recycler_processing",
    owner = "garbage",
    position = vector3(-601.2, -1602.75, 30.4),
    size = vec2(1.2, 0.4),
    heading = 355,
    minZ = 29.4,
    maxZ = 31.0,
}

Config.Storages["garbage_fridge"] = {
    label = "Frigo BlueBird",
    type = "fridge",
    owner = "garbage",
    position = vector3(-594.91, -1620.31, 33.01),
    size = vec2(0.8, 1.6),
    heading = 355,
    offsetUpZ = 1.5,
}

Config.Storages["garbage_boss_storage"] = {
    label = "Coffre dirigeant BlueBird",
    type = "boss_storage",
    owner = "garbage",
    position = vector3(-615.57, -1624.62, 33.01),
    size = vec2(0.6, 1.4),
    heading = 355,
    offsetUpZ = 1.5,
}

Config.Storages["garbage_cloakroom"] = {
    label = "Vestiaire - BlueBird",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(-596.23, -1616.31, 33.01),
    size = vec2(0.8, 10.8),
    minZ = 32.01,
    maxZ = 35.01,
    heading = 355,
    targetOption = getCloakroomTargetOption("garbage", "garbage_cloakroom"),
}
