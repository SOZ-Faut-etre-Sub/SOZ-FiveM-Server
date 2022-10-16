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
            TriggerEvent("soz-jobs:client:try-open-cloakroom", storage, job .. ":client:OpenCloakroomMenu")
        end,
    }
end

Config.Storages["upw_fridge"] = {
    label = "Unexptected Power and Water",
    type = "fridge",
    owner = "upw",
    position = vector3(592.62, 2770.33, 41.86),
    size = vec2(1.0, 1.0),
    heading = 274,
    offsetUpZ = 1.5,
}

Config.Storages["upw_stash"] = {
    label = "Unexptected Power and Water",
    type = "storage",
    owner = "upw",
    position = vector3(599.6, 2757.35, 41.86),
    size = vec2(2.4, 0.4),
    heading = 4,
    minZ = 40.86,
    maxZ = 42.86,
}

Config.Storages["upw_boss_storage"] = {
    label = "Unexptected Power and Water",
    type = "boss_storage",
    owner = "upw",
    position = vector3(600.66, 2760.11, 47.76),
    size = vec2(0.6, 2.55),
    heading = 4,
}

Config.Storages["upw_cloakroom_1"] = {
    label = "Vestiaire - UPW",
    type = "cloakroom",
    owner = "upw",
    position = vector3(585.13, 2747.34, 41.86),
    size = vec2(1.2, 4.4),
    minZ = 40.86,
    maxZ = 43.86,
    heading = 4,
    targetOption = getCloakroomTargetOption("upw", "upw_cloakroom_1"),
}

Config.Storages["upw_cloakroom_2"] = {
    label = "Vestiaire - UPW",
    type = "cloakroom",
    owner = "upw",
    position = vector3(577.8, 2747.03, 41.86),
    size = vec2(1.0, 5.0),
    minZ = 40.86,
    maxZ = 43.86,
    heading = 4,
    targetOption = getCloakroomTargetOption("upw", "upw_cloakroom_2"),
}
