local societyMenu = MenuV:CreateMenu(nil, "", "menu_job_garbage", "soz", "garbage:menu")

CreateThread(function()
    exports["qb-target"]:AddBoxZone("garbage:cloakroom", vector3(-596.23, -1616.31, 33.01), 0.8, 10.8,
                                    {name = "garbage:cloakroom", heading = 355, minZ = 32.01, maxZ = 35.01}, {
        options = {
            {
                targeticon = "fas fa-box",
                icon = "fas fa-tshirt",
                event = "jobs:client:garbage:OpenCloakroomMenu",
                label = "Se changer",
                job = "garbage",
            },
        },
        distance = 2.5,
    })
end)

RegisterNetEvent("jobs:client:garbage:OpenCloakroomMenu", function()
    societyMenu:AddButton({
        label = "Tenue civile",
        value = nil,
        select = function()
            TriggerEvent("soz-character:Client:ApplyCurrentClothConfig")
        end,
    })

    societyMenu:AddButton({
        label = "Tenue de travail",
        value = nil,
        select = function()
            TriggerEvent("soz-character:Client:ApplyTemporaryClothSet", GarbageConfig.Cloakroom[PlayerData.skin.Model.Hash])
        end,
    })

    societyMenu:Open()
end)
