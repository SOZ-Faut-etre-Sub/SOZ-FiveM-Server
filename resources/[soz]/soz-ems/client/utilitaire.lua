local lit_ems = {2117668672, 1631638868, -1182962909}
local targetplayer = nil

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
                SetPedCoordsKeepVehicle(player, coords.x, coords.y, coords.z)
                TaskPlayAnim(player, "anim@gangops@morgue@table@", "body_search", 1.0, 1.0, -1, 1, 0, 0, 0, 0)
            end,
        },
    },
    distance = 2.5,
})

local function GetDead(entity)
    local count = -1
    local isdead = false
    targetplayer = nil
    while count ~= 6 and targetplayer == nil do
        targetplayer = GetPedInVehicleSeat(entity, count)
        isdead = QBCore.Functions.TriggerRpc("lsmc:server:IsDead", GetPlayerServerId(NetworkGetPlayerIndexFromPed(targetplayer)))
        count = count + 1
    end
    if targetplayer ~= nil and targetplayer ~= 0 and isdead then
        return true
    else
        return false
    end
end

--exports["qb-target"]:AddGlobalVehicle({
--    options = {
--        {
--            icon = "c:ems/sortir.png",
--            label = "Extraire le mort",
--            canInteract = function(entity)
--                return GetDead(entity)
--            end,
--            action = function(entity)
--                coords = GetEntityCoords(PlayerPedId())
--                TriggerServerEvent("lsmc:server:tp", GetPlayerServerId(NetworkGetPlayerIndexFromPed(targetplayer)), coords)
--            end,
--        },
--    },
--    distance = 2.5,
--})

RegisterNetEvent("lsmc:client:VehTpDead")
AddEventHandler("lsmc:client:VehTpDead", function(coords)
    StartPlayerTeleport(PlayerId(), coords.x, coords.y, coords.z, 0.0, false, true, true)
end)
