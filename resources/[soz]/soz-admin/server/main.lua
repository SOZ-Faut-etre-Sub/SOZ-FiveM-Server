QBCore = exports["qb-core"]:GetCoreObject()
SozAdmin = {}

--- Functions
SozAdmin.Functions = {}

SozAdmin.Functions.IsPlayerAdmin = function(source)
    return QBCore.Functions.HasPermission(source, "admin")
end

SozAdmin.Functions.IsPlayerStaff = function(source)
    return QBCore.Functions.HasPermission(source, "staff") or QBCore.Functions.HasPermission(source, "admin")
end

SozAdmin.Functions.IsPlayerHelper = function(source)
    return QBCore.Functions.HasPermission(source, "helper") or QBCore.Functions.HasPermission(source, "staff") or
               QBCore.Functions.HasPermission(source, "admin")
end

CheckIsAdminMenuIsAvailable = function(source)
    for _, role in ipairs(Config.AllowedRole) do
        if QBCore.Functions.HasPermission(source, role) then
            return true
        end
    end

    return false
end

QBCore.Functions.CreateCallback("admin:server:isAllowed", function(source, cb)
    if SozAdmin.Functions.IsPlayerAdmin(source) then
        cb(true, "admin")
    elseif SozAdmin.Functions.IsPlayerStaff(source) then
        cb(true, "staff")
    elseif SozAdmin.Functions.IsPlayerHelper(source) then
        cb(true, "helper")
    else
        cb(false)
    end
end)

QBCore.Functions.CreateCallback("admin:server:getplayers", function(source, cb)
    if not SozAdmin.Functions.IsPlayerHelper(source) then
        return
    end

    local players = {}
    for k, v in pairs(QBCore.Functions.GetPlayers()) do
        local targetped = GetPlayerPed(v)
        local ped = QBCore.Functions.GetPlayer(v)
        table.insert(players, {
            name = ped.PlayerData.charinfo.firstname .. " " .. ped.PlayerData.charinfo.lastname .. " | (" .. GetPlayerName(v) .. ")",
            id = v,
            coords = GetEntityCoords(targetped),
            heading = GetEntityHeading(targetped),
            cid = ped.PlayerData.charinfo.firstname .. " " .. ped.PlayerData.charinfo.lastname,
            citizenid = ped.PlayerData.citizenid,
            sources = GetPlayerPed(ped.PlayerData.source),
            sourceplayer = ped.PlayerData.source,

        })
    end
    cb(players)
end)

RegisterNetEvent("admin:server:addPersistentProp", function(model, event, position)
    if not SozAdmin.Functions.IsPlayerHelper(source) then
        return
    end

    exports.oxmysql:insert("INSERT INTO persistent_prop (model, event, position) VALUES (:model, :event, :position)",
                           {["model"] = model, ["event"] = event, ["position"] = json.encode(position)}, function()
        TriggerEvent("core:server:refreshPersistentProp")
    end)
end)

RegisterNetEvent("admin:server:goto", function(player)
    if not SozAdmin.Functions.IsPlayerHelper(source) then
        return
    end

    local src = source
    local admin = GetPlayerPed(src)
    local coords = GetEntityCoords(GetPlayerPed(player.id))
    SetEntityCoords(admin, coords)
end)

RegisterNetEvent("admin:server:bring", function(player)
    if not SozAdmin.Functions.IsPlayerHelper(source) then
        return
    end

    local src = source
    local admin = GetPlayerPed(src)
    local coords = GetEntityCoords(admin)
    local target = GetPlayerPed(player.id)
    SetEntityCoords(target, coords)
end)

RegisterNetEvent("admin:server:spectate", function(player)
    if not SozAdmin.Functions.IsPlayerHelper(source) then
        return
    end

    local src = source
    local targetped = GetPlayerPed(player.id)
    local coords = GetEntityCoords(targetped)
    TriggerClientEvent("admin:client:spectate", src, player.id, coords)
end)

RegisterNetEvent("admin:server:freeze", function(player)
    if not SozAdmin.Functions.IsPlayerHelper(source) then
        return
    end

    local target = GetPlayerPed(player.id)
    FreezeEntityPosition(target, true)
end)

RegisterNetEvent("admin:server:unfreeze", function(player)
    if not SozAdmin.Functions.IsPlayerHelper(source) then
        return
    end

    local target = GetPlayerPed(player.id)
    FreezeEntityPosition(target, false)
end)

RegisterNetEvent("admin:server:kill", function(player)
    if not SozAdmin.Functions.IsPlayerHelper(source) then
        return
    end

    TriggerClientEvent("soz_ems:client:KillPlayer", player.id)
end)

RegisterNetEvent("admin:server:revive", function(player)
    if not SozAdmin.Functions.IsPlayerHelper(source) then
        return
    end

    TriggerEvent("lsmc:server:revive", player.id)
end)
