local QBCore = exports["qb-core"]:GetCoreObject()
local LastVehicle = nil
local LastStatus = false
local LastAttach = false
local Busy = false

function GetVehicleInfo(VehicleHash)
    for Index, CurrentFlatbed in pairs(Config.Flatbeds) do
        if VehicleHash == GetHashKey(CurrentFlatbed.Hash) then
            return CurrentFlatbed
        end
    end
end

function Notify(Text)
    SetNotificationTextEntry("STRING")
    AddTextComponentString(Text)
    DrawNotification(0, 1)
end

function GetVehicles()
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

function IsAllowed(Vehicle)
    local VehicleClass = GetVehicleClass(Vehicle)

    for Index, CurrentClass in pairs(Config.Blacklist) do
        if VehicleClass == CurrentClass then
            return false
        end
    end

    return true
end

function GetNearestVehicle(CheckCoords, CheckRadius)
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
        local VehicleInfo = GetVehicleInfo(GetEntityModel(LastVehicle))
        local NewBed = CreateObjectNoOffset(GetHashKey(Config.BedProp), GetEntityCoords(LastVehicle), true, false, false)

        AttachEntityToEntity(NewBed, LastVehicle, nil, VehicleInfo.Default.Pos, VehicleInfo.Default.Rot, true, false, true, false, nil, true)

        TriggerServerEvent("soz-flatbed:server:editProp", NetworkGetNetworkIdFromEntity(LastVehicle), "Prop", NetworkGetNetworkIdFromEntity(NewBed))

        LastStatus = false
        LastAttach = nil
    else
        LastStatus = BedInfo.Status
        LastAttach = NetworkGetEntityFromNetworkId(BedInfo.Attached)
    end
end)

