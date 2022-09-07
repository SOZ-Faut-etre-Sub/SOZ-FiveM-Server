local LastVehicle = nil

local function GetVehicleInfo(VehicleHash)
    for Index, CurrentFlatbed in pairs(Config.Flatbeds) do
        if VehicleHash == GetHashKey(CurrentFlatbed.Hash) then
            return CurrentFlatbed
        end
    end
end
local function GetOwnership(vehicle)
    while not NetworkHasControlOfEntity(vehicle) do
        NetworkRequestControlOfEntity(vehicle)
        Citizen.Wait(0)
    end
end

local function GetVehicles()
    local AllVehicles = {}
    local CurrentHandle, CurrentVehicle = FindFirstVehicle()
    local IsNext = true

    repeat
        table.insert(AllVehicles, CurrentVehicle)
        IsNext, CurrentVehicle = FindNextVehicle()
    until not IsNext

    EndFindVehicle(CurrentHandle)

    return AllVehicles
end

local function IsAllowed(Vehicle)
    local VehicleClass = GetVehicleClass(Vehicle)

    for Index, CurrentClass in pairs(Config.Blacklist) do
        if VehicleClass == CurrentClass then
            return false
        end
    end

    return true
end

local function GetNearestVehicle(CheckCoords, CheckRadius)
    local ClosestVehicle = nil
    local ClosestDistance = math.huge

    for Index, CurrentVehicle in pairs(GetVehicles()) do
        if DoesEntityExist(CurrentVehicle) and IsAllowed(CurrentVehicle) then
            local CurrentCoords = GetEntityCoords(CurrentVehicle)
            local CurrentDistance = Vdist2(CheckCoords, CurrentCoords, false)

            if CurrentDistance < CheckRadius and CurrentDistance < ClosestDistance then
                ClosestVehicle = CurrentVehicle
                ClosestDistance = CurrentDistance
            end
        end
    end

    return ClosestVehicle
end

RegisterNetEvent("soz-flatbed:client:action")
AddEventHandler("soz-flatbed:client:action", function(entity, Action)
    local VehicleInfo = GetVehicleInfo(GetEntityModel(entity))
    if Action == "attach" then
        if not Entity(entity).state.towedVehicle then
            local ClosestVehicle = GetNearestVehicle(GetEntityCoords(PlayerPedId()), VehicleInfo.Radius)
            if DoesEntityExist(ClosestVehicle) and ClosestVehicle ~= entity then
                GetOwnership(entity)
                GetOwnership(ClosestVehicle)
                AttachEntityToEntity(ClosestVehicle, VehicleInfo, nil, GetEntityBoneIndexByName(VehicleInfo, "scoop"), vector3(0.0, 0.0, 0.0), true, false,
                                     false, false, nil, true)
                TriggerServerEvent("soz-flatbed:server:setupstate", VehToNet(entity), "towedVehicle", VehToNet(ClosestVehicle))
                TriggerEvent("InteractSound_CL:PlayOnOne", "seatbelt/buckle", 0.2)
                exports["soz-hud"]:DrawNotification("Vous avez attaché le véhicule !")
            end
        end
    elseif Action == "detach" then
        if Entity(entity).state.towedVehicle then
            local AttachedVehicle = NetworkGetEntityFromNetworkId(Entity(entity).state.towedVehicle)
            GetOwnership(entity)
            GetOwnership(AttachedVehicle)
            DetachEntity(AttachedVehicle, true, true)
            TriggerServerEvent("soz-flatbed:server:setupstate", VehToNet(entity), "towedVehicle", nil)
            TriggerEvent("InteractSound_CL:PlayOnOne", "seatbelt/unbuckle", 0.2)
            exports["soz-hud"]:DrawNotification("Vous avez détaché le véhicule !")
        end
    end
    TriggerServerEvent("soz-flatbed:server:setupstate", VehToNet(entity), "busy", false)
end)

