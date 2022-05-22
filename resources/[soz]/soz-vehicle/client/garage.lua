local OutsideVehicles = {}

local GarageTypes
AddEventHandler("onClientResourceStart", function(resourceName)
    if (GetCurrentResourceName() == resourceName) then
        GarageTypes = {
            ["public"] = {
                type = "public",
                zones = Zonespublic,
                menu = MenuV:CreateMenu(nil, nil, "menu_garage_public", "soz", "parkingpublic:vehicle:car"),
                submenu = nil,
                excludeVehClass = {14, 15, 16},
                state = 1,
                places = PlacesPublic,
            },
            ["private"] = {
                type = "private",
                zones = Zonesprives,
                menu = MenuV:CreateMenu(nil, nil, "menu_garage_private", "soz", "parkingprive:vehicle:car"),
                submenu = nil,
                excludeVehClass = {14, 15, 16},
                state = 1,
                places = PlacesPrives,
            },
            ["depot"] = {
                type = "depot",
                zones = Zonesfourriere,
                menu = MenuV:CreateMenu(nil, nil, "menu_garage_pound", "soz", "parkingfourriere:vehicle:car"),
                submenu = nil,
                excludeVehClass = {},
                state = 2,
                places = PlacesFourriere,
            },
            ["entreprise"] = {
                type = "entreprise",
                zones = Zonesentreprise,
                menu = MenuV:CreateMenu(nil, nil, "menu_garage_entreprise", "soz", "parkingentreprise:vehicle:car"),
                submenu = nil,
                excludeVehClass = {14, 16},
                state = 3,
                places = PlacesEntreprise,
            },
        }

        GarageTypes.public.submenu = MenuV:InheritMenu(GarageTypes.public.menu, {Title = nil})
        GarageTypes.private.submenu = MenuV:InheritMenu(GarageTypes.private.menu, {Title = nil})
        GarageTypes.depot.submenu = MenuV:InheritMenu(GarageTypes.depot.menu, {Title = nil})
        GarageTypes.entreprise.submenu = MenuV:InheritMenu(GarageTypes.entreprise.menu, {Title = nil})
    end
end)

local function GetGarageType(type_)
    if GarageTypes[type_] and type(GarageTypes[type_]) == "table" then
        return GarageTypes[type_]
    end
    error(string.format("Invalid GarageType: %s", type_))
end

---Return vehicle's data that are available client-side only
---@param veh number Vehicle entity
---@return table
local function GetVehicleClientData(veh)
    return {
        fuel = GetVehicleFuelLevel(veh),
        properties = json.encode(QBCore.Functions.GetVehicleProperties(veh)),
    }
end

-- Functions

local function round(num, numDecimalPlaces)
    return tonumber(string.format("%." .. (numDecimalPlaces or 0) .. "f", num))
end

local function GenerateVehicleList(result, garage, indexgarage, garageType, time)
    if result == nil then
        exports["soz-hud"]:DrawNotification(Lang:t("error.no_vehicles"), "error")
        return
    end

    for _, v in pairs(result) do
        local enginePercent = round(v.engine / 10, 0)
        local bodyPercent = round(v.body / 10, 0)
        local currentFuel = v.fuel
        local vname = GetLabelText(GetDisplayNameFromVehicleModel(v.vehicle))

        local price
        if garageType.type == "private" then
            local timediff = math.floor((time - v.parkingtime) / 3600)
            price = timediff * 20
            if price > 200 then
                price = 200
            end
        elseif garageType.type == "depot" then
            price = v.depotprice
        end

        if v.state == garageType.state then
            garageType.submenu:AddButton({
                label = Lang:t(string.format("menu.header.%s", garageType.type), {
                    value = vname,
                    value2 = v.plate,
                    value3 = price,
                }),
                description = Lang:t("menu.text.garage", {
                    value = currentFuel,
                    value2 = enginePercent,
                    value3 = bodyPercent,
                }),
                select = function()
                    garageType.submenu:Close()
                    if garageType.type == "depot" then
                        TriggerServerEvent("qb-garage:server:PayDepotPrice", v, garageType.type, garage, indexgarage)
                    elseif garageType.type == "private" then
                        TriggerEvent("qb-garages:client:TakeOutPrive", v, garageType.type, garage, indexgarage, price)
                    else
                        TriggerEvent("qb-garages:client:takeOutGarage", v, garageType.type, garage, indexgarage)
                    end
                end,
            })
        end
    end
end

local function SortirMenu(type_, garage, indexgarage)
    local garageType = GetGarageType(type_)

    garageType.submenu:ClearItems()

    if type_ ~= "depot" then
        garageType.submenu:AddButton({
            icon = "◀",
            label = "Retour au menu",
            value = garageType.menu,
            select = function()
                garageType.submenu:Close()
            end,
        })
    end
    garageType.submenu:Open()

    if type_ == "entreprise" then
        QBCore.Functions.TriggerCallback("qb-garage:server:GetPlayerEntreprise", function(result)
            GenerateVehicleList(result, garage, indexgarage, garageType)
        end, PlayerJob.id)
    else
        QBCore.Functions.TriggerCallback("qb-garage:server:GetGarageVehicles", function(result, time)
            GenerateVehicleList(result, garage, indexgarage, garageType, time)
        end, indexgarage, type_, garage.vehicle)
    end
