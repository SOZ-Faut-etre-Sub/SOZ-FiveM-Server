QBCore = exports["qb-core"]:GetCoreObject()

local HorodateurOpen = False
local HorodateurActive = False
local lastLocation = nil

HorodateurData = {Tarif = 6, TarifActuelle = 0, Distance = 0}

local NpcData = {
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

local function ResetNpcTask()
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

local function calculateFareAmount()
    if HorodateurActive then
        start = lastLocation

        if start then
            current = GetEntityCoords(PlayerPedId())
            distance = #(start - current)
            HorodateurData["Distance"] = distance

            Tarif = (HorodateurData["Distance"] / 1000.00) * HorodateurData["Tarif"]

            HorodateurData["TarifActuelle"] = math.ceil(Tarif)

            SendNUIMessage({action = "updateMeter", HorodateurData = HorodateurData})
        end
    end
end

local function ValidVehicle()
    local ped = PlayerPedId()
    local vehicle = GetEntityModel(GetVehiclePedIsIn(ped))
    local retval = false

    if vehicle == GetHashKey("taxi") then
        retval = true
    end

    return retval
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
    end
end)

RegisterNetEvent("taxi:client:enableHorodateur", function()
    if HorodateurOpen then
        SendNUIMessage({action = "toggleMeter"})
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
    SetBlipRoute(NpcData.DeliveryBlip, true)
    SetBlipRouteColour(NpcData.DeliveryBlip, 3)
    NpcData.LastDeliver = NpcData.CurrentDeliver
    CreateThread(function()
        while true do
            local ped = PlayerPedId()
            local pos = GetEntityCoords(ped)
            local dist = #(pos -
                             vector3(Config.NPCLocations.DeliverLocations[NpcData.CurrentDeliver].x,
                                     Config.NPCLocations.DeliverLocations[NpcData.CurrentDeliver].y,
                                     Config.NPCLocations.DeliverLocations[NpcData.CurrentDeliver].z))
            if dist < 20 then
                if dist < 5 then
                    if IsVehicleStopped(GetVehiclePedIsIn(ped, 0)) then
                        local veh = GetVehiclePedIsIn(ped, 0)
                        TaskLeaveVehicle(NpcData.Npc, veh, 0)
                        SetEntityAsMissionEntity(NpcData.Npc, false, true)
                        SetEntityAsNoLongerNeeded(NpcData.Npc)
                        local targetCoords = Config.NPCLocations.TakeLocations[NpcData.LastNpc]
                        TaskGoStraightToCoord(NpcData.Npc, targetCoords.x, targetCoords.y, targetCoords.z, 1.0, -1, 0.0, 0.0)
                        SendNUIMessage({action = "toggleMeter"})
                        TriggerServerEvent("taxi:server:NpcPay", HorodateurData.TarifActuelle)
                        meterActive = false
                        SendNUIMessage({action = "resetMeter"})
                        exports["soz-hud"]:DrawNotification("Vous avez déposer la personne")
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
            SetBlipRoute(NpcData.NpcBlip, true)
            SetBlipRouteColour(NpcData.NpcBlip, 3)
            NpcData.LastNpc = NpcData.CurrentNpc
            NpcData.Active = true

            CreateThread(function()
                while not NpcData.NpcTaken do

                    local ped = PlayerPedId()
                    local pos = GetEntityCoords(ped)
                    local dist = #(pos -
                                     vector3(Config.NPCLocations.TakeLocations[NpcData.CurrentNpc].x, Config.NPCLocations.TakeLocations[NpcData.CurrentNpc].y,
                                             Config.NPCLocations.TakeLocations[NpcData.CurrentNpc].z))

                    if dist < 20 then
                        if dist < 5 then
                            if IsVehicleStopped(GetVehiclePedIsIn(ped, 0)) then
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
                                lastLocation = GetEntityCoords(PlayerPedId())
                                SendNUIMessage({action = "openMeter", toggle = true, HorodateurData = Config.Horodateur})
                                SendNUIMessage({action = "toggleMeter"})
                                ClearPedTasksImmediately(NpcData.Npc)
                                FreezeEntityPosition(NpcData.Npc, false)
                                TaskEnterVehicle(NpcData.Npc, veh, -1, freeSeat, 1.0, 0)
                                exports["soz-hud"]:DrawNotification("Amenez la Personne a la déstination spécifiée")
                                if NpcData.NpcBlip ~= nil then
                                    RemoveBlip(NpcData.NpcBlip)
                                end
                                GetDeliveryLocation()
                                NpcData.NpcTaken = true
                            end
                        end
                    end

                    Wait(1)
                end
            end)
        else
            exports["soz-hud"]:DrawNotification("Vous êtes déjà en mission")
        end
    else
        exports["soz-hud"]:DrawNotification("Vous n\'êtes pas dans un taxi")
    end
end)
