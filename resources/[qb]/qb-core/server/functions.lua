QBCore.Functions = {}

-- Getters
-- Get your player first and then trigger a function on them
-- ex: local player = QBCore.Functions.GetPlayer(source)
-- ex: local example = player.Functions.functionname(parameter)

function QBCore.Functions.GetCoords(entity)
    local coords = GetEntityCoords(entity, false)
    local heading = GetEntityHeading(entity)
    return vector4(coords.x, coords.y, coords.z, heading)
end

function QBCore.Functions.GetIdentifier(source, idtype)
    local src = source
    local idtype = idtype or QBConfig.IdentifierType
    for _, identifier in pairs(GetPlayerIdentifiers(src)) do
        if string.find(identifier, idtype) then
            return identifier
        end
    end
    return nil
end

function QBCore.Functions.GetSozIdentifier(source)
    if GetConvar("soz_disable_steam_credential", "false") == "true" then
        return QBCore.Functions.GetIdentifier(source, 'license')
    end

    local steamId = QBCore.Functions.GetIdentifier(source, 'steam')

    if not steamId then
        return nil
    end

    local steamHex = string.sub(steamId, string.len("steam:") + 1)

    return tostring(tonumber(steamHex, 16))
end

function QBCore.Functions.GetSource(identifier)
    for src, player in pairs(QBCore.Players) do
        local idens = GetPlayerIdentifiers(src)
        for _, id in pairs(idens) do
            if identifier == id then
                return src
            end
        end
    end
    return 0
end

function QBCore.Functions.GetPlayer(source)
    local src = source
    if type(src) == 'number' then
        return QBCore.Players[src]
    else
        return QBCore.Players[QBCore.Functions.GetSource(src)]
    end
end

function QBCore.Functions.GetPlayerByCitizenId(citizenid)
    for src, player in pairs(QBCore.Players) do
        local cid = citizenid
        if QBCore.Players[src].PlayerData.citizenid == cid then
            return QBCore.Players[src]
        end
    end
    return nil
end

function QBCore.Functions.GetPlayerByPhone(number)
    for src, player in pairs(QBCore.Players) do
        local cid = citizenid
        if QBCore.Players[src].PlayerData.charinfo.phone == number then
            return QBCore.Players[src]
        end
    end
    return nil
end

function QBCore.Functions.GetPlayerByBankAccount(account)
    for src, _ in pairs(QBCore.Players) do
        if QBCore.Players[src].PlayerData.charinfo.account == account then
            return QBCore.Players[src]
        end
    end
    return nil
end

