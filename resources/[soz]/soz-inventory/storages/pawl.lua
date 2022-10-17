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

Config.Storages["pawl_log_storage"] = {
    label = "Stockage Pipe And Wooden Leg",
    type = "log_storage",
    owner = "pawl",
    position = vector3(-537.49, 5387.45, 70.54),
    size = vec2(16.6, 12.0),
    heading = 337,
    offsetUpZ = 3.0,
}

Config.Storages["pawl_plank_storage"] = {
    label = "Stockage Pipe And Wooden Leg",
    type = "plank_storage",
    owner = "pawl",
    position = vector3(-500.79, 5269.62, 80.61),
    size = vec2(35.0, 6.2),
    heading = 340,
    offsetUpZ = 2.0,
}
Config.Storages["pawl_sawdust_storage"] = {
    label = "Stockage Pipe And Wooden Leg",
    type = "sawdust_storage",
    owner = "pawl",
    position = vector3(-574.83, 5284.21, 70.27),
    size = vec2(23.0, 11.2),
    heading = 332,
    offsetUpZ = 2.0,
}

Config.Storages["pawl_storage"] = {
    label = "Stockage Pipe And Wooden Leg",
    type = "storage",
    owner = "pawl",
    position = vector3(-582.54, 5352.34, 70.21),
    size = vec2(14.8, 33.6),
    heading = 70,
    offsetUpZ = 4.0,
}

Config.Storages["pawl_log_processing"] = {
    label = "Process Pipe And Wooden Leg",
    type = "log_processing",
    owner = "pawl",
    position = vector3(-551.98, 5348.3, 74.74),
    size = vec2(0.35, 1.4),
    heading = 72,
    offsetUpZ = 1.5,
}

Config.Storages["pawl_fridge"] = {
    label = "Frigo Pipe And Wooden Leg",
    type = "fridge",
    owner = "pawl",
    position = vector3(-545.98, 5299.32, 76.37),
    size = vec2(1.6, 1.0),
    heading = 340,
    offsetUpZ = 1.5,
}

Config.Storages["pawl_armory"] = {
    label = "Armurerie Pipe And Wooden Leg",
    type = "armory",
    owner = "pawl",
    position = vector3(-541.46, 5311.12, 76.37),
    size = vec2(0.8, 2.85),
    heading = 70,
    offsetUpZ = 1.5,
}

Config.Storages["pawl_boss_storage"] = {
    label = "Stockage Patron Pipe And Wooden Leg",
    type = "boss_storage",
    owner = "pawl",
    position = vector3(-537.1, 5304.83, 76.37),
    size = vec2(1, 1.2),
    heading = 340,
    offsetUpZ = 0.0,
}

Config.Storages["pawl_cloakroom"] = {
    label = "Vestiaire - PAWL",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(-532.21, 5308.37, 76.37),
    size = vec2(0.6, 7.2),
    minZ = 75.37,
    maxZ = 78.37,
    heading = 250,
    targetOption = getCloakroomTargetOption("pawl", "pawl_cloakroom"),
}