end

RegisterNetEvent("qb-garages:client:takeOutGarage", function(vehicle, type_, garage, indexgarage)
    local spawn = false

    if type_ == "depot" then
        local VehExists = DoesEntityExist(OutsideVehicles[vehicle.plate])
        if not VehExists then
            spawn = true
        else
            exports["soz-hud"]:DrawNotification(Lang:t("error.not_impound"), "error")
            spawn = false
        end
    else
        spawn = true
    end

    if spawn then
        local garageType = GetGarageType(type_)

        local currentFuel = vehicle.fuel
        local location
        local heading
        local placedispo = 0

        for _, place in pairs(garageType.places) do
            if place.data.indexGarage == indexgarage then
                local vehicles2 = GetGamePool("CVehicle")
                local inside = false
                for _, vehicle2 in ipairs(vehicles2) do
                    if place:isPointInside(GetEntityCoords(vehicle2)) then
                        inside = true
                    end
                end
                if inside == false then
                    placedispo = placedispo + 1
                    location = place:getBoundingBoxCenter()
                    heading = place:getHeading()
                end
            end
        end

        if placedispo == 0 then
            exports["soz-hud"]:DrawNotification("Déjà une voiture sur un des parking", "primary", 4500)

            return
        end

        local canTakeOutVehicle = QBCore.Functions.TriggerRpc("qb-garage:server:CanTakeOutVehicle", vehicle.plate)

        if not canTakeOutVehicle then
            exports["soz-hud"]:DrawNotification("Le véhicule a déjà été sorti.", "error", 4500)

            return
        end

        local newlocation = vec4(location.x, location.y, location.z, heading)

        QBCore.Functions.SpawnVehicle(vehicle.vehicle, function(veh)
            local properties = QBCore.Functions.TriggerRpc("qb-garage:server:GetVehicleProperties", vehicle.plate)
            if vehicle.plate then
                OutsideVehicles[vehicle.plate] = veh
            end
            QBCore.Functions.SetVehicleProperties(veh, properties)
            SetVehicleNumberPlateText(veh, vehicle.plate)
            SetFuel(veh, currentFuel + 0.0)
            TriggerServerEvent("qb-garage:server:updateVehicleState", 0, vehicle.plate, vehicle.garage)
            TriggerServerEvent("qb-garage:server:updateVehicleCitizen", vehicle.plate)
            TriggerEvent("vehiclekeys:client:SetOwner", QBCore.Functions.GetPlate(veh))
            SetVehicleEngineOn(veh, true, true)
        end, newlocation, true)

        exports["soz-hud"]:DrawNotification(Lang:t("success.vehicle_out"), "primary", 4500)
    end
end)

local function IsVehicleInsideParking(veh, type_, indexgarage)
    local zones = (GarageTypes[type_] or {}).zones
    if not zones then
        return
    end

    if zones[indexgarage] then
        return zones[indexgarage]:isPointInside(GetEntityCoords(veh))
    end

    return false
end

local function CanVehicleBeParkedInGarage(veh, indexgarage, type_, plate)
    -- Is vehicle inside zone?
    local insideParking = IsVehicleInsideParking(veh, type_, indexgarage)
    if not insideParking then
        exports["soz-hud"]:DrawNotification(Lang:t("error.not_in_parking"), "error", 3500)
        return false
    end

    -- Is vehicle class allowed?
    local vehClass = GetVehicleClass(veh)
    local garageType = GetGarageType(type_)
    if type(garageType.excludeVehClass) == "table" then
        for _, class in ipairs(garageType.excludeVehClass) do
            if class == vehClass then
                exports["soz-hud"]:DrawNotification(Lang:t("error.not_correct_type"), "error", 3500)
                return false
            end
        end
    end

    -- Are there any ped inside vehcile?
    for i = -1, 5, 1 do
        local pedInSeat = GetPedInVehicleSeat(veh, i)
        if pedInSeat ~= 0 then
            exports["soz-hud"]:DrawNotification("Le véhicule doit être vide de tous passagers", "error")
            return
        end
    end

    -- Is entreprise vehicle?
    if type_ == "entreprise" and owned.job == nil then
        exports["soz-hud"]:DrawNotification("Ce n'est pas un véhicule entreprise", "error", 3500)
        return false
    end

    -- Empty slot availbale?
    if type_ == "private" then
        local placesstock = QBCore.Functions.TriggerRpc("qb-garage:server:getstock", indexgarage)
        local placesdispo = 38 - placesstock["COUNT(*)"]
        if placesdispo < 1 then
            exports["soz-hud"]:DrawNotification("Le parking est plein", "error", 3500)
            return false
        end
    end

    -- Does player own vehicle?
    local owned = QBCore.Functions.TriggerRpc("qb-garage:server:checkOwnership", plate, type_, indexgarage, PlayerGang.name)
    if not owned then
        exports["soz-hud"]:DrawNotification(Lang:t("error.not_owned"), "error", 3500)
        return false
    end

    local state = 1
    if type_ == "entreprise" then
        state = 3
    end
    return state
