local function getCloakroomTargetOptions(job, storage)
    return {
        {
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
                TriggerEvent("soz-jobs:client:try-open-cloakroom", storage, "jobs:client:fueler:OpenCloakroomMenu")
            end,
        },
        {
            color = job,
            type = "client",
            label = "Vérifier le stock",
            icon = "c:jobs/check-stock.png",
            storage = storage,
            job = job,
            canInteract = function()
                return PlayerData.job.onduty
            end,
            action = function()
                TriggerEvent("soz-jobs:client:check-cloakroom-storage", storage)
            end,
        }
    }
end

Config.Storages["oil_fridge"] = {
    label = "Frigo MTP",
    type = "fridge",
    owner = "oil",
    position = vector3(-232.84, 6080.73, 32.26),
    size = vec2(0.8, 1.6),
    heading = 45,
    offsetUpZ = 1.5,
}

Config.Storages["oil_boss_storage"] = {
    label = "Coffre patron MTP",
    type = "boss_storage",
    owner = "oil",
    position = vector3(-232.77, 6092.4, 32.26),
    size = vec2(0.8, 2.6),
    heading = 45,
    offsetUpZ = 1.1,
}

Config.Storages["oil_storage"] = {
    label = "Coffre MTP",
    type = "storage",
    owner = "oil",
    position = vector3(-250.74, 6074.15, 32.31),
    size = vec2(0.8, 5.8),
    heading = 315,
    offsetUpZ = 1.5,
}

Config.Storages["oil_tank_1"] = {
    label = "Cuve MTP",
    type = "storage_tank",
    owner = "oil",
    position = vector3(-283.83, 6054.7, 31.58),
    size = vec2(17.2, 4.8),
    heading = 45,
    offsetUpZ = 3.5,
}
Config.Storages["oil_tank_2"] = {
    label = "Cuve MTP",
    type = "storage_tank",
    owner = "oil",
    position = vector3(-288.51, 6050.11, 31.51),
    size = vec2(17.2, 4.8),
    heading = 45,
    offsetUpZ = 3.5,
}

Config.Storages["oil_cloakroom"] = {
    label = "Vestiaire - MTP",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(-231.78, 6078.43, 32.26),
    size = vec2(3.55, 3.9),
    minZ = 31.26,
    maxZ = 33.5,
    heading = 316,
    targetOptions = getCloakroomTargetOptions("oil", "oil_cloakroom"),
}
