QBCore = exports["qb-core"]:GetCoreObject()

local HorodateurOpen = false
local HorodateurActive = false
local lastLocation = nil
local TotalDistance = 0
local retval, taxiGroupHash = AddRelationshipGroup("TAXI")

HorodateurData = {Tarif = 4.6, TarifActuelle = 0, Distance = 0}

NpcData = {
    Active = false,
    CurrentNpc = nil,
    LastNpc = nil,
    CurrentDeliver = nil,
    LastDeliver = nil,
    Npc = nil,
    NpcBlip = nil,
    DeliveryBlip = nil,
    NpcTaken = false,
    NpcDelivered = false,
    CountDown = 180,
}

function ResetNpcTask()
    NpcData = {
        Active = false,
        CurrentNpc = nil,
        LastNpc = nil,
        CurrentDeliver = nil,
        LastDeliver = nil,
        Npc = nil,
        NpcBlip = nil,
        DeliveryBlip = nil,
        NpcTaken = false,
        NpcDelivered = false,
    }
end

function ClearNpcMission()
    -- clear blip
    if NpcData.NpcBlip ~= nil then
        RemoveBlip(NpcData.NpcBlip)
    end
    if NpcData.DeliveryBlip ~= nil then
        RemoveBlip(NpcData.DeliveryBlip)
    end
    -- clear ped
    local RemovePed = function(ped)
        SetTimeout(60000, function()
            DeletePed(ped)
        end)
    end
    -- clear thread
    if NpcData.NpcTaken then
        TaskLeaveVehicle(NpcData.Npc, GetVehiclePedIsIn(NpcData.Npc, 0), 0)
        SetEntityAsMissionEntity(NpcData.Npc, false, true)
        SetEntityAsNoLongerNeeded(NpcData.Npc)
    else
        NpcData.NpcTaken = true
        Wait(100)
        RemovePed(NpcData.Npc)
    end
    ResetNpcTask()
end

local function calculateFareAmount()
    if HorodateurActive then
        start = lastLocation

        if start then
            current = GetEntityCoords(PlayerPedId())
            distance = #(start - current)
            TotalDistance = distance + TotalDistance
            HorodateurData["Distance"] = TotalDistance

            Tarif = (HorodateurData["Distance"] / 100.00) * HorodateurData["Tarif"]

            HorodateurData["TarifActuelle"] = math.ceil(Tarif)

            SendNUIMessage({action = "updateMeter", HorodateurData = HorodateurData})
        end
    end
end

local function ValidVehicle()
    local ped = PlayerPedId()
    local model = GetEntityModel(GetVehiclePedIsIn(ped))

    return Config.AllowedVehicleModel[model] or false
end

-- horodateur

RegisterNetEvent("taxi:client:toggleHorodateur", function()
    if ValidVehicle() then
        if not HorodateurOpen then
            SendNUIMessage({action = "openMeter", toggle = true, HorodateurData = Config.Horodateur})
            HorodateurOpen = true
        else
            SendNUIMessage({action = "openMeter", toggle = false})
            HorodateurOpen = false
        end
    else
        if HorodateurOpen then
            SendNUIMessage({action = "openMeter", toggle = false})
            HorodateurOpen = false
        end
    end
end)

RegisterNetEvent("taxi:client:enableHorodateur", function()
    if HorodateurOpen then
        SendNUIMessage({action = "toggleMeter"})
        TotalDistance = 0
    end
end)

AddEventHandler("ems:client:onDeath", function()
    if HorodateurOpen == true then
        TriggerEvent("taxi:client:toggleHorodateur")
    end
end)

-- command

RegisterCommand("Horodateur-Taxi", function()
    TriggerEvent("taxi:client:toggleHorodateur")
end)

RegisterCommand("Horodateur-Taxi-active", function()
    TriggerEvent("taxi:client:enableHorodateur")
end)

RegisterKeyMapping("Horodateur-Taxi", "Horodateur Taxi", "keyboard", "OEM_7")

RegisterKeyMapping("Horodateur-Taxi-active", "activer Horodateur Taxi", "keyboard", "OEM_5")

-- boucle

CreateThread(function()
    while true do
        Wait(2000)
        calculateFareAmount()
        lastLocation = GetEntityCoords(PlayerPedId())

        -- horodateur

        if not ValidVehicle() then
            TriggerEvent("taxi:client:toggleHorodateur")
        end
    end
end)

-- nui

RegisterNUICallback("enableMeter", function(data)
    HorodateurActive = data.enabled

    if not data.enabled then
        SendNUIMessage({action = "resetMeter"})
    end
    lastLocation = GetEntityCoords(PlayerPedId())
end)

-- mission pnj

local function GetDeliveryLocation()
    NpcData.CurrentDeliver = math.random(1, #Config.NPCLocations.DeliverLocations)
    if NpcData.LastDeliver ~= nil then
        while NpcData.LastDeliver ~= NpcData.CurrentDeliver do
            NpcData.CurrentDeliver = math.random(1, #Config.NPCLocations.DeliverLocations)
        end
    end

    if NpcData.DeliveryBlip ~= nil then
        RemoveBlip(NpcData.DeliveryBlip)
    end
    NpcData.DeliveryBlip = AddBlipForCoord(Config.NPCLocations.DeliverLocations[NpcData.CurrentDeliver].x,
                                           Config.NPCLocations.DeliverLocations[NpcData.CurrentDeliver].y,
                                           Config.NPCLocations.DeliverLocations[NpcData.CurrentDeliver].z)
    SetBlipColour(NpcData.DeliveryBlip, 3)
    SetNewWaypoint(Config.NPCLocations.DeliverLocations[NpcData.CurrentDeliver].x, Config.NPCLocations.DeliverLocations[NpcData.CurrentDeliver].y)
    NpcData.LastDeliver = NpcData.CurrentDeliver
    CreateThread(function()
        while NpcData.NpcTaken do
            local ped = PlayerPedId()
            local pos = GetEntityCoords(ped)
            local dist = #(pos -
                             vector3(Config.NPCLocations.DeliverLocations[NpcData.CurrentDeliver].x,
                                     Config.NPCLocations.DeliverLocations[NpcData.CurrentDeliver].y,
                                     Config.NPCLocations.DeliverLocations[NpcData.CurrentDeliver].z))
            if dist < 5 then
                if IsVehicleStopped(GetVehiclePedIsIn(ped, 0)) and ValidVehicle() then
                    local veh = GetVehiclePedIsIn(ped, 0)
                    if not IsPedInVehicle(NpcData.Npc, veh, false) then
                        ClearNpcMission()
                        exports["soz-hud"]:DrawNotification("Vous n'avez pas la personne dans votre véhicule")
                        return
                    end
                    TaskLeaveVehicle(NpcData.Npc, veh, 0)
                    SetPedRelationshipGroupHash(NpcData.Npc, taxiGroupHash)
                    SetRelationshipBetweenGroups(0, taxiGroupHash, GetHashKey("PLAYER"))
                    SetRelationshipBetweenGroups(0, GetHashKey("PLAYER"), taxiGroupHash)
                    SetEntityAsMissionEntity(NpcData.Npc, false, true)
                    SetEntityAsNoLongerNeeded(NpcData.Npc)
                    local targetCoords = Config.NPCLocations.TakeLocations[NpcData.LastNpc]
                    TaskGoStraightToCoord(NpcData.Npc, targetCoords.x, targetCoords.y, targetCoords.z, 1.0, -1, 0.0, 0.0)
                    TriggerServerEvent("taxi:server:NpcPay", HorodateurData.TarifActuelle)
                    HorodateurActive = false
                    TotalDistance = 0
                    exports["soz-hud"]:DrawNotification("Vous avez déposé la personne")
                    if NpcData.DeliveryBlip ~= nil then
                        RemoveBlip(NpcData.DeliveryBlip)
                    end
                    local RemovePed = function(ped)
                        SetTimeout(60000, function()
                            DeletePed(ped)
                        end)
                    end
                    RemovePed(NpcData.Npc)
                    ResetNpcTask()
                    break
                end
            end
            Wait(1)
        end
    end)
end

RegisterNetEvent("taxi:client:DoTaxiNpc", function()
    if ValidVehicle() then
        if not NpcData.Active then
            NpcData.CurrentNpc = math.random(1, #Config.NPCLocations.TakeLocations)
            if NpcData.LastNpc ~= nil then
                while NpcData.LastNpc ~= NpcData.CurrentNpc do
                    NpcData.CurrentNpc = math.random(1, #Config.NPCLocations.TakeLocations)
                end
            end

            local Gender = math.random(1, #Config.NpcSkins)
            local PedSkin = math.random(1, #Config.NpcSkins[Gender])
            local model = GetHashKey(Config.NpcSkins[Gender][PedSkin])
            RequestModel(model)
            while not HasModelLoaded(model) do
                Wait(0)
            end
            NpcData.Npc = CreatePed(3, model, Config.NPCLocations.TakeLocations[NpcData.CurrentNpc].x, Config.NPCLocations.TakeLocations[NpcData.CurrentNpc].y,
                                    Config.NPCLocations.TakeLocations[NpcData.CurrentNpc].z - 0.98, Config.NPCLocations.TakeLocations[NpcData.CurrentNpc].w,
                                    false, true)
            PlaceObjectOnGroundProperly(NpcData.Npc)
            FreezeEntityPosition(NpcData.Npc, true)
            if NpcData.NpcBlip ~= nil then
                RemoveBlip(NpcData.NpcBlip)
            end

            NpcData.NpcBlip = AddBlipForCoord(Config.NPCLocations.TakeLocations[NpcData.CurrentNpc].x, Config.NPCLocations.TakeLocations[NpcData.CurrentNpc].y,
                                              Config.NPCLocations.TakeLocations[NpcData.CurrentNpc].z)
            SetBlipColour(NpcData.NpcBlip, 3)
            SetNewWaypoint(Config.NPCLocations.TakeLocations[NpcData.CurrentNpc].x, Config.NPCLocations.TakeLocations[NpcData.CurrentNpc].y)
            NpcData.LastNpc = NpcData.CurrentNpc
            NpcData.Active = true

            CreateThread(function()
                while not NpcData.NpcTaken do

                    local ped = PlayerPedId()
                    local pos = GetEntityCoords(ped)
                    local dist = #(pos -
                                     vector3(Config.NPCLocations.TakeLocations[NpcData.CurrentNpc].x, Config.NPCLocations.TakeLocations[NpcData.CurrentNpc].y,
                                             Config.NPCLocations.TakeLocations[NpcData.CurrentNpc].z))

                    if dist < 5 then
                        if IsVehicleStopped(GetVehiclePedIsIn(ped, 0)) and ValidVehicle() then
                            local veh = GetVehiclePedIsIn(ped, 0)
                            local maxSeats, freeSeat = GetVehicleMaxNumberOfPassengers(veh)

                            for i = maxSeats - 1, 0, -1 do
                                if IsVehicleSeatFree(veh, i) then
                                    freeSeat = i
                                    break
                                end
                            end

                            HorodateurOpen = true
                            HorodateurActive = true
                            TotalDistance = 0
                            lastLocation = GetEntityCoords(PlayerPedId())
                            ClearPedTasksImmediately(NpcData.Npc)
                            FreezeEntityPosition(NpcData.Npc, false)
                            TaskEnterVehicle(NpcData.Npc, veh, -1, freeSeat, 1.0, 0)
                            local count = 0
                            while not IsPedInVehicle(NpcData.Npc, veh, false) do
                                if count == 15 or dist > 5 then
                                    ClearNpcMission()
                                    exports["soz-hud"]:DrawNotification("Ouvre ton véhicule, là prochaine fois ?")
                                    return
                                end
                                Wait(1000)
                                TaskEnterVehicle(NpcData.Npc, veh, -1, freeSeat, 1.0, 0)
                                count = count + 1
                            end
                            exports["soz-hud"]:DrawNotification("Amenez la personne a la destination spécifiée")
                            if NpcData.NpcBlip ~= nil then
                                RemoveBlip(NpcData.NpcBlip)
                            end
                            GetDeliveryLocation()
                            NpcData.NpcTaken = true
                        end
                    end

                    Wait(1)
                end
            end)
        else
            exports["soz-hud"]:DrawNotification("Vous êtes déjà en mission")
        end
    else
        exports["soz-hud"]:DrawNotification("Vous n'êtes pas dans un taxi")
    end
end)

RegisterNetEvent("ems:client:onDeath", function()
    ClearNpcMission()
end)
