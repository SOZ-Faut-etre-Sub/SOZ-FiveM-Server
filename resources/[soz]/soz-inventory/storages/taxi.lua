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

Config.Storages["taxi_fridge"] = {
    label = "Frigo Carl'jr service",
    type = "fridge",
    owner = "taxi",
    position = vector3(891.46, -173.37, 74.7),
    size = vec2(1.4, 0.8),
    heading = 328,
    offsetUpZ = 1.8,
}

Config.Storages["taxi_storage"] = {
    label = "Stockage Carl'jr service",
    type = "storage",
    owner = "taxi",
    position = vector3(899.6, -169.36, 74.17),
    size = vec2(0.6, 6),
    heading = 238,
    offsetUpZ = 2.1,
}

Config.Storages["taxi_cloakroom"] = {
    label = "Vestiaire - Carl'jr Service",
    type = "cloakroom",
    owner = "taxi",
    position = vector3(889.1, -178.53, 74.7),
    size = vec2(0.4, 6.8),
    minZ = 73.75,
    maxZ = 75.75,
    heading = 330,
    targetOption = getCloakroomTargetOption("taxi", "taxi_cloakroom"),
}

