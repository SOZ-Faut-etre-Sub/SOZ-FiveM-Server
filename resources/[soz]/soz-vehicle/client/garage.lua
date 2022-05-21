local OutsideVehicles = {}

local ParkingPublicList = MenuV:CreateMenu(nil, nil, "menu_garage_public", "soz", "parkingpublic:vehicle:car")
local VehiculeParkingPublic = MenuV:InheritMenu(ParkingPublicList, {Title = nil})

local ParkingPriveList = MenuV:CreateMenu(nil, nil, "menu_garage_private", "soz", "parkingprive:vehicle:car")
local VehiculeParkingPrive = MenuV:InheritMenu(ParkingPriveList, {Title = nil})

local ParkingFourriereList = MenuV:CreateMenu(nil, nil, "menu_garage_pound", "soz", "parkingfourriere:vehicle:car")
local VehiculeParkingFourriere = MenuV:InheritMenu(ParkingFourriereList, {Title = nil})

local ParkingEntrepriseList = MenuV:CreateMenu(nil, nil, "menu_garage_entreprise", "soz", "parkingentreprise:vehicle:car")
local VehiculeParkingEntreprise = MenuV:InheritMenu(ParkingEntrepriseList, {Title = nil})

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
    if type == "public" then
        VehiculeParkingPublic:ClearItems()
        MenuV:OpenMenu(VehiculeParkingPublic)

        VehiculeParkingPublic:AddButton({
            icon = "◀",
            label = "Retour au menu",
            value = ParkingPublicList,
            select = function()
                VehiculeParkingPublic:Close()
            end,
        })

        QBCore.Functions.TriggerCallback("qb-garage:server:GetGarageVehicles", function(result)
            if result == nil then
                exports["soz-hud"]:DrawNotification(Lang:t("error.no_vehicles"), "error")
            else
                for k, v in pairs(result) do
                    local enginePercent = round(v.engine / 10, 0)
                    local bodyPercent = round(v.body / 10, 0)
                    local currentFuel = v.fuel
                    local vname = GetLabelText(GetDisplayNameFromVehicleModel(v.vehicle))
                    if v.state == 1 then
                        VehiculeParkingPublic:AddButton({
                            label = Lang:t("menu.header.public", {value = vname, value2 = v.plate}),
                            description = Lang:t("menu.text.garage", {
                                value = currentFuel,
                                value2 = enginePercent,
                                value3 = bodyPercent,
                            }),
                            select = function()
                                VehiculeParkingPublic:Close()
                                TriggerEvent("qb-garages:client:takeOutGarage", v, type, garage, indexgarage)
                            end,
                        })
                    end
                end
            end
        end, indexgarage, type, garage.vehicle)
    elseif type == "private" then
        VehiculeParkingPrive:ClearItems()
        MenuV:OpenMenu(VehiculeParkingPrive)

        VehiculeParkingPrive:AddButton({
            icon = "◀",
            label = "Retour au menu",
            value = ParkingPriveList,
            select = function()
                VehiculeParkingPrive:Close()
            end,
        })
        QBCore.Functions.TriggerCallback("qb-garage:server:GetGarageVehicles", function(result, time)
            if result == nil then
                exports["soz-hud"]:DrawNotification(Lang:t("error.no_vehicles"), "error")
            else
                for k, v in pairs(result) do
                    local enginePercent = round(v.engine / 10, 0)
                    local bodyPercent = round(v.body / 10, 0)
                    local currentFuel = v.fuel
                    local vname = GetLabelText(GetDisplayNameFromVehicleModel(v.vehicle))
                    local timediff = math.floor((time - v.parkingtime) / 3600)
                    local price = timediff * 20
                    if price > 200 then
                        price = 200
                    end
                    if v.state == 1 then
                        VehiculeParkingPrive:AddButton({
                            label = Lang:t("menu.header.private", {value = vname, value2 = v.plate, value3 = price}),
                            description = Lang:t("menu.text.garage", {
                                value = currentFuel,
                                value2 = enginePercent,
                                value3 = bodyPercent,
                            }),
                            select = function()
                                VehiculeParkingPrive:Close()
                                TriggerEvent("qb-garages:client:TakeOutPrive", v, type, garage, indexgarage, price)
                            end,
                        })
                    end
                end
            end
        end, indexgarage, type, garage.vehicle)
    elseif type == "depot" then
        VehiculeParkingFourriere:ClearItems()
        MenuV:OpenMenu(VehiculeParkingFourriere)

        QBCore.Functions.TriggerCallback("qb-garage:server:GetGarageVehicles", function(result)
            if result == nil then
                exports["soz-hud"]:DrawNotification(Lang:t("error.no_vehicles"), "error")
            else
                for k, v in pairs(result) do
                    local enginePercent = round(v.engine / 10, 0)
                    local bodyPercent = round(v.body / 10, 0)
                    local currentFuel = v.fuel
                    local vname = GetLabelText(GetDisplayNameFromVehicleModel(v.vehicle))

                    VehiculeParkingFourriere:AddButton({
                        label = Lang:t("menu.header.depot", {value = vname, value2 = v.plate, value3 = v.depotprice}),
                        description = Lang:t("menu.text.depot", {
                            value = currentFuel,
                            value2 = enginePercent,
                            value3 = bodyPercent,
                        }),
                        select = function()
                            VehiculeParkingFourriere:Close()
                            TriggerServerEvent("qb-garage:server:PayDepotPrice", v, type, garage, indexgarage)
                        end,
                    })
                end
            end
        end, indexgarage, type, garage.vehicle)
    elseif type == "entreprise" then
        VehiculeParkingEntreprise:ClearItems()
        MenuV:OpenMenu(VehiculeParkingEntreprise)

        VehiculeParkingEntreprise:AddButton({
            icon = "◀",
            label = "Retour au menu",
            value = ParkingEntrepriseList,
            select = function()
                VehiculeParkingEntreprise:Close()
            end,
        })
        QBCore.Functions.TriggerCallback("qb-garage:server:GetPlayerEntreprise", function(result)
            if result == nil then
                exports["soz-hud"]:DrawNotification(Lang:t("error.no_vehicles"), "error")
            else
                for k, v in pairs(result) do
                    local enginePercent = round(v.engine / 10, 0)
                    local bodyPercent = round(v.body / 10, 0)
                    local currentFuel = v.fuel
                    local vname = GetLabelText(GetDisplayNameFromVehicleModel(v.vehicle))

                    if v.state == 3 then
                        VehiculeParkingEntreprise:AddButton({
                            label = Lang:t("menu.header.entreprise", {value = vname, value2 = v.plate}),
                            description = Lang:t("menu.text.garage", {
                                value = currentFuel,
                                value2 = enginePercent,
                                value3 = bodyPercent,
                            }),
                            select = function()
                                VehiculeParkingEntreprise:Close()
                                TriggerEvent("qb-garages:client:takeOutGarage", v, type, garage, indexgarage)
                            end,
                        })
                    end
                end
            end
        end, PlayerJob.id)
    end
