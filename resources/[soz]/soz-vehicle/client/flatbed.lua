local LastVehicle = nil
local LastStatus = false
local LastAttach = false
local Busy = false

local function GetVehicleInfo(VehicleHash)
    for Index, CurrentFlatbed in pairs(Config.Flatbeds) do
        if VehicleHash == GetHashKey(CurrentFlatbed.Hash) then
            return CurrentFlatbed
        end
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

RegisterNetEvent("soz-flatbed:client:getProp")
AddEventHandler("soz-flatbed:client:getProp", function(BedInfo)
    if not BedInfo or not DoesEntityExist(NetworkGetEntityFromNetworkId(BedInfo.Prop)) then
        if NetworkGetEntityOwner(LastVehicle) == NetworkGetPlayerIndexFromPed(PlayerPedId()) then
            local VehicleInfo = GetVehicleInfo(GetEntityModel(LastVehicle))
            local NewBed = CreateObjectNoOffset(GetHashKey(Config.BedProp), GetEntityCoords(LastVehicle), true, false, false)

            AttachEntityToEntity(NewBed, LastVehicle, nil, VehicleInfo.Default.Pos, VehicleInfo.Default.Rot, true, false, true, false, nil, true)

            TriggerServerEvent("soz-flatbed:server:editProp", NetworkGetNetworkIdFromEntity(LastVehicle), "Prop", NetworkGetNetworkIdFromEntity(NewBed))
        end
        LastStatus = false
        LastAttach = nil
    else
        LastStatus = BedInfo.Status
        LastAttach = NetworkGetEntityFromNetworkId(BedInfo.Attached)
    end
end)

