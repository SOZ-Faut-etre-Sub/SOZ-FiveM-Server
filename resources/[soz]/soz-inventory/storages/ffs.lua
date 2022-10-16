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

Config.Storages["ffs_storage"] = {
    label = "Stockage Fight For Style",
    type = "storage",
    owner = "ffs",
    position = vector3(710.75, -962.72, 30.4),
    size = vec2(1.4, 0.8),
    heading = 0,
    minZ = 29.4,
    maxZ = 30.65,
}

Config.Storages["ffs_boss_storage"] = {
    label = "Stockage Patron Fight For Style",
    type = "boss_storage",
    owner = "ffs",
    position = vector3(708.85, -963.2, 30.41),
    size = vec2(0.2, 1.6),
    heading = 0,
    minZ = 29.41,
    maxZ = 30.86,
}

Config.Storages["ffs_fridge"] = {
    label = "Frigo - Fight For Style",
    type = "fridge",
    owner = "ffs",
    position = vector3(705.28, -961.63, 30.4),
    size = vec2(0.25, 1.1),
    heading = 0,
    minZ = 29.4,
    maxZ = 31.4,
}

Config.Storages["ffs_cloakroom"] = {
    label = "Vestiaire - FFS",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(706.41, -959.03, 30.4),
    size = vec2(0.5, 4.25),
    minZ = 29.4,
    maxZ = 31.6,
    heading = 0,
    targetOption = getCloakroomTargetOption("ffs", "ffs_cloakroom"),
}