end

RegisterNetEvent("qb-garages:client:takeOutGarage", function(vehicle, type, garage, indexgarage)
    local spawn = false

    if type == "depot" then
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
        local currentFuel = vehicle.fuel
        local location
        local heading
        local placedispo = 0

        if type == "public" then
            for _, publicpar in pairs(PlacesPublic) do
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
        elseif type == "private" then
            for _, privepar in pairs(PlacesPrives) do
                if privepar.data.indexGarage == indexgarage then
                    local vehicles2 = GetGamePool("CVehicle")
                    local inside = false
                    for _, vehicle2 in ipairs(vehicles2) do
                        if privepar:isPointInside(GetEntityCoords(vehicle2)) then
                            inside = true
                        end
                    end
                    if inside == false then
                        placedispo = placedispo + 1
                        location = privepar:getBoundingBoxCenter()
                        heading = privepar:getHeading()
                    end
                end
            end
        elseif type == "depot" then
            for _, fourrierepar in pairs(PlacesFourriere) do
                if fourrierepar.data.indexGarage == indexgarage then
                    local vehicles2 = GetGamePool("CVehicle")
                    local inside = false
                    for _, vehicle2 in ipairs(vehicles2) do
                        if fourrierepar:isPointInside(GetEntityCoords(vehicle2)) then
                            inside = true
                        end
                    end
                    if inside == false then
                        placedispo = placedispo + 1
                        location = fourrierepar:getBoundingBoxCenter()
                        heading = fourrierepar:getHeading()
                    end
                end
            end
        elseif type == "entreprise" then
            for _, entreprisepar in pairs(PlacesEntreprise) do
                if entreprisepar.data.indexGarage == indexgarage then
                    local vehicles2 = GetGamePool("CVehicle")
                    local inside = false
                    for _, vehicle2 in ipairs(vehicles2) do
                        if entreprisepar:isPointInside(GetEntityCoords(vehicle2)) then
                            inside = true
                        end
                    end
                    if inside == false then
                        placedispo = placedispo + 1
                        location = entreprisepar:getBoundingBoxCenter()
                        heading = entreprisepar:getHeading()
                    end
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

local function enterVehicle(veh, indexgarage, type, garage)
    local plate = QBCore.Functions.GetPlate(veh)
    local vehicleCoords = GetEntityCoords(veh)
    local insideParking = false
    local state = 1
    if type == "private" then
        if Zonesprives[indexgarage]:isPointInside(vehicleCoords) then
            insideParking = true
        end
    elseif type == "public" then
        if Zonespublic[indexgarage]:isPointInside(vehicleCoords) then
            insideParking = true
        end
    elseif type == "entreprise" then
        if Zonesentreprise[indexgarage]:isPointInside(vehicleCoords) then
            insideParking = true
            state = 3
        end
    end
    if insideParking then
        local owned = QBCore.Functions.TriggerRpc("qb-garage:server:checkOwnership", plate, type, indexgarage, PlayerGang.name)
        if owned then
            if type ~= "entreprise" or owned.job ~= nil then
                local bodyDamage = math.ceil(GetVehicleBodyHealth(veh))
                local engineDamage = math.ceil(GetVehicleEngineHealth(veh))
                local totalFuel = GetVehicleFuelLevel(veh)
                local vehProperties = QBCore.Functions.GetVehicleProperties(veh)
                if type == "private" then
                    local placesstock = QBCore.Functions.TriggerRpc("qb-garage:server:getstock", indexgarage)
                    local placesdispo = 38 - placesstock["COUNT(*)"]
                    if placesdispo >= 1 then
                        TriggerServerEvent("qb-vehicletuning:server:SaveVehicleProps", vehProperties)
                        CheckPlayers(veh, garage)
                        TriggerServerEvent("qb-garage:server:updateVehicle", state, totalFuel, engineDamage, bodyDamage, plate, indexgarage, type)
                        if plate then
                            OutsideVehicles[plate] = nil
                        end
                        exports["soz-hud"]:DrawNotification(Lang:t("success.vehicle_parked"), "primary", 4500)
                    else
                        exports["soz-hud"]:DrawNotification("Le parking est plein", "error", 3500)
                    end
                else
                    TriggerServerEvent("qb-vehicletuning:server:SaveVehicleProps", vehProperties)
                    CheckPlayers(veh, garage)
                    TriggerServerEvent("qb-garage:server:updateVehicle", state, totalFuel, engineDamage, bodyDamage, plate, indexgarage, type)
                    if plate then
                        OutsideVehicles[plate] = nil
                    end
                    exports["soz-hud"]:DrawNotification(Lang:t("success.vehicle_parked"), "primary", 4500)
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

RegisterNetEvent("qb-garages:client:PutInDepot", function(entity)
    local plate = QBCore.Functions.GetPlate(entity)
    local bodyDamage = math.ceil(GetVehicleBodyHealth(entity))
    local engineDamage = math.ceil(GetVehicleEngineHealth(entity))
    local totalFuel = GetVehicleFuelLevel(entity)
    CheckPlayers(entity)
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

local function ParkingPanel(menu, type, garage, indexgarage)
    if type == "public" then
        menu:AddTitle({label = garage.label})
        local button = menu:AddButton({label = "Ranger véhicule"})
        button:On("select", function()
            local curVeh = GetPlayersLastVehicle()
            local vehClass = GetVehicleClass(curVeh)
            if garage.vehicle == "car" or not garage.vehicle then
                if vehClass ~= 14 and vehClass ~= 15 and vehClass ~= 16 then
                    ParkingPublicList:Close()
                    enterVehicle(curVeh, indexgarage, type)
                else
                    exports["soz-hud"]:DrawNotification(Lang:t("error.not_correct_type"), "error", 3500)
                end
            end
        end)
        local button2 = menu:AddButton({label = "Sortir véhicule"})
        button2:On("select", function()
            ParkingPublicList:Close()
            SortirMenu(type, garage, indexgarage)
        end)
    elseif type == "private" then
        local placesstock = QBCore.Functions.TriggerRpc("qb-garage:server:getstock", indexgarage)
        local placesdispo = 38 - placesstock["COUNT(*)"]
        menu:AddTitle({label = garage.label .. " | Places libre: " .. placesdispo .. " / 38"})
        local button = menu:AddButton({label = "Ranger véhicule"})
        button:On("select", function()
            local curVeh = GetPlayersLastVehicle()
            local vehClass = GetVehicleClass(curVeh)
            if garage.vehicle == "car" or not garage.vehicle then
                if vehClass ~= 14 and vehClass ~= 15 and vehClass ~= 16 then
                    ParkingPriveList:Close()
                    enterVehicle(curVeh, indexgarage, type)
                else
                    exports["soz-hud"]:DrawNotification(Lang:t("error.not_correct_type"), "error", 3500)
                end
            end
        end)
        local button2 = menu:AddButton({label = "Sortir véhicule"})
        button2:On("select", function()
            ParkingPriveList:Close()
            SortirMenu(type, garage, indexgarage)
        end)
    elseif type == "depot" then
        menu:AddTitle({label = garage.label})
        local button2 = menu:AddButton({label = "Sortir véhicule"})
        button2:On("select", function()
            ParkingFourriereList:Close()
            SortirMenu(type, garage, indexgarage)
        end)
    elseif type == "entreprise" then
        menu:AddTitle({label = garage.label})
        local button = menu:AddButton({label = "Ranger véhicule"})
        button:On("select", function()
            local curVeh = GetPlayersLastVehicle()
            local vehClass = GetVehicleClass(curVeh)
            if garage.vehicle == "car" or not garage.vehicle then
                if vehClass ~= 14 and vehClass ~= 16 then
                    ParkingEntrepriseList:Close()
                    enterVehicle(curVeh, indexgarage, type)
                else
                    exports["soz-hud"]:DrawNotification(Lang:t("error.not_correct_type"), "error", 3500)
                end
            end
        end)
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

                if garage.vehicle == "car" or not garage.vehicle then
                    local vehClass = GetVehicleClass(vehicle)
                    if vehClass ~= 14 and vehClass ~= 16 then
                        ParkingEntrepriseList:Close()
                        enterVehicle(vehicle, indexgarage, type)
                    else
                        exports["soz-hud"]:DrawNotification(Lang:t("error.not_correct_type"), "error", 3500)
                    end
                end
            end,
        })
        local button2 = menu:AddButton({label = "Sortir véhicule"})
        button2:On("select", function()
            ParkingEntrepriseList:Close()
            SortirMenu(type, garage, indexgarage)
        end)
    end