function QBCore.Functions.GetPlayers()
    local sources = {}
    for k, v in pairs(QBCore.Players) do
        sources[#sources+1] = k
    end
    return sources
end

-- Will return an array of QB Player class instances
-- unlike the GetPlayers() wrapper which only returns IDs
function QBCore.Functions.GetQBPlayers()
    return QBCore.Players
end

--- Gets a list of all on duty players of a specified job and the number
function QBCore.Functions.GetPlayersOnDuty(job)
    local players = {}
    local count = 0

    for src, Player in pairs(QBCore.Players) do
        if Player.PlayerData.job.id == job then
            if Player.PlayerData.job.onduty then
                players[#players + 1] = src
                count = count + 1
            end
        end
    end
    return players, count
end

-- Returns only the amount of players on duty for the specified job
function QBCore.Functions.GetDutyCount(job)
    local count = 0

    for _, Player in pairs(QBCore.Functions.GetQBPlayers()) do
        if Player.PlayerData.job.id == job then
            if Player.PlayerData.job.onduty then
                count = count + 1
            end
        end
    end
    return count
end

--- Routingbucket stuff (Only touch if you know what you are doing)
_G.Player_Buckets = {} -- Bucket array containing all players that have been set to a different bucket
_G.Entity_Buckets = {} -- Bucket array containing all entities that have been set to a different bucket


--- Returns the objects related to buckets, first returned value is the player buckets , second one is entity buckets
function QBCore.Functions.GetBucketObjects()
    return _G.Player_Buckets, _G.Entity_Buckets
end


--- Will set the provided player id / source into the provided bucket id
function QBCore.Functions.SetPlayerBucket(player_source --[[int]],bucket --[[int]])
    if player_source and bucket then
        local plicense = QBCore.Functions.GetSozIdentifier(player_source)
        SetPlayerRoutingBucket(player_source, bucket)
        _G.Player_Buckets[plicense] = {player_id = player_source, player_bucket = bucket}
        return true
    else
        return false
    end
end

--- Will set any entity into the provided bucket, for example peds / vehicles / props / etc...
function QBCore.Functions.SetEntityBucket(entity --[[int]],bucket --[[int]])
    if entity and bucket then
        SetEntityRoutingBucket(entity, bucket)
        _G.Entity_Buckets[entity] = {entity_id = entity, entity_bucket = bucket}
        return true
    else
        return false
    end
end


-- Will return an array of all the player ids inside the current bucket
function QBCore.Functions.GetPlayersInBucket(bucket --[[int]])
    local curr_bucket_pool = {}
    if _G.Player_Buckets ~= nil then
        for k, v in pairs(_G.Player_Buckets) do
            if k['player_bucket'] == bucket then
                curr_bucket_pool[#curr_bucket_pool + 1] = k['player_id']
            end
        end
        return curr_bucket_pool
    else
        return false
    end
end


--- Will return an array of all the entities inside the current bucket (Not player entities , use GetPlayersInBucket for that)
function QBCore.Functions.GetEntitiesInBucket(bucket --[[int]])
    local curr_bucket_pool = {}
    if _G.Entity_Buckets ~= nil then
        for k, v in pairs(_G.Entity_Buckets) do
            if k['entity_bucket'] == bucket then
                curr_bucket_pool[#curr_bucket_pool + 1] = k['entity_id']
            end
        end
        return curr_bucket_pool
    else
        return false
    end
end

--- Will return true / false wheter the mentioned player id is present in the bucket provided
function QBCore.Functions.IsPlayerInBucket(player_source --[[int]] ,bucket --[[int]])
    local curr_player_bucket = GetPlayerRoutingBucket(player_source)
    return curr_player_bucket == bucket
end

-- Callbacks

function QBCore.Functions.CreateCallback(name, cb)
    QBCore.ServerCallbacks[name] = cb
end

function QBCore.Functions.TriggerCallback(name, source, cb, ...)
    local src = source
    if QBCore.ServerCallbacks[name] then
        QBCore.ServerCallbacks[name](src, cb, ...)
    end
end

function QBCore.Functions.TriggerRpc(name, source, ...)
    local result

    QBCore.Functions.TriggerCallback(name, source, function(res)
        result = res
    end, ...)

    return result
end

-- Items

function QBCore.Functions.CreateUseableItem(item, cb)
    QBCore.UseableItems[item] = cb
end

function QBCore.Functions.CanUseItem(item)
    return QBCore.UseableItems[item]
end

function QBCore.Functions.UseItem(source, item)
    local src = source
    QBCore.UseableItems[item.name](src, item)
    TriggerClientEvent('soz-core:client:item:use', src, item.name, QBCore.Shared.Items[item.name])
end

-- Kick Player

function QBCore.Functions.Kick(source, reason, setKickReason, deferrals)
    local src = source
    reason = '\n' .. reason .. '\n🔸 Check our Discord for further information: ' .. QBCore.Config.Server.discord
    if setKickReason then
        setKickReason(reason)
    end
    CreateThread(function()
        if deferrals then
            deferrals.update(reason)
            Wait(2500)
        end
        if src then
            DropPlayer(src, reason)
        end
        local i = 0
        while (i <= 4) do
            i = i + 1
            while true do
                if src then
                    if (GetPlayerPing(src) >= 0) then
                        break
                    end
                    Wait(100)
                    CreateThread(function()
                        DropPlayer(src, reason)
                    end)
                end
            end
            Wait(5000)
        end
    end)
end

-- Setting & Removing Permissions

function QBCore.Functions.SetPermission(license, permission)
    QBCore.Config.Server.PermissionList[license] = {
        license = license,
        permission = permission:lower(),
    }
end

-- Checking for Permission Level

function QBCore.Functions.HasPermission(source, _permission)
    local src = source
    local license = QBCore.Functions.GetSozIdentifier(src)
    local permission = tostring(_permission:lower())

    if permission == 'user' then
        return true
    end

    if QBCore.Config.Server.PermissionList[license] then
        if QBCore.Config.Server.PermissionList[license].license == license then
            if QBCore.Config.Server.PermissionList[license].permission == 'admin' then
                return true
            end

            if QBCore.Config.Server.PermissionList[license].permission == 'staff' and permission == 'helper' then
                return true
            end

            if QBCore.Config.Server.PermissionList[license].permission == permission then
                return true
            end
        end
    end

    return false
end

function QBCore.Functions.GetPermission(source)
    local src = source
    local license = QBCore.Functions.GetSozIdentifier(src)
    if license then
        if QBCore.Config.Server.PermissionList[license] then
            if QBCore.Config.Server.PermissionList[license].license == license then
                return QBCore.Config.Server.PermissionList[license].permission
            end
        end
    end
    return 'user'
end

-- Opt in or out of admin reports

function QBCore.Functions.IsOptin(source)
    local src = source
    local license = QBCore.Functions.GetSozIdentifier(src)
    if QBCore.Functions.HasPermission(src, 'admin') then
        return QBCore.Config.Server.PermissionList[license].optin
    end
end

function QBCore.Functions.ToggleOptin(source)
    local src = source
    local license = QBCore.Functions.GetSozIdentifier(src)
    if QBCore.Functions.HasPermission(src, 'admin') then
        QBCore.Config.Server.PermissionList[license].optin = not QBCore.Config.Server.PermissionList[license].optin
    end
end
