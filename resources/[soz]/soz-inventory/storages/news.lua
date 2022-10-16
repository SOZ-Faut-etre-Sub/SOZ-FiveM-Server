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

Config.Storages["news_fridge"] = {
    label = "Frigo du Twitch News",
    type = "fridge",
    owner = "news",
    position = vector3(-562.00, -937.72, 32.32),
    heading = 270.0,
    offsetUpZ = 2.0,
}

Config.Storages["news_storage"] = {
    label = "Stockage du Twitch News",
    type = "storage",
    owner = "news",
    position = vector3(-556.57, -915.31, 33.22),
    size = vec2(5.0, 0.5),
    offsetUpZ = 1.5,
}

Config.Storages["news_boss_storage"] = {
    label = "Coffre patron",
    type = "boss_storage",
    owner = "news",
    position = vector3(-572.00, -939.91, 28.82),
    size = vec2(1.0, 2.5),
}

Config.Storages["news_cloakroom"] = {
    label = "Vestiaire - Twitch News",
    type = "cloakroom",
    owner = "news",
    position = vector3(-568.22, -935.54, 33.76),
    size = vec2(0.65, 3.75),
    minZ = 32.76,
    maxZ = 35.76,
    heading = 90,
    targetOption = getCloakroomTargetOption("news", "news_cloakroom"),
}
