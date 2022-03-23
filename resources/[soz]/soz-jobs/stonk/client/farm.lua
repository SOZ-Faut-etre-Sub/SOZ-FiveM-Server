-- BAG COLLECTION
AddEventHandler("soz-jobs:client:stonk-collect-bag", function ()
    local currentShop = exports["soz-shops"]:GetCurrentShop()

    TriggerEvent(
        "progressbar:client:progress",
        {
            name = "stonk-collect-bag",
            duration = StonkConfig.CollectionDuration,
            label = "Vous collectez les sacs d'argent",
            controlDisables = {
                disableMovement = false,
                disableCarMovement = false,
                disableMouse = false,
                disableCombat = false,
            },
        },
        function (wasCancelled)
            if not wasCancelled then
                TriggerServerEvent("soz-jobs:server:stonk-collect-bag", currentShop)
            else
                exports["soz-hud"]:DrawNotification("~r~Vous n'avez pas collecté les sacs d'argent")
            end
        end
    )
end)

RegisterNetEvent("soz-jobs:client:stonk-save-bag-collection", function(shopId)
    CollectedShops[shopId] = exports["soz-jobs"]:GetTimestamp()
end)


-- BAG RESALE
local playerInsideZone = false
Citizen.CreateThread(function()
    local ResaleZone = BoxZone:Create(vector3(-20.78, -709.35, 39.73), 224.0, 14.5, {name = "stonk_resale", heading = 25.0, minZ = 39.8, maxZ = 43.8})

    ResaleZone:onPlayerInOut(function (isInside)
        playerInsideZone = isInside
    end)

    for _, modelHash in ipairs(StonkConfig.Resale.TargetEntities) do
        exports["qb-target"]:AddTargetModel(modelHash, {
            options = {
                {
                    event = "soz-jobs:client:stonk-resale-bag",
                    icon = "fas fa-dollar-sign",
                    label = "Déposer des sacs d'argent",
                    canInteract = function ()
                        return PlayerData.job.onduty and playerInsideZone
                    end
                }
            },
            distance = 2.5,
        })
    end
end)

AddEventHandler("soz-jobs:client:stonk-resale-bag", function ()
    -- TODO
end)