RegisterNetEvent("soz-flatbed:client:action")
AddEventHandler("soz-flatbed:client:action", function(BedInfo, Action, owner)
    if BedInfo and DoesEntityExist(NetworkGetEntityFromNetworkId(BedInfo.Prop)) then
        local VehicleInfo = GetVehicleInfo(GetEntityModel(LastVehicle))
        local PropID = NetworkGetEntityFromNetworkId(BedInfo.Prop)
        if Action == "lower" then
            if not BedInfo.Status then
                exports["soz-hud"]:DrawNotification("Le plateau descend !")
                local BedPos = VehicleInfo.Default.Pos
                local BedRot = VehicleInfo.Default.Rot

                repeat
                    Citizen.Wait(10)
                    BedPos = math.floor((BedPos - vector3(0.0, 0.02, 0.0)) * 1000) / 1000

                    if BedPos.y < VehicleInfo.Active.Pos.y then
                        BedPos = vector3(BedPos.x, VehicleInfo.Active.Pos.y, BedPos.z)
                    end
                    while not NetworkHasControlOfEntity(LastVehicle) do
                        NetworkRequestControlOfEntity(LastVehicle)
                        Citizen.Wait(0)
                    end
                    DetachEntity(PropID, false, false)
                    AttachEntityToEntity(PropID, LastVehicle, nil, BedPos, BedRot, true, false, true, false, nil, true)
                until BedPos.y == VehicleInfo.Active.Pos.y

                repeat
                    Citizen.Wait(10)
                    if BedPos.z ~= VehicleInfo.Active.Pos.z then
                        BedPos = math.floor((BedPos - vector3(0.0, 0.0, 0.0105)) * 1000) / 1000

                        if BedPos.z < VehicleInfo.Active.Pos.z then
                            BedPos = vector3(BedPos.x, BedPos.y, VehicleInfo.Active.Pos.z)
                        end
                    end
                    if BedRot.x ~= VehicleInfo.Active.Rot.x then
                        BedRot = math.floor((BedRot + vector3(0.15, 0, 0.0)) * 1000) / 1000

                        if BedRot.x > VehicleInfo.Active.Rot.x then
                            BedRot = vector3(VehicleInfo.Active.Rot.x, 0.0, 0.0)
                        end
                    end
                    while not NetworkHasControlOfEntity(LastVehicle) do
                        NetworkRequestControlOfEntity(LastVehicle)
                        Citizen.Wait(0)
                    end
                    DetachEntity(PropID, false, false)
                    AttachEntityToEntity(PropID, LastVehicle, nil, BedPos, BedRot, true, false, true, false, nil, true)
                until BedRot.x == VehicleInfo.Active.Rot.x and BedPos.z == VehicleInfo.Active.Pos.z
            end
            LastStatus = true
        elseif Action == "raise" then
            if not BedInfo.Status then
                exports["soz-hud"]:DrawNotification("Le plateau remonte !")
                local BedPos = VehicleInfo.Active.Pos
                local BedRot = VehicleInfo.Active.Rot

                repeat
                    Citizen.Wait(10)
                    if BedPos.z ~= VehicleInfo.Default.Pos.z then
                        BedPos = math.floor((BedPos + vector3(0.0, 0.0, 0.0105)) * 1000) / 1000

                        if BedPos.z > VehicleInfo.Default.Pos.z then
                            BedPos = vector3(BedPos.x, BedPos.y, VehicleInfo.Default.Pos.z)
                        end
                    end
                    if BedRot.x ~= VehicleInfo.Default.Rot.x then
                        BedRot = math.floor((BedRot - vector3(0.15, 0, 0.0)) * 1000) / 1000

                        if BedRot.x < VehicleInfo.Default.Rot.x then
                            BedRot = vector3(VehicleInfo.Default.Rot.x, 0.0, 0.0)
                        end
                    end
                    while not NetworkHasControlOfEntity(LastVehicle) do
                        NetworkRequestControlOfEntity(LastVehicle)
                        Citizen.Wait(0)
                    end
                    DetachEntity(PropID, false, false)
                    AttachEntityToEntity(PropID, LastVehicle, nil, BedPos, BedRot, true, false, true, false, nil, true)
                until BedRot.x == VehicleInfo.Default.Rot.x and BedPos.z == VehicleInfo.Default.Pos.z

                repeat
                    Citizen.Wait(10)
                    BedPos = math.floor((BedPos + vector3(0.0, 0.02, 0.0)) * 1000) / 1000

                    if BedPos.y > VehicleInfo.Default.Pos.y then
                        BedPos = vector3(BedPos.x, VehicleInfo.Default.Pos.y, BedPos.z)
                    end
                    while not NetworkHasControlOfEntity(LastVehicle) do
                        NetworkRequestControlOfEntity(LastVehicle)
                        Citizen.Wait(0)
                    end
                    DetachEntity(PropID, false, false)
                    AttachEntityToEntity(PropID, LastVehicle, nil, BedPos, BedRot, true, false, true, false, nil, true)
                until BedPos.y == VehicleInfo.Default.Pos.y
            end
            LastStatus = false
        elseif Action == "attach" then
            if not BedInfo.Attached then
                local AttachCoords = GetOffsetFromEntityInWorldCoords(PropID, vector3(VehicleInfo.Attach.x, VehicleInfo.Attach.y, 0.0))
                local ClosestVehicle = GetNearestVehicle(AttachCoords, VehicleInfo.Radius)
                if DoesEntityExist(ClosestVehicle) and ClosestVehicle ~= LastVehicle then
                    local VehicleCoords = GetEntityCoords(ClosestVehicle)
                    while not NetworkHasControlOfEntity(ClosestVehicle) do
                        NetworkRequestControlOfEntity(ClosestVehicle)
                        Citizen.Wait(0)
                    end
                    AttachEntityToEntity(ClosestVehicle, PropID, nil, GetOffsetFromEntityGivenWorldCoords(PropID, VehicleCoords), vector3(0.0, 0.0, 0.0), true,
                                         false, false, false, nil, true)
                    TriggerServerEvent("soz-flatbed:server:editProp", NetworkGetNetworkIdFromEntity(LastVehicle), "Attached",
                                       NetworkGetNetworkIdFromEntity(ClosestVehicle))
                end
            end
            TriggerEvent("InteractSound_CL:PlayOnOne", "seatbelt/buckle", 0.2)
            exports["soz-hud"]:DrawNotification("Vous avez attaché le véhicule !")
            LastAttach = NetworkGetEntityFromNetworkId(BedInfo.Attached)
        elseif Action == "detach" then
            if BedInfo.Attached then
                local AttachedVehicle = NetworkGetEntityFromNetworkId(BedInfo.Attached)
                while not NetworkHasControlOfEntity(AttachedVehicle) do
                    NetworkRequestControlOfEntity(AttachedVehicle)
                    Citizen.Wait(0)
                end
                DetachEntity(AttachedVehicle, true, true)
                TriggerServerEvent("soz-flatbed:server:editProp", NetworkGetNetworkIdFromEntity(LastVehicle), "Attached", nil)
            end
            LastAttach = nil
            TriggerEvent("InteractSound_CL:PlayOnOne", "seatbelt/unbuckle", 0.2)
            exports["soz-hud"]:DrawNotification("Vous avez détaché le véhicule !")
        end
    else
        TriggerServerEvent("soz-flatbed:server:getProp", NetworkGetNetworkIdFromEntity(LastVehicle))
    end

    Busy = false
end)