end

local function GenerateMenu(type, garage, indexgarage)
    if type == "public" then
        if ParkingPublicList.IsOpen then
            ParkingPublicList:Close()
        else
            ParkingPublicList:ClearItems()
            ParkingPanel(ParkingPublicList, type, garage, indexgarage)
            ParkingPublicList:Open()
        end
    elseif type == "private" then
        if ParkingPriveList.IsOpen then
            ParkingPriveList:Close()
        else
            ParkingPriveList:ClearItems()
            ParkingPanel(ParkingPriveList, type, garage, indexgarage)
            ParkingPriveList:Open()
        end
    elseif type == "depot" then
        if ParkingFourriereList.IsOpen then
            ParkingFourriereList:Close()
        else
            ParkingFourriereList:ClearItems()
            ParkingPanel(ParkingFourriereList, type, garage, indexgarage)
            ParkingFourriereList:Open()
        end
    elseif type == "entreprise" then
        if ParkingEntrepriseList.IsOpen then
            ParkingEntrepriseList:Close()
        else
            ParkingEntrepriseList:ClearItems()
            ParkingPanel(ParkingEntrepriseList, type, garage, indexgarage)
            ParkingEntrepriseList:Open()
        end
    end
end

RegisterNetEvent("qb-garage:client:Menu", function(type, garage, indexgarage)
    GenerateMenu(type, garage, indexgarage)
end)
