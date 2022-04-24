local QBCore = exports["qb-core"]:GetCoreObject()
PlayerData = {}
PlayerGang = {}
PlayerJob = {}
OnDuty = false
local OutsideVehicles = {}

local ParkingPublicList = MenuV:CreateMenu(nil, nil, "menu_garage_public", "soz", "parkingpublic:vehicle:car")
local VehiculeParkingPublic = MenuV:InheritMenu(ParkingPublicList, {Title = nil})

local ParkingPriveList = MenuV:CreateMenu(nil, nil, "menu_garage_private", "soz", "parkingprive:vehicle:car")
local VehiculeParkingPrive = MenuV:InheritMenu(ParkingPriveList, {Title = nil})

local ParkingFourriereList = MenuV:CreateMenu(nil, nil, "menu_garage_pound", "soz", "parkingfourriere:vehicle:car")
local VehiculeParkingFourriere = MenuV:InheritMenu(ParkingFourriereList, {Title = nil})

local ParkingEntrepriseList = MenuV:CreateMenu(nil, nil, "menu_garage_public", "soz", "parkingentreprise:vehicle:car")
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
                    local vname
                    if v.job == nil or v.job == "" then
                        vname = QBCore.Shared.Vehicles[v.vehicle].name
                    else
                        vname = Config.GarageVehicles[v.vehicle]
                    end
                    if v.state == 0 then
                        v.state = Lang:t("status.out")
                    elseif v.state == 1 then
                        v.state = Lang:t("status.garaged")
                    elseif v.state == 2 then
                        v.state = Lang:t("status.impound")
                    end
                    VehiculeParkingPublic:AddButton({
                        label = Lang:t("menu.header.public", {value = vname, value2 = v.plate}),
                        description = Lang:t("menu.text.garage", {
                            value = v.state,
                            value2 = currentFuel,
                            value3 = enginePercent,
                            value4 = bodyPercent,
                        }),
                        select = function()
                            VehiculeParkingPublic:Close()
                            TriggerEvent("qb-garages:client:takeOutGarage", v, type, garage, indexgarage)
                        end,
                    })
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
                    local vname
                    if v.job == nil or v.job == "" then
                        vname = QBCore.Shared.Vehicles[v.vehicle].name
                    else
                        vname = Config.GarageVehicles[v.vehicle]
                    end
                    local timediff = time - v.parkingtime
                    local price = math.floor(timediff / 3600)

                    if v.state == 0 then
                        v.state = Lang:t("status.out")
                    elseif v.state == 1 then
                        v.state = Lang:t("status.garaged")
                    elseif v.state == 2 then
                        v.state = Lang:t("status.impound")
                    end
                    VehiculeParkingPrive:AddButton({
                        label = Lang:t("menu.header.private", {value = vname, value2 = v.plate, value3 = price}),
                        description = Lang:t("menu.text.garage", {
                            value = v.state,
                            value2 = currentFuel,
                            value3 = enginePercent,
                            value4 = bodyPercent,
                        }),
                        select = function()
                            VehiculeParkingPrive:Close()
                            TriggerEvent("qb-garages:client:TakeOutPrive", v, type, garage, indexgarage, price)
                        end,
                    })
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
                    local vname
                    if v.job == nil or v.job == "" then
                        vname = QBCore.Shared.Vehicles[v.vehicle].name
                    else
                        vname = Config.GarageVehicles[v.vehicle]
                    end
                    if v.state == 0 then
                        v.state = Lang:t("status.out")
                    elseif v.state == 1 then
                        v.state = Lang:t("status.garaged")
                    elseif v.state == 2 then
                        v.state = Lang:t("status.impound")
                    end
                    VehiculeParkingFourriere:AddButton({
                        label = Lang:t("menu.header.depot", {value = vname, value2 = v.plate, value3 = v.depotprice}),
                        description = Lang:t("menu.text.depot", {
                            value = v.state,
                            value2 = currentFuel,
                            value3 = enginePercent,
                            value4 = bodyPercent,
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
                    local vname = Config.GarageVehicles[v.vehicle]

                    if v.state == 0 then
                        v.state = Lang:t("status.out")
                    elseif v.state == 1 then
                        v.state = Lang:t("status.garaged")
                    elseif v.state == 2 then
                        v.state = Lang:t("status.impound")
                    elseif v.state == 3 then
                        v.state = Lang:t("status.garagedentre")
                    end

                    VehiculeParkingEntreprise:AddButton({
                        label = Lang:t("menu.header.entreprise", {value = vname, value2 = v.plate}),
                        description = Lang:t("menu.text.garage", {
                            value = v.state,
                            value2 = currentFuel,
                            value3 = enginePercent,
                            value4 = bodyPercent,
                        }),
                        select = function()
                            VehiculeParkingEntreprise:Close()
                            TriggerEvent("qb-garages:client:takeOutGarage", v, type, garage, indexgarage)
                        end,
                    })
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
        local newlocation = vec4(location.x, location.y, location.z, heading)
        if placedispo == 0 then
            exports["soz-hud"]:DrawNotification("Déjà une voiture sur un des parking", "primary", 4500)
        else
            QBCore.Functions.SpawnVehicle(vehicle.vehicle, function(veh)
                QBCore.Functions.TriggerCallback("qb-garage:server:GetVehicleProperties", function(properties)
                    if vehicle.plate then
                        OutsideVehicles[vehicle.plate] = veh
                        TriggerServerEvent("qb-garages:server:UpdateOutsideVehicles", OutsideVehicles)
                    end
                    QBCore.Functions.SetVehicleProperties(veh, properties)
                    SetVehicleNumberPlateText(veh, vehicle.plate)
                    SetFuel(veh, currentFuel + 0.0)
                    SetEntityAsMissionEntity(veh, true, true)
                    TriggerServerEvent("qb-garage:server:updateVehicleState", 0, vehicle.plate, vehicle.garage)
                    TriggerServerEvent("qb-garage:server:updateVehicleCitizen", vehicle.plate)
                    TriggerEvent("vehiclekeys:client:SetOwner", QBCore.Functions.GetPlate(veh))
                    SetVehicleEngineOn(veh, true, true)
                end, vehicle.plate)
            end, newlocation, true)
            exports["soz-hud"]:DrawNotification(Lang:t("success.vehicle_out"), "primary", 4500)
        end
    end
end)

RegisterNetEvent("soz-concess:client:addvehicleentreprise", function(vehicle, newlocation, plate)
    QBCore.Functions.SpawnVehicle(vehicle.vehicle, function(veh)
        TaskWarpPedIntoVehicle(PlayerPedId(), veh, -1)
        SetVehicleNumberPlateText(veh, plate)
        SetFuel(veh, 100)
        SetVehicleLivery(veh, 1) -- C'EST POUR LE LIVERY FLATBED DONC POUR LES AUTRES JOB A FAIRE UNE CONDITION SI JOB DIFERENT DE BENNYS ALORS PAS METTRE CETTE LIGNE
        SetEntityAsMissionEntity(veh, true, true)
        TriggerEvent("vehiclekeys:client:SetOwner", QBCore.Functions.GetPlate(veh))
        TriggerServerEvent("qb-vehicletuning:server:SaveVehicleProps", QBCore.Functions.GetVehicleProperties(veh))
    end, newlocation, true)
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
        QBCore.Functions.TriggerCallback("qb-garage:server:checkOwnership", function(owned)
            if owned then
                local bodyDamage = math.ceil(GetVehicleBodyHealth(veh))
                local engineDamage = math.ceil(GetVehicleEngineHealth(veh))
                local totalFuel = GetVehicleFuelLevel(veh)
                local vehProperties = QBCore.Functions.GetVehicleProperties(veh)
                CheckPlayers(veh, garage)
                TriggerServerEvent("qb-garage:server:updateVehicle", state, totalFuel, engineDamage, bodyDamage, plate, indexgarage, type)
                if plate then
                    OutsideVehicles[plate] = nil
                    TriggerServerEvent("qb-garages:server:UpdateOutsideVehicles", OutsideVehicles)
                end
                exports["soz-hud"]:DrawNotification(Lang:t("success.vehicle_parked"), "primary", 4500)
            else
                exports["soz-hud"]:DrawNotification(Lang:t("error.not_owned"), "error", 3500)
            end
        end, plate, type, indexgarage, PlayerGang.name)
    else
        exports["soz-hud"]:DrawNotification(Lang:t("error.not_in_parking"), "error", 3500)
    end
end

AddEventHandler("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
    PlayerGang = PlayerData.gang
    PlayerJob = PlayerData.job
end)

RegisterNetEvent("QBCore:Client:OnGangUpdate", function(gang)
    PlayerGang = gang
end)

RegisterNetEvent("QBCore:Client:OnJobUpdate", function(JobInfo)
    PlayerJob = JobInfo
    OnDuty = PlayerJob.onduty
end)

RegisterNetEvent("QBCore:Client:SetDuty", function(duty)
    OnDuty = duty
end)

CreateThread(function()
    for _, garage in pairs(Garages) do
        if garage.showBlip and garage.type ~= "entreprise" then
            local Garage = AddBlipForCoord(garage.blipcoord.x, garage.blipcoord.y, garage.blipcoord.z)
            SetBlipSprite(Garage, garage.blipNumber)
            SetBlipDisplay(Garage, 4)
            SetBlipScale(Garage, 0.80)
            SetBlipAsShortRange(Garage, true)
            if garage.type == "private" then
                SetBlipColour(Garage, 5)
            else
                SetBlipColour(Garage, 3)
            end
            BeginTextCommandSetBlipName("STRING")
            AddTextComponentSubstringPlayerName(garage.blipName)
            EndTextCommandSetBlipName(Garage)
        end
    end
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
        local button2 = menu:AddButton({label = "Sortir véhicule"})
        button2:On("select", function()
            ParkingFourriereList:Close()
            SortirMenu(type, garage, indexgarage)
        end)
    elseif type == "entreprise" then
        local button = menu:AddButton({label = "Ranger véhicule"})
        button:On("select", function()
            local curVeh = GetPlayersLastVehicle()
            local vehClass = GetVehicleClass(curVeh)
            if garage.vehicle == "car" or not garage.vehicle then
                if vehClass ~= 14 and vehClass ~= 15 and vehClass ~= 16 then
                    ParkingEntrepriseList:Close()
                    enterVehicle(curVeh, indexgarage, type)
                else
                    exports["soz-hud"]:DrawNotification(Lang:t("error.not_correct_type"), "error", 3500)
                end
            end
        end)
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
