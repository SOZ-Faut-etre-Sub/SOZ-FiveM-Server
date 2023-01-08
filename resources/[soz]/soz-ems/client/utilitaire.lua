local lit_ems = {2117668672, 1631638868, -1182962909}

exports["qb-target"]:AddTargetModel(lit_ems, {
    options = {
        {
            icon = "fas fa-bed",
            label = "S'allonger sur le lit",
            action = function(entity)
                local player = GetPlayerPed(-1)
                local coords = GetEntityCoords(entity)
                local heading = GetEntityHeading(entity)
                if heading >= 180 then
                    heading = heading - 179
                else
                    heading = heading + 179
                end
                SetEntityHeading(player, heading)
                SetPedCoordsKeepVehicle(player, coords.x, coords.y, coords.z + 0.1)
                TaskPlayAnim(player, "anim@gangops@morgue@table@", "body_search", 1.0, 1.0, -1, 1, 0, 0, 0, 0)
            end,
        },
    },
    distance = 2.5,
})

local function GetDeadPedInVehicle(entity)
    local vehicleSeats = GetVehicleModelNumberOfSeats(GetHashKey(GetEntityModel(entity)))
    for i = -1, vehicleSeats do
        local ped = GetPedInVehicleSeat(entity, i)
        if Player(GetPlayerServerId(NetworkGetPlayerIndexFromPed(ped))).state.isdead then
            return ped
        end
    end

    return nil
end

exports["qb-target"]:AddGlobalVehicle({
    options = {
        {
            label = "Extraire le mort",
            icon = "c:ems/sortir.png",
            canInteract = function(entity)
                return PlayerData.job.onduty and GetDeadPedInVehicle(entity) ~= nil
            end,
            action = function(entity)
                local ped = GetDeadPedInVehicle(entity)
                local coords = GetEntityCoords(PlayerPedId())
                TriggerServerEvent("lsmc:server:tp", GetPlayerServerId(NetworkGetPlayerIndexFromPed(ped)), coords)
            end,
            job = "lsmc",
        },
    },
    distance = 2.5,
})

RegisterNetEvent("lsmc:client:VehTpDead")
AddEventHandler("lsmc:client:VehTpDead", function(coords)
    StartPlayerTeleport(PlayerId(), coords.x, coords.y, coords.z, 0.0, false, true, true)
    Citizen.Wait(1000)
    ClearPedTasksImmediately(PlayerPedId())
end)
