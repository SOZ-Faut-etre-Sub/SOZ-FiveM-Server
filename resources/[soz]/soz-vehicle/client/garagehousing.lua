local ParkingHousingList = MenuV:CreateMenu(nil, nil, "menu_garage_public", "soz", "parkinghousing:vehicle:car")
local VehiculeParkingHousing = MenuV:InheritMenu(ParkingHousingList, {Title = nil})

local function CheckPlayers(vehicle, garage)
    for i = -1, 5, 1 do
        local seat = GetPedInVehicleSeat(vehicle, i)
        if seat then
            TaskLeaveVehicle(seat, vehicle, 0)
            if garage then
                SetEntityCoords(seat, garage.blipcoord.x, garage.blipcoord.y, garage.blipcoord.z)
            end
        end
    end
    SetVehicleDoorsLocked(vehicle)
    Wait(100)
    QBCore.Functions.DeleteVehicle(vehicle)
end

-- Functions

local function round(num, numDecimalPlaces)
    return tonumber(string.format("%." .. (numDecimalPlaces or 0) .. "f", num))
end

local function SortirMenu(type, garage, indexgarage)
    if type == "housing" then
        VehiculeParkingHousing:ClearItems()
        MenuV:OpenMenu(VehiculeParkingHousing)

        VehiculeParkingHousing:AddButton({
            icon = "◀",
            label = "Retour au menu",
            value = ParkingHousingList,
            select = function()
                VehiculeParkingHousing:Close()
            end,
        })

        QBCore.Functions.TriggerCallback("qb-garagehousing:server:GetGarageVehicles", function(result)
            if result == nil then
                exports["soz-hud"]:DrawNotification(Lang:t("error.no_vehicles"), "error")
            else
                for k, v in pairs(result) do
                    local enginePercent = round(v.engine / 10, 0)
                    local bodyPercent = round(v.body / 10, 0)
                    local currentFuel = v.fuel
                    local vname = GetLabelText(GetDisplayNameFromVehicleModel(v.vehicle))
                    if v.state == 1 then
                        VehiculeParkingHousing:AddButton({
                            label = Lang:t("menu.header.public", {value = vname, value2 = v.plate}),
                            description = Lang:t("menu.text.garage", {
                                value = currentFuel,
                                value2 = enginePercent,
                                value3 = bodyPercent,
                            }),
                            select = function()
                                VehiculeParkingHousing:Close()
                                TriggerEvent("qb-garageshousing:client:takeOutGarage", v, type, garage, indexgarage)
                            end,
                        })
                    end
                end
            end
        end, indexgarage, type, garage.vehicle)
    end
end

RegisterNetEvent("qb-garageshousing:client:takeOutGarage", function(vehicle, type, garage, indexgarage)
    local currentFuel = vehicle.fuel
    local location
    local heading
    local placedispo = 0

    if type == "housing" then
        for _, publicpar in pairs(PlacesPublic) do -- ici je vérifie s'il y a au moins une place de dispo dans toutes les zones configurées dans garageconfig.lua. Faudra faire "PlacesHousing" ou comme tu veux pour gérer ça après
            if publicpar.data.indexGarage == indexgarage then
                local vehicles2 = GetGamePool("CVehicle")
                local inside = false
                for _, vehicle2 in ipairs(vehicles2) do
                    if publicpar:isPointInside(GetEntityCoords(vehicle2)) then
                        inside = true
                    end
                end
                if inside == false then
                    placedispo = placedispo + 1
                    location = publicpar:getBoundingBoxCenter()
                    heading = publicpar:getHeading()
                end
            end
        end
    end
    local newlocation = vec4(location.x, location.y, location.z, heading)
    if placedispo == 0 then
        exports["soz-hud"]:DrawNotification("Déjà une voiture sur un des parking", "primary", 4500)
    else
        QBCore.Functions.SpawnVehicle(vehicle.vehicle, function(veh)
            local properties = QBCore.Functions.TriggerRpc("qb-garagehousing:server:GetVehicleProperties", vehicle.plate)
            QBCore.Functions.SetVehicleProperties(veh, properties)
            SetVehicleNumberPlateText(veh, vehicle.plate)
            SetEntityAsMissionEntity(veh, true, true)
            SetFuel(veh, currentFuel + 0.0)
            TriggerServerEvent("qb-garagehousing:server:updateVehicleState", 0, vehicle.plate, vehicle.garage)
            TriggerServerEvent("qb-garagehousing:server:updateVehicleCitizen", vehicle.plate)
            TriggerEvent("vehiclekeys:client:SetOwner", QBCore.Functions.GetPlate(veh))
            SetVehicleEngineOn(veh, true, true)
        end, newlocation, true)
        exports["soz-hud"]:DrawNotification(Lang:t("success.vehicle_out"), "primary", 4500)
    end
end)

local function enterVehicle(veh, indexgarage, type, garage)
    local plate = QBCore.Functions.GetPlate(veh)
    local vehicleCoords = GetEntityCoords(veh)
    local insideParking = false
    local state = 1
    if type == "housing" then
        if Zonespublic[indexgarage]:isPointInside(vehicleCoords) then -- ici je vérifie que la voiture est dans la zone globale du parking pour pouvoir la ranger ou pas
            insideParking = true
        end
    end
    if insideParking then
        local owned = QBCore.Functions.TriggerRpc("qb-garagehousing:server:checkOwnership", plate, type, indexgarage, PlayerGang.name) -- ensuite je vérifie si la voiture m'appartient
        if owned then
            if type ~= "entreprise" then
                local bodyDamage = math.ceil(GetVehicleBodyHealth(veh))
                local engineDamage = math.ceil(GetVehicleEngineHealth(veh))
                local totalFuel = GetVehicleFuelLevel(veh)
                local vehProperties = QBCore.Functions.GetVehicleProperties(veh)
                if type == "private" or type == "housing" then -- j'ai laissé certains ancien types pour que comme ça c'est prêt à être merge dans le garage.lua
                    local placesstock = QBCore.Functions.TriggerRpc("qb-garagehousing:server:getstock", indexgarage)
                    local placesdispo = 5 - placesstock["COUNT(*)"] -- Le chiffre 5 ici c'est en gros le nbr max de voiture dans le garage housing donc ça dépend du tier de la house donc tu mets le chiffre que tu veux maybe 1 pour l'instant?
                    if placesdispo >= 1 then
                        TriggerServerEvent("qb-vehicletuning:server:SaveVehicleProps", vehProperties)
                        CheckPlayers(veh, garage)
                        TriggerServerEvent("qb-garagehousing:server:updateVehicle", state, totalFuel, engineDamage, bodyDamage, plate, indexgarage, type)
                        exports["soz-hud"]:DrawNotification(Lang:t("success.vehicle_parked"), "primary", 4500)
                    else
                        exports["soz-hud"]:DrawNotification("Le parking est plein", "error", 3500)
                    end
                end
            else
                exports["soz-hud"]:DrawNotification("Ce n'est pas un véhicule entreprise", "error", 3500)
            end
        else
            exports["soz-hud"]:DrawNotification(Lang:t("error.not_owned"), "error", 3500)
        end
    else
        exports["soz-hud"]:DrawNotification(Lang:t("error.not_in_parking"), "error", 3500)
    end
end

local function ParkingHousingPanel(menu, type, garage, indexgarage)
    if type == "housing" then
        menu:AddTitle({label = garage.label})
        local button = menu:AddButton({label = "Ranger véhicule"})
        button:On("select", function()
            local curVeh = GetPlayersLastVehicle()
            local vehClass = GetVehicleClass(curVeh)
            if garage.vehicle == "car" or not garage.vehicle then
                if vehClass ~= 14 and vehClass ~= 15 and vehClass ~= 16 then
                    ParkingHousingList:Close()
                    enterVehicle(curVeh, indexgarage, type)
                else
                    exports["soz-hud"]:DrawNotification(Lang:t("error.not_correct_type"), "error", 3500)
                end
            end
        end)
        local button2 = menu:AddButton({label = "Sortir véhicule"})
        button2:On("select", function()
            ParkingHousingList:Close()
            SortirMenu(type, garage, indexgarage)
        end)
    end
end

local function GenerateHousingMenu(type, garage, indexgarage)
    if type == "housing" then
        if ParkingHousingList.IsOpen then
            ParkingHousingList:Close()
        else
            ParkingHousingList:ClearItems()
            ParkingHousingPanel(ParkingHousingList, type, garage, indexgarage)
            ParkingHousingList:Open()
        end
    end
end

RegisterNetEvent("qb-garagehousing:client:Menu", function(type, garage, indexgarage)
    GenerateHousingMenu(type, garage, indexgarage)
end)