RegisterNetEvent("soz-flatbed:client:tpaction")
AddEventHandler("soz-flatbed:client:tpaction", function(BedInfo, lastveh, entity)
    if BedInfo and DoesEntityExist(NetworkGetEntityFromNetworkId(BedInfo.Prop)) then
        local VehicleInfo = GetVehicleInfo(GetEntityModel(lastveh))
        local PropID = NetworkGetEntityFromNetworkId(BedInfo.Prop)
        if not BedInfo.Attached then
            local AttachCoords = GetOffsetFromEntityInWorldCoords(PropID, vector3(VehicleInfo.Attach.x, VehicleInfo.Attach.y, 0.6))
            if DoesEntityExist(entity) and entity ~= lastveh then
                while not NetworkHasControlOfEntity(entity) do
                    NetworkRequestControlOfEntity(entity)
                    Citizen.Wait(0)
                end
                AttachEntityToEntity(entity, PropID, nil, GetOffsetFromEntityGivenWorldCoords(PropID, AttachCoords), vector3(0.0, 0.0, 0.6), true, false, false,
                                     false, nil, true)
                TriggerServerEvent("soz-flatbed:server:editProp", NetworkGetNetworkIdFromEntity(lastveh), "Attached", NetworkGetNetworkIdFromEntity(entity))
                TriggerEvent("InteractSound_CL:PlayOnOne", "seatbelt/buckle", 0.2)
                exports["soz-hud"]:DrawNotification("Vous avez mis le véhicule sur le plateau !")
            end
            LastAttach = NetworkGetEntityFromNetworkId(BedInfo.Attached)
        else
            local AttachedVehicle = NetworkGetEntityFromNetworkId(BedInfo.Attached)
            local AttachedCoords = GetEntityCoords(AttachedVehicle)
            local FlatCoords = GetEntityCoords(lastveh)
            while not NetworkHasControlOfEntity(AttachedVehicle) do
                NetworkRequestControlOfEntity(AttachedVehicle)
                Citizen.Wait(0)
            end
            DetachEntity(AttachedVehicle, true, true)
            SetEntityCoords(AttachedVehicle, FlatCoords.x - ((FlatCoords.x - AttachedCoords.x) * 4), FlatCoords.y - ((FlatCoords.y - AttachedCoords.y) * 4),
                            FlatCoords.z, false, false, false, false)
            TriggerServerEvent("soz-flatbed:server:editProp", NetworkGetNetworkIdFromEntity(lastveh), "Attached", nil)
            LastAttach = nil
            TriggerEvent("InteractSound_CL:PlayOnOne", "seatbelt/unbuckle", 0.2)
            exports["soz-hud"]:DrawNotification("Vous avez enlevé le véhicule du plateau !")
        end
    else
        TriggerServerEvent("soz-flatbed:server:getProp", NetworkGetNetworkIdFromEntity(entity))
    end
    Busy = false
end)

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(1)

        if not DoesEntityExist(LastVehicle) or NetworkGetEntityOwner(LastVehicle) ~= PlayerId() then
            LastVehicle = nil
            LastStatus = false
            LastAttach = nil
        end

        local PlayerVehicle = GetVehiclePedIsIn(PlayerPedId(), false)

        if PlayerVehicle ~= 0 then
            if PlayerVehicle ~= LastVehicle then
                local VehicleModel = GetEntityModel(PlayerVehicle)

                for Index, CurrentFlatbed in pairs(Config.Flatbeds) do
                    if VehicleModel == GetHashKey(CurrentFlatbed.Hash) then
                        LastVehicle = PlayerVehicle
                        TriggerServerEvent("soz-flatbed:server:getProp", NetworkGetNetworkIdFromEntity(PlayerVehicle))
                        break
                    end
                end
            else
                if LastAttach and DoesEntityExist(LastAttach) then
                    DisableCamCollisionForEntity(LastAttach)
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
    if not Busy then
        if not LastStatus then
            Busy = true
            TriggerServerEvent("soz-flatbed:server:action", NetworkGetNetworkIdFromEntity(entity), "lower", GetPlayerServerId(NetworkGetEntityOwner(entity)))
        else
            Busy = true
            TriggerServerEvent("soz-flatbed:server:action", NetworkGetNetworkIdFromEntity(entity), "raise", GetPlayerServerId(NetworkGetEntityOwner(entity)))
        end
    end
end

local function ChainesFlatbed(entity)
    if not Busy then
        if LastStatus then
            Busy = true
            if LastAttach then
                TriggerServerEvent("soz-flatbed:server:action", NetworkGetNetworkIdFromEntity(entity), "detach",
                                   GetPlayerServerId(NetworkGetEntityOwner(entity)))
            else
                TriggerServerEvent("soz-flatbed:server:action", NetworkGetNetworkIdFromEntity(entity), "attach",
                                   GetPlayerServerId(NetworkGetEntityOwner(entity)))
            end
        end
    end
