local QBCore = exports["qb-core"]:GetCoreObject()

local PoleMenu = MenuV:CreateMenu(nil, "Le menu de métal", "menu_pole", "soz", "job-panel")

exports["qb-target"]:AddBoxZone("pole emploi", vector3(236.46, -409.33, 47.92), 1, 1, {
    name = "pole emploi",
    heading = 0,
    debugPoly = false,
}, {
    options = {
        {
            type = "client",
            event = "jobs:pole:menu",
            icon = "fas fa-sign-in-alt",
            label = "information pôle emploi",
            job = "unemployed",
        },
    },
    distance = 2.5,
})

-- function general au job pole emploi

function DeleteVehicule(vehicule)
    SetEntityAsMissionEntity(vehicule, true, true)
    DeleteVehicle(vehicule)
end

