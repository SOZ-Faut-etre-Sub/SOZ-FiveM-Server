local luxuryDealershipNamespace = "luxury_dealership_menu"
function displayBidMenu(menu, bid)
    menu:ClearItems()

    local bidDescription
    if bid.bestBidPrice then
        bidDescription = "Meilleure offre: " .. bid.bestBidName .. " - $" .. QBCore.Shared.GroupDigits(bid.bestBidPrice)
    else
        bidDescription = "Mise à prix: $" .. QBCore.Shared.GroupDigits(bid.minimumBidPrice)
    end

    local bidAction = menu:AddButton({label = "Faire une enchère", description = bidDescription, value = 0})

    bidAction:On("select", function()
        local price = exports["soz-hud"]:Input("Montant", 10) or ""
        if price == nil or tonumber(price) == nil then
            exports["soz-hud"]:DrawNotification("Vous devez spécifier un montant.", "error")
            return
        end

        price = math.floor(tonumber(price))
        if price <= (bid.bestBidPrice or (bid.minimumBidPrice - 1)) then
            exports["soz-hud"]:DrawNotification(
                "Le montant doit être supérieur à $" .. QBCore.Shared.GroupDigits(bid.bestBidPrice or bid.minimumBidPrice) .. ".", "error")
            return
        end

        QBCore.Functions.TriggerCallback("soz-dealership:server:BidAuction", function(success, reason)
            if success then
                exports["soz-hud"]:DrawNotification("Vous avez enchéri de ~g~$" .. QBCore.Shared.GroupDigits(price) .. ".")
                menu:Close()
            else
                exports["soz-hud"]:DrawNotification(reason, "error")
            end
        end, bid.model, price)
    end)

    if not menu.IsOpen then
        menu:Open()
    end

    CreateThread(function()
        Wait(100)
        while menu.IsOpen do
            -- Check the vehicle distance
            local vehicleDistance = #(GetEntityCoords(PlayerPedId()) - bid.pos.xyz)
            if vehicleDistance > 5.75 then
                menu:Close()
                return
            end
            -- Check the bid
            local lastBid = QBCore.Functions.TriggerRpc("soz-dealership:server:GetAuction", bid.model)
            if lastBid.bestBidPrice ~= bid.bestBidPrice then
                displayBidMenu(menu, lastBid)
                return
            end
            Wait(1000)
        end
    end)
end

RegisterNetEvent("soz-dealership:client:DisplayBidMenu", function(data)
    local bid = QBCore.Functions.TriggerRpc("soz-dealership:server:GetAuction", data.model)
    MenuV:DeleteNamespace(luxuryDealershipNamespace)

    local menu = MenuV:CreateMenu(nil, bid.name, "menu_shop_vehicle_car", "soz", luxuryDealershipNamespace)
    displayBidMenu(menu, bid)
end)

local function spawnVehicle(vehicle)
    local model = GetHashKey(vehicle.model)

    if not IsModelInCdimage(model) then
        return
    end

    RequestModel(model)
    while not HasModelLoaded(model) do
        Citizen.Wait(10)
    end

    local vehiclePosition = vehicle.pos
    local createdVehicle = CreateVehicle(model, vehiclePosition.x, vehiclePosition.y, vehiclePosition.z, vehiclePosition.w, false, false)

    SetEntityInvincible(createdVehicle, true)
    SetVehicleDirtLevel(createdVehicle, 0)
    FreezeEntityPosition(createdVehicle, true)
    SetVehicleNumberPlateText(createdVehicle, "LUXURY")

    exports["qb-target"]:AddBoxZone(vehicle.window.options.name, vehicle.window.pos, vehicle.window.length, vehicle.window.width, vehicle.window.options, {
        options = {
            {
                type = "client",
                event = "soz-dealership:client:DisplayBidMenu",
                icon = "c:dealership/bid.png",
                label = "Voir la vente",
                model = vehicle.model,
                canInteract = function()
                    return PlayerData.metadata.canBid
                end,
            },
        },
        distance = 1.0,
    })
end

AddEventHandler("onClientResourceStart", function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then
        return
    end

    QBCore.Functions.CreateBlip("luxury:dealership", {
        name = LuxuryDealershipConfig.blip.name,
        coords = LuxuryDealershipConfig.blip.coords,
        sprite = LuxuryDealershipConfig.blip.sprite,
        color = LuxuryDealershipConfig.blip.color,
    })
    local vehicles = QBCore.Functions.TriggerRpc("soz-dealership:server:GetAuctions")
    for _, vehicle in pairs(vehicles) do
        spawnVehicle(vehicle)
    end
end)