RegisterNetEvent("soz-flatbed:client:tpaction")
AddEventHandler("soz-flatbed:client:tpaction", function(flatbed, vehicle)
    if not DoesEntityExist(NetworkGetEntityFromNetworkId(Entity(flatbed).state.towedVehicle)) then
        if DoesEntityExist(vehicle) and vehicle ~= flatbed then
            GetOwnership(flatbed)
            GetOwnership(vehicle)
            AttachEntityToEntity(vehicle, flatbed, GetEntityBoneIndexByName(flatbed, "scoop"), vector3(0, 0.5, 20), vector3(0.0, 0.0, 0.6), true, false, false,
                                 false, nil, true)
            TriggerServerEvent("soz-flatbed:server:setupstate", VehToNet(flatbed), "towedVehicle", VehToNet(vehicle))
            TriggerEvent("InteractSound_CL:PlayOnOne", "seatbelt/buckle", 0.2)
            exports["soz-hud"]:DrawNotification("Vous avez mis le véhicule sur le plateau !")
        end
    else
        local AttachedVehicle = NetworkGetEntityFromNetworkId(Entity(flatbed).state.towedVehicle)
        local AttachedCoords = GetEntityCoords(AttachedVehicle)
        local FlatCoords = GetEntityCoords(flatbed)
        GetOwnership(flatbed)
        GetOwnership(AttachedVehicle)
        DetachEntity(AttachedVehicle, true, true)
        GetOwnership(AttachedVehicle)
        SetEntityCoords(AttachedVehicle, FlatCoords.x - ((FlatCoords.x - AttachedCoords.x) * 4), FlatCoords.y - ((FlatCoords.y - AttachedCoords.y) * 4),
                        FlatCoords.z, false, false, false, false)
        TriggerServerEvent("soz-flatbed:server:setupstate", VehToNet(flatbed), "towedVehicle", nil)
        TriggerEvent("InteractSound_CL:PlayOnOne", "seatbelt/unbuckle", 0.2)
        exports["soz-hud"]:DrawNotification("Vous avez enlevé le véhicule du plateau !")
    end
    TriggerServerEvent("soz-flatbed:server:setupstate", VehToNet(flatbed), "busy", false)
end)

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(20)

        if not DoesEntityExist(LastVehicle) or NetworkGetEntityOwner(LastVehicle) ~= PlayerId() then
            LastVehicle = nil
        end

        local PlayerVehicle = GetVehiclePedIsIn(PlayerPedId(), false)

        if PlayerVehicle ~= 0 then
            if PlayerVehicle ~= LastVehicle then
                local VehicleModel = GetEntityModel(PlayerVehicle)

                for Index, CurrentFlatbed in pairs(Config.Flatbeds) do
                    if VehicleModel == GetHashKey(CurrentFlatbed.Hash) then
                        LastVehicle = PlayerVehicle

                        TriggerServerEvent("soz-flatbed:server:setupstate", VehToNet(LastVehicle), "busy", false)
                        TriggerServerEvent("soz-flatbed:server:setupstate", VehToNet(LastVehicle), "status", false)
                        TriggerServerEvent("soz-flatbed:server:setupstate", VehToNet(LastVehicle), "towedVehicle", nil)

                        break
                    end
                end
            else
                if Entity(LastVehicle).state.towedVehicle and DoesEntityExist(NetworkGetEntityFromNetworkId(Entity(LastVehicle).state.towedVehicle)) then
                    DisableCamCollisionForEntity(NetworkGetEntityFromNetworkId(Entity(LastVehicle).state.towedVehicle))
                end
            end
        else
            if LastVehicle then
                local VehicleInfo = GetVehicleInfo(GetEntityModel(LastVehicle))

                for ExtraId, ExtraValue in pairs(VehicleInfo.Extras) do
                    if ExtraValue then
                        if not IsVehicleExtraTurnedOn(LastVehicle, ExtraId) then
                            SetVehicleExtra(LastVehicle, ExtraId, false)
                        end
                    else
                        if IsVehicleExtraTurnedOn(LastVehicle, ExtraId) then
                            SetVehicleExtra(LastVehicle, ExtraId, true)
                        end
                    end
                end
            end
        end
    end
end)

local function ActionFlatbed(entity)
    if not Entity(entity).state.busy then
        TriggerServerEvent("soz-flatbed:server:setupstate", VehToNet(entity), "busy", true)
        if not Entity(entity).state.status then
            TriggerEvent("soz-flatbed:client:action", entity, "lower")
        else
            TriggerEvent("soz-flatbed:client:action", entity, "raise")
        end
    end
end

local function ChainesFlatbed(entity)
    if not Entity(entity).state.busy then
        if Entity(entity).state.status then
            TriggerServerEvent("soz-flatbed:server:setupstate", VehToNet(entity), "busy", true)
            if Entity(entity).state.towedVehicle then
                TriggerEvent("soz-flatbed:client:action", entity, "detach")
            else
                TriggerEvent("soz-flatbed:client:action", entity, "attach")
            end
        end
    end
end

local function TpFlatbed(entity, lastveh)
    if lastveh then
        if not Entity(lastveh).state.busy then
            TriggerServerEvent("soz-flatbed:server:setupstate", VehToNet(lastveh), "busy", true)
            if not Entity(lastveh).state.towedVehicle then
                TriggerEvent("soz-flatbed:client:tpaction", lastveh, entity)
            end
        end
    else
        if not Entity(entity).state.busy then
            TriggerServerEvent("soz-flatbed:server:setupstate", VehToNet(entity), "busy", true)
            if Entity(entity).state.towedVehicle then
                TriggerEvent("soz-flatbed:client:tpaction", entity, nil)
            end
        end
    end
end

RegisterNetEvent("soz-flatbed:client:calltp", function(entity, lastveh)
    TpFlatbed(entity, lastveh)
end)

RegisterNetEvent("soz-flatbed:client:callchaines", function(entity)
    ChainesFlatbed(entity)
end)

RegisterNetEvent("soz-flatbed:client:callaction", function(entity)
    ActionFlatbed(entity)
end)

CreateThread(function()
    exports["qb-target"]:AddGlobalVehicle({
        options = {
            {
                type = "client",
                icon = "c:mechanic/Retirer.png",
                event = "soz-flatbed:client:calltp",
                label = "Démorquer",
                action = function(entity)
                    TriggerEvent("soz-flatbed:client:calltp", entity)
                end,
                canInteract = function(entity, distance, data)
                    if OnDuty == false then
                        return false
                    end
                    return Entity(entity).state.towedVehicle
                end,
                job = "bennys",
            },
            {
                type = "client",
                icon = "c:mechanic/Mettre.png",
                event = "soz-flatbed:client:calltp",
                label = "Remorquer",
                action = function(entity)
                    local lastveh = GetVehiclePedIsIn(PlayerPedId(), true)
                    TriggerEvent("soz-flatbed:client:calltp", entity, lastveh)
                end,
                canInteract = function(entity, distance, data)
                    if OnDuty == false then
                        return false
                    end
                    if (GetEntityModel(GetVehiclePedIsIn(PlayerPedId(), true)) ~= GetHashKey("flatbed3")) or
                        (#(GetEntityCoords(GetVehiclePedIsIn(PlayerPedId(), true)) - GetEntityCoords(PlayerPedId())) >= 70) then
                        return false
                    end
                    return true
                end,
                job = "bennys",
            },
        },
        distance = 3,
    })
end)