end

local function TpFlatbed(entity, lastveh)
    if not Busy then
        Busy = true
        if LastAttach then
            TriggerServerEvent("soz-flatbed:server:tpaction", NetworkGetNetworkIdFromEntity(entity), entity, nil)
        else
            TriggerServerEvent("soz-flatbed:server:tpaction", NetworkGetNetworkIdFromEntity(lastveh), lastveh, entity)
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
                icon = "c:mechanic/Activer.png",
                event = "soz-flatbed:client:callaction",
                feature = "flatbed-ramp",
                label = "TEST Descendre",
                action = function(entity)
                    TriggerEvent("soz-flatbed:client:callaction", entity)
                end,
                canInteract = function(entity, distance, data)
                    if GetEntityModel(entity) ~= GetHashKey("flatbed3") then
                        return false
                    end
                    if OnDuty == false then
                        return false
                    end
                    return not LastStatus
                end,
                job = "bennys",
            },
            {
                type = "client",
                icon = "c:mechanic/Desactiver.png",
                event = "soz-flatbed:client:callaction",
                feature = "flatbed-ramp",
                label = "TEST Relever",
                action = function(entity)
                    TriggerEvent("soz-flatbed:client:callaction", entity)
                end,
                canInteract = function(entity, distance, data)
                    if GetEntityModel(entity) ~= GetHashKey("flatbed3") then
                        return false
                    end
                    if OnDuty == false then
                        return false
                    end
                    return LastStatus
                end,
                job = "bennys",
            },
            {
                type = "client",
                icon = "c:mechanic/Attacher.png",
                event = "soz-flatbed:client:callchaines",
                feature = "flatbed-ramp",
                label = "TEST Attacher",
                action = function(entity)
                    TriggerEvent("soz-flatbed:client:callchaines", entity)
                end,
                canInteract = function(entity, distance, data)
                    if GetEntityModel(entity) ~= GetHashKey("flatbed3") then
                        return false
                    end
                    if OnDuty == false then
                        return false
                    end
                    return not LastAttach
                end,
                job = "bennys",
            },
            {
                type = "client",
                icon = "c:mechanic/Detacher.png",
                event = "soz-flatbed:client:callchaines",
                feature = "flatbed-ramp",
                label = "TEST Détacher",
                action = function(entity)
                    TriggerEvent("soz-flatbed:client:callchaines", entity)
                end,
                canInteract = function(entity, distance, data)
                    if GetEntityModel(entity) ~= GetHashKey("flatbed3") then
                        return false
                    end
                    if OnDuty == false then
                        return false
                    end
                    return LastAttach
                end,
                job = "bennys",
            },
            {
                type = "client",
                icon = "c:mechanic/Retirer.png",
                event = "soz-flatbed:client:calltp",
                feature = "flatbed-ramp",
                label = "TEST Démorquer",
                action = function(entity)
                    TriggerEvent("soz-flatbed:client:calltp", entity)
                end,
                canInteract = function(entity, distance, data)
                    if GetEntityModel(entity) ~= GetHashKey("flatbed3") then
                        return false
                    end
                    if OnDuty == false then
                        return false
                    end
                    return LastAttach
                end,
                job = "bennys",
            },
            {
                type = "client",
                icon = "c:mechanic/Mettre.png",
                event = "soz-flatbed:client:calltp",
                feature = "flatbed-ramp",
                label = "TEST Remorquer",
                action = function(entity)
                    local lastveh = GetVehiclePedIsIn(PlayerPedId(), true)
                    TriggerEvent("soz-flatbed:client:calltp", entity, lastveh)
                end,
                canInteract = function(entity, distance, data)
                    if GetEntityModel(entity) == GetHashKey("flatbed3") then
                        return false
                    end
                    if OnDuty == false or NetworkGetEntityOwner(GetVehiclePedIsIn(PlayerPedId(), true)) ~= NetworkGetPlayerIndexFromPed(PlayerPedId()) then
                        return false
                    end
                    if (GetEntityModel(GetVehiclePedIsIn(PlayerPedId(), true)) ~= GetHashKey("flatbed3")) or
                        (#(GetEntityCoords(GetVehiclePedIsIn(PlayerPedId(), true)) - GetEntityCoords(PlayerPedId())) >= 50) then
                        return false
                    end
                    return true
                end,
                job = "bennys",
            },
        },
        distance = 3,
    })
    exports["qb-target"]:AddTargetModel(-669511193, {
        options = {
            {
                type = "client",
                icon = "fa-solid fa-ban",
                label = "Supprimer",
                action = function(entity)
                    DeleteEntity(entity)
                end,
                job = "bennys",
            },
        },
        distance = 3,
    })
end)
