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
            TriggerEvent('soz-jobs:client:try-open-cloakroom', storage, job .. ':client:OpenCloakroomMenu')
        end,
    }
end

Config.Storages["lsmc_fridge"] = {
    label = "Frigo LSMC",
    type = "fridge",
    owner = "lsmc",
    position = vector3(359.68, -1419.63, 32.51),
    size = vec2(1.1, 0.8),
    heading = 320,
}

Config.Storages["lsmc_armory"] = {
    label = "Stockage des armes LSMC",
    type = "armory",
    owner = "lsmc",
    position = vector3(314.82, -1404.0, 32.51),
    size = vec2(2.8, 0.6),
    heading = 320,
    offsetUpZ = 1.6,
}

Config.Storages["lsmc_stash"] = {
    label = "Stockage des médecins",
    type = "storage",
    owner = "lsmc",
    position = vector3(316.35, -1401.84, 32.51),
    size = vec2(2.6, 0.8),
    heading = 320,
    offsetUpZ = 1.6,
}

Config.Storages["lsmc_boss_storage"] = {
    label = "Coffre Patron LSMC",
    type = "boss_storage",
    owner = "lsmc",
    position = vector3(309.07, -1422.81, 32.51),
    size = vec2(0.55, 2.55),
    heading = 320,
}

Config.Storages["lsmc_organ"] = {
    label = "Stockage des organes",
    type = "organ",
    owner = "lsmc",
    position = vector3(332.11, -1450.53, 32.51),
    size = vec2(0.6, 7.2),
    heading = 320,
}

Config.Storages["lsmc_male_cloakroom"] = {
    label = "Vestiaire pour hommes - LSMC",
    type = "cloakroom",
    owner = "lsmc",
    position = vector3(369.85, -1431.23, 32.51),
    size = vec2(3.8, 0.4),
    minZ = 31.71,
    maxZ = 34.01,
    heading = 320,
    targetOption = getCloakroomTargetOption('lsmc', 'lsmc_male_cloakroom'),
}

Config.Storages["lsmc_female_cloakroom"] = {
    label = "Vestiaire pour femmes - LSMC",
    type = "cloakroom",
    owner = "lsmc",
    position = vector3(368.92, -1430.18, 32.51),
    size = vec2(3.6, 0.4),
    minZ = 31.51,
    maxZ = 33.91,
    heading = 320,
    targetOption = getCloakroomTargetOption('lsmc', 'lsmc_female_cloakroom'),
}
