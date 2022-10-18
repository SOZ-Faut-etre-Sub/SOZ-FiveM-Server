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
                TriggerEvent("soz-jobs:client:try-open-cloakroom", storage, "jobs:client:" .. job .. ":OpenCloakroomMenu")
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

Config.Storages["stonk_fridge"] = {
    label = "Frigo STONK Depository",
    type = "fridge",
    owner = "cash-transfer",
    position = vector3(-10.0, -700.62, 46.25),
    size = vector2(1.5, 1.5),
    heading = 204.6,
}

Config.Storages["stonk_storage"] = {
    label = "Stockage STONK Depository",
    type = "storage",
    owner = "cash-transfer",
    position = vector3(-6.17, -706.95, 40.72),
    size = vector2(1.0, 3.0),
    heading = 235.7,
}

Config.Storages["stonk_boss_storage"] = {
    label = "Coffre patron",
    type = "boss_storage",
    owner = "cash-transfer",
    position = vector3(-3.38, -703.02, 40.7),
    size = vector2(1.0, 3.0),
    heading = 235.7,
}

Config.Storages["stonk_armory"] = {
    label = "Armurerie STONK Depository",
    type = "armory",
    owner = "cash-transfer",
    position = vector3(-17.64, -716.12, 46.02),
    size = vector2(2.2, 3.8),
    heading = 25.0,
}

Config.Storages["stonk_ammo"] = {
    label = "Munition STONK Depository",
    type = "ammo",
    owner = "cash-transfer",
    position = vector3(-16.0, -714.38, 46.02),
    size = vector2(2.0, 0.6),
    heading = 25.0,
}

Config.Storages["stonk_cloakroom_1"] = {
    label = "Vestiaire - STONK Depository",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(-24.1, -708.6, 46.0),
    size = vec2(0.8, 8.0),
    minZ = 45.0,
    maxZ = 47.2,
    heading = 295,
    targetOptions = getCloakroomTargetOptions("stonk", "stonk_cloakroom_1"),
}

Config.Storages["stonk_cloakroom_2"] = {
    label = "Vestiaire - STONK Depository",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(-20.75, -706.325, 46.0),
    size = vec2(0.8, 8.0),
    minZ = 45.0,
    maxZ = 47.2,
    heading = 295,
    targetOptions = getCloakroomTargetOptions("stonk", "stonk_cloakroom_2"),
}
