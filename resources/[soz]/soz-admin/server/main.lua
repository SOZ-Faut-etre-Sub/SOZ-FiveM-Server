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
