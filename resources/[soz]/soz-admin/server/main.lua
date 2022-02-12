local QBCore = exports["qb-core"]:GetCoreObject()

QBCore.Functions.CreateCallback("admin:server:isAllowed", function(source, cb)
    local isAllowed = false

    for _, role in ipairs(Config.AllowedRole) do
        if QBCore.Functions.HasPermission(source, role) then
            isAllowed = true
        end
    end

    cb(isAllowed)
end)

QBCore.Functions.CreateCallback("admin:server:getplayers", function(source, cb)
    local players = {}
    for k, v in pairs(QBCore.Functions.GetPlayers()) do
        local targetped = GetPlayerPed(v)
        local ped = QBCore.Functions.GetPlayer(v)
        table.insert(players, {
            name = ped.PlayerData.charinfo.firstname .. " " .. ped.PlayerData.charinfo.lastname .. " | (" .. GetPlayerName(v) .. ")",
            id = v,
            coords = GetEntityCoords(targetped),
            cid = ped.PlayerData.charinfo.firstname .. " " .. ped.PlayerData.charinfo.lastname,
            citizenid = ped.PlayerData.citizenid,
            sources = GetPlayerPed(ped.PlayerData.source),
            sourceplayer = ped.PlayerData.source,

        })
    end
    cb(players)
end)

RegisterNetEvent("admin:server:goto", function(player)
    local src = source
    local admin = GetPlayerPed(src)
    local coords = GetEntityCoords(GetPlayerPed(player.id))
    SetEntityCoords(admin, coords)
end)

RegisterNetEvent("admin:server:bring", function(player)
    local src = source
    local admin = GetPlayerPed(src)
    local coords = GetEntityCoords(admin)
    local target = GetPlayerPed(player.id)
    SetEntityCoords(target, coords)
end)

RegisterNetEvent("admin:server:spectate", function(player)
    local src = source
    local targetped = GetPlayerPed(player.id)
    local coords = GetEntityCoords(targetped)
    TriggerClientEvent("admin:client:spectate", src, player.id, coords)
end)

RegisterNetEvent("admin:server:freeze", function(player)
    local target = GetPlayerPed(player.id)
    if not frozen then
        frozen = true
        FreezeEntityPosition(target, true)
    else
        frozen = false
        FreezeEntityPosition(target, false)
    end
end)

RegisterNetEvent("admin:server:intovehicle", function(player)
    local src = source
    local admin = GetPlayerPed(src)
    local targetPed = GetPlayerPed(player.id)
    local vehicule = GetVehiclePedIsIn(targetPed, false)
    local seat = -1
    if vehicule ~= 0 then
        for i = 0, 8, 1 do
            if GetPedInVehicleSeat(vehicule, i) == 0 then
                seat = i
                break
            end
        end
        if seat ~= -1 then
            SetPedIntoVehicle(admin, vehicule, seat)
            TriggerClientEvent("QBCore:Notify", src, "Monté dans le véhicule", "success", 5000)
        else
            TriggerClientEvent("QBCore:Notify", src, "Le véhicule n'a pas de siège libre!", "error", 5000)
        end
    else
        TriggerClientEvent("QBCore:Notify", src, "Le joueur n'est pas dans un véhicule!", "error", 5000)
    end
end)

RegisterNetEvent("admin:server:kill", function(player)
    TriggerClientEvent("core:client:KillPlayer", player.id)
end)

RegisterNetEvent("admin:server:revive", function(player)
    TriggerClientEvent("core:client:Revive", player.id)
end)