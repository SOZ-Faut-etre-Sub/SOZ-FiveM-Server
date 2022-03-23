AddEventHandler("soz-jobs:client:stonk-collect-bag", function ()
    local currentShop = exports["soz-shops"]:GetCurrentShop()
    print('sHOP', currentShop)

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
