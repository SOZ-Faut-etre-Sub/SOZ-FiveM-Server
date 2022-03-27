-- BAG COLLECTION
local collectedBags = 0
local function CollectBags(currentShop, nBags)
    if nBags < 1 then
        Citizen.Wait(500)
        exports["soz-hud"]:DrawNotification(string.format("Vous avez collecté ~g~%d sacs d'argent", collectedBags))
        CollectedShops[currentShop]["last-collection"] = exports["soz-jobs"]:GetTimestamp()
        return
    end

    QBCore.Functions.Progressbar("stonk-collect-bag", "Vous collectez 1 sac d'argent", StonkConfig.Collection.Duration, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = false,
        disableMouse = false,
        disableCombat = false,
    }, {}, {}, {}, function(wasCancelled)
        if not wasCancelled then
            TriggerServerEvent("soz-jobs:server:stonk-collect-bag", currentShop)
            collectedBags = collectedBags + 1
            local remaining = nBags - 1
            CollectedShops[currentShop]["remaining-bags"] = remaining
            CollectBags(currentShop, remaining)
        else
            exports["soz-hud"]:DrawNotification("~r~Vous n'avez pas collecté les sacs d'argent")
        end
    end)
end

AddEventHandler("soz-jobs:client:stonk-collect-bag", function()
    Citizen.CreateThread(function()
        local currentShop = exports["soz-shops"]:GetCurrentShop()

        local nBags

        local shop = CollectedShops[currentShop]
        if shop then
            if type(shop["remaining-bags"]) == "number" and shop["remaining-bags"] > 0 then
                nBags = shop["remaining-bags"]
            end
        else
            CollectedShops[currentShop] = {}
        end

        if not nBags then
            local range = StonkConfig.Collection.Range
            nBags = math.random(range.min, range.max)
        end

        CollectedShops[currentShop]["remaining-bags"] = nBags
        collectedBags = 0
        CollectBags(currentShop, nBags)
    end)
end)

-- BAG RESALE
local playerInsideZone = false
Citizen.CreateThread(function()
    local ResaleZone = BoxZone:Create(vector3(-20.78, -709.35, 39.73), 224.0, 14.5, {
        name = "stonk_resale",
        heading = 25.0,
        minZ = 39.8,
        maxZ = 43.8,
    })

    ResaleZone:onPlayerInOut(function(isInside)
        playerInsideZone = isInside
    end)

    for _, modelHash in ipairs(StonkConfig.Resale.TargetEntities) do
        exports["qb-target"]:AddTargetModel(modelHash, {
            options = {
                {
                    event = "soz-jobs:client:stonk-resale-bag",
                    icon = "fas fa-dollar-sign",
                    label = "Déposer des sacs d'argent",
                    canInteract = function()
                        return playerInsideZone and CanBagsBeResold()
                    end,
                },
            },
            distance = 2.5,
        })
    end
end)

local bagsSold = 0
local function ResaleBags()

    local function DisplayBagsSold(count)
        exports["soz-hud"]:DrawNotification(string.format("~g~Vous avez déposé ~g~%d sacs d'argent", tonumber(count)))
    end

    if not QBCore.Functions.HasItem(StonkConfig.Collection.BagItem) then
        if bagsSold > 0 then
            DisplayBagsSold(bagsSold)
            return
        else
            exports["soz-hud"]:DrawNotification("~r~Vous n'avez pas de sacs d'argent sur vous")
            return
        end
    end

    QBCore.Functions.Progressbar("stonk-resale-bag", "Vous déposez 1 sac d'argent", StonkConfig.Resale.Duration, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = false,
        disableMouse = false,
        disableCombat = false,
    }, {}, {}, {}, function(wasCancelled)
        if not wasCancelled then
            TriggerServerEvent("soz-jobs:server:stonk-resale-bag")
            bagsSold = bagsSold + 1
            ResaleBags()
        else
            if bagsSold > 0 then
                DisplayBagsSold(bagsSold)
            else
                exports["soz-hud"]:DrawNotification("~r~Vous n'avez pas déposé les sacs d'argent")
            end
        end
    end)
end

AddEventHandler("soz-jobs:client:stonk-resale-bag", function()
    bagsSold = 0
    ResaleBags()
end)