RegisterNetEvent("soz-flatbed:client:action")
AddEventHandler("soz-flatbed:client:action", function(BedInfo, Action)
    if BedInfo and DoesEntityExist(NetworkGetEntityFromNetworkId(BedInfo.Prop)) then
        local VehicleInfo = GetVehicleInfo(GetEntityModel(LastVehicle))
        local PropID = NetworkGetEntityFromNetworkId(BedInfo.Prop)
        if Action == "lower" then
            if not BedInfo.Status then
                local BedPos = VehicleInfo.Default.Pos
                local BedRot = VehicleInfo.Default.Rot

                repeat
                    Citizen.Wait(10)
                    BedPos = math.floor((BedPos - vector3(0.0, 0.02, 0.0)) * 1000) / 1000

                    if BedPos.y < VehicleInfo.Active.Pos.y then
                        BedPos = vector3(BedPos.x, VehicleInfo.Active.Pos.y, BedPos.z)
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

                    DetachEntity(PropID, false, false)
                    AttachEntityToEntity(PropID, LastVehicle, nil, BedPos, BedRot, true, false, true, false, nil, true)
                until BedRot.x == VehicleInfo.Active.Rot.x and BedPos.z == VehicleInfo.Active.Pos.z
            end

            LastStatus = true
        elseif Action == "raise" then
            if not BedInfo.Status then
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

                    DetachEntity(PropID, false, false)
                    AttachEntityToEntity(PropID, LastVehicle, nil, BedPos, BedRot, true, false, true, false, nil, true)
                until BedRot.x == VehicleInfo.Default.Rot.x and BedPos.z == VehicleInfo.Default.Pos.z

                repeat
                    Citizen.Wait(10)
                    BedPos = math.floor((BedPos + vector3(0.0, 0.02, 0.0)) * 1000) / 1000

                    if BedPos.y > VehicleInfo.Default.Pos.y then
                        BedPos = vector3(BedPos.x, VehicleInfo.Default.Pos.y, BedPos.z)
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
                    AttachEntityToEntity(ClosestVehicle, PropID, nil, GetOffsetFromEntityGivenWorldCoords(PropID, VehicleCoords), vector3(0.0, 0.0, 0.0), true,
                                         false, false, false, nil, true)

                    TriggerServerEvent("soz-flatbed:server:editProp", NetworkGetNetworkIdFromEntity(LastVehicle), "Attached",
                                       NetworkGetNetworkIdFromEntity(ClosestVehicle))
                end
            end

            LastAttach = NetworkGetEntityFromNetworkId(BedInfo.Attached)
        elseif Action == "detach" then
            if BedInfo.Attached then
                local AttachedVehicle = NetworkGetEntityFromNetworkId(BedInfo.Attached)

                DetachEntity(AttachedVehicle, true, true)
                TriggerServerEvent("soz-flatbed:server:editProp", NetworkGetNetworkIdFromEntity(LastVehicle), "Attached", nil)
            end

            LastAttach = nil
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
                AttachEntityToEntity(entity, PropID, nil, GetOffsetFromEntityGivenWorldCoords(PropID, AttachCoords), vector3(0.0, 0.0, 0.6), true, false, false,
                                     false, nil, true)

                TriggerServerEvent("soz-flatbed:server:editProp", NetworkGetNetworkIdFromEntity(entity), "Attached", NetworkGetNetworkIdFromEntity(entity))
            end
        end
        LastAttach = NetworkGetEntityFromNetworkId(BedInfo.Attached)
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
            TriggerServerEvent("soz-flatbed:server:action", NetworkGetNetworkIdFromEntity(entity), "lower")
        else
            Busy = true
            TriggerServerEvent("soz-flatbed:server:action", NetworkGetNetworkIdFromEntity(entity), "raise")
        end
    end
end

local function ChainesFlatbed(entity)
    if not Busy then
        if LastStatus then
            Busy = true
            if LastAttach then
                TriggerServerEvent("soz-flatbed:server:action", NetworkGetNetworkIdFromEntity(entity), "detach")
            else
                TriggerServerEvent("soz-flatbed:server:action", NetworkGetNetworkIdFromEntity(entity), "attach")
            end
        end
    end
end

local function TpFlatbed(entity, lastveh)
    if not Busy then
        if LastStatus then
            Busy = true
            if not LastAttach then
                TriggerServerEvent("soz-flatbed:server:tpaction", NetworkGetNetworkIdFromEntity(lastveh), lastveh, entity)
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
                icon = "fas fa-car-crash",
                event = "soz-flatbed:client:callaction",
                label = "Activer la rampe",
                targeticon = "fas fa-truck-loading",
                action = function(entity)
                    if IsPedAPlayer(entity) then
                        return false
                    end
                    TriggerEvent("soz-flatbed:client:callaction", entity)
                end,
                canInteract = function(entity, distance, data)
                    if GetEntityModel(entity) ~= GetHashKey("flatbed3") then
                        return false
                    end
                    QBCore.Functions.GetPlayerData(function(PlayerData)
                        if PlayerData.job.onduty == false or PlayerData.job.id ~= "bennys" then
                            return false
                        end
                    end)
                    return true
                end,
            },
            {
                type = "client",
                icon = "fas fa-key",
                event = "soz-flatbed:client:callchaines",
                label = "Chaînes du véhicule",
                targeticon = "fas fa-truck-loading",
                action = function(entity)
                    if IsPedAPlayer(entity) then
                        return false
                    end
                    TriggerEvent("soz-flatbed:client:callchaines", entity)
                end,
                canInteract = function(entity, distance, data)
                    if GetEntityModel(entity) ~= GetHashKey("flatbed3") then
                        return false
                    end
                    QBCore.Functions.GetPlayerData(function(PlayerData)
                        if PlayerData.job.onduty == false or PlayerData.job.id ~= "bennys" then
                            return false
                        end
                    end)
                    return true
                end,
            },
            {
                type = "client",
                icon = "fas fa-car-crash",
                event = "soz-flatbed:client:calltp",
                label = "Mettre sur la rampe",
                targeticon = "fas fa-dolly",
                action = function(entity)
                    if IsPedAPlayer(entity) then
                        return false
                    end
                    local lastveh = GetVehiclePedIsIn(PlayerPedId(), true)
                    TriggerEvent("soz-flatbed:client:calltp", entity, lastveh)
                end,
                canInteract = function(entity, distance, data)
                    if GetEntityModel(entity) == GetHashKey("flatbed3") then
                        return false
                    end
                    QBCore.Functions.GetPlayerData(function(PlayerData)
                        if PlayerData.job.onduty == false or PlayerData.job.id ~= "bennys" then
                            return false
                        end
                    end)
                    if (GetEntityModel(GetVehiclePedIsIn(PlayerPedId(), true)) ~= GetHashKey("flatbed3")) or
                        (#(GetEntityCoords(GetVehiclePedIsIn(PlayerPedId(), true)) - GetEntityCoords(PlayerPedId())) >= 20) then
                        return false
                    end
                    return true
                end,
            },
        },
        distance = 2.5,
    })
end)