end

local function GetVehicleInGarage(type_, indexgarage)
    local veh = GetPlayersLastVehicle()
    local vehExtraData = GetVehicleClientData(veh)

    if not CanVehicleBeParkedInGarage(veh, indexgarage, type_, QBCore.Functions.GetPlate(veh)) then
        return
    end

    SetEntityAsMissionEntity(veh, true, true)

    QBCore.Functions.TriggerCallback("soz-garage:server:ParkVehicleInGarage", function(success)
        if success then
            exports["soz-hud"]:DrawNotification(Lang:t("success.vehicle_parked"))
        else
            exports["soz-hud"]:DrawNotification("Impossible de ranger le véhicule", "error")
        end
    end, type_, indexgarage, NetworkGetNetworkIdFromEntity(veh), vehExtraData)
end

RegisterNetEvent("qb-garages:client:PutInDepot", function(entity)
    local plate = QBCore.Functions.GetPlate(entity)
    local bodyDamage = math.ceil(GetVehicleBodyHealth(entity))
    local engineDamage = math.ceil(GetVehicleEngineHealth(entity))
    local totalFuel = GetVehicleFuelLevel(entity)
    -- EjectAnyPassager(entity)
    TriggerServerEvent("qb-garage:server:updateVehicle", 2, totalFuel, engineDamage, bodyDamage, plate, "fourriere", "depot")
    if plate then
        OutsideVehicles[plate] = nil
    end
    exports["soz-hud"]:DrawNotification("Le véhicule a été mis à la fourrière")
end)

AddEventHandler("QBCore:Client:OnPlayerLoaded", function()
    CreateThread(function()
        for garageId, garage in pairs(Garages) do
            if garage.showBlip and garage.type ~= "entreprise" then
                QBCore.Functions.CreateBlip("garage_" .. garageId, {
                    name = garage.blipName,
                    coords = vector3(garage.blipcoord.x, garage.blipcoord.y, garage.blipcoord.z),
                    sprite = garage.blipNumber,
                    color = garage.type == "private" and 5 or 3,
                })
            end
        end
    end)
end)

RegisterNetEvent("qb-garages:client:TakeOutPrive", function(v, type, garage, indexgarage, price)
    if price ~= 0 then
        TriggerServerEvent("qb-garage:server:PayPrivePrice", v, type, garage, indexgarage, price)
    else
        TriggerEvent("qb-garages:client:takeOutGarage", v, type, garage, indexgarage)
    end
end)

local function ParkingPanel(menu, type_, garage, indexgarage)
    local garageType = GetGarageType(type_)

    -- Menu
    if type_ == "private" then
        local placesstock = QBCore.Functions.TriggerRpc("qb-garage:server:getstock", indexgarage)
        local placesdispo = 38 - placesstock["COUNT(*)"]
        menu:AddTitle({label = garage.label .. " | Places libre: " .. placesdispo .. " / 38"})
    else
        menu:AddTitle({label = garage.label})
    end

    -- Ranger véhicule: public, private, entreprise
    if type_ ~= "depot" then
        menu:AddButton({
            label = "Ranger véhicule",
            select = function()
                GetVehicleInGarage(type_, indexgarage)
                garageType.menu:Close()
            end,
        })
    end

    -- Ranger Remorque: entreprise
    if type_ == "entreprise" then
        menu:AddButton({
            label = "Ranger remorque",
            select = function()
                local vehicle, distance = QBCore.Functions.GetClosestVehicle({
                    x = garage.blipcoord.x,
                    y = garage.blipcoord.y,
                    z = garage.blipcoord.z,
                })

                if distance >= 10.0 then
                    exports["soz-hud"]:DrawNotification(Lang:t("error.not_in_parking"), "error")
                    return
                end

                garageType.menu:Close()
                GetVehicleInGarage(type_, indexgarage)
            end,
        })
    end

    -- Sortir véhicule
    menu:AddButton({
        label = "Sortir véhicule",
        select = function()
            garageType.menu:Close()
            SortirMenu(type_, garage, indexgarage)
        end,
    })
end

local function GenerateMenu(type_, garage, indexgarage)
    local garageType = GetGarageType(type_)
    if not garageType.menu then
        return
    end

    local menu = garageType.menu
    menu:ClearItems()
    if menu.IsOpen then
        menu:Close()
    else
        ParkingPanel(menu, type_, garage, indexgarage)
        menu:Open()
    end
end

RegisterNetEvent("qb-garage:client:Menu", function(type, garage, indexgarage)
    GenerateMenu(type, garage, indexgarage)
end)
