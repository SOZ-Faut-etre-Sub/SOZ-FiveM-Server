-- Event Handler

AddEventHandler('playerDropped', function()
    local src = source
    if QBCore.Players[src] then
        local Player = QBCore.Players[src]
        exports['soz-monitor']:Event('player_disconnect', { player_source = src }, {})
        Player.Functions.Save()
        _G.Player_Buckets[Player.PlayerData.license] = nil
        TriggerEvent('inventory:DropPlayerInventory', src)
        TriggerEvent('QBCore:Server:PlayerUnload', src)
        QBCore.Players[src] = nil
    end
end)

AddEventHandler('chatMessage', function(source, n, message)
    local src = source
    if string.sub(message, 1, 1) == '/' then
        local args = QBCore.Shared.SplitStr(message, ' ')
        local command = string.gsub(args[1]:lower(), '/', '')
        CancelEvent()
        if QBCore.Commands.List[command] then
            local Player = QBCore.Functions.GetPlayer(src)
            if Player then
                local isGod = QBCore.Functions.HasPermission(src, 'admin')
                local hasPerm = QBCore.Functions.HasPermission(src, QBCore.Commands.List[command].permission)
                local isPrincipal = IsPlayerAceAllowed(src, 'command')
                table.remove(args, 1)
                if isGod or hasPerm or isPrincipal then
                    if (QBCore.Commands.List[command].argsrequired and #QBCore.Commands.List[command].arguments ~= 0 and args[#QBCore.Commands.List[command].arguments] == nil) then
                        TriggerClientEvent('hud:client:DrawNotification', src, 'Il vous manque des paramètres !', "error")
                    else
                        QBCore.Commands.List[command].callback(src, args)
                    end
                end
            end
        end
    end
end)

-- Player Connecting

local function OnPlayerConnecting(name, setKickReason, deferrals)
    -- @TODO we will validate in another way using steam and a specific queue system, bypass this code ATM
    deferrals.defer()
    local src = source
    local steam = QBCore.Functions.GetSozIdentifier(src)

    Wait(0)

    local allowAnonymous = GetConvar("soz_allow_anonymous_login", "false") == "true"
    local defaultAnonymousRole = GetConvar("soz_anonymous_default_role", "user")

    if not steam then
        exports["soz-monitor"]:Log("ERROR", name .. ": error finding steam id for this user.", {
            event = "playerConnecting"
        })

        deferrals.done('Impossible de recupérer votre identifiant steam, verifier que le client est bien lancé.')

        if not allowAnonymous then
            return
        end
    end

    local account = QBCore.Functions.GetUserAccount(src)

    if not account then
        if not allowAnonymous then
            deferrals.done('Impossible de recupérer un compte soz valide, veuillez vous rapprocher auprès d\'un administrateur, identifiant steam : ' .. tostring(steam))

            return
        end

        QBCore.Functions.SetPermission(steam, defaultAnonymousRole)
    else
        QBCore.Functions.SetPermission(steam, account.role or 'user')
    end

    deferrals.done()
end

AddEventHandler('playerConnecting', OnPlayerConnecting)

-- Open & Close Server (prevents players from joining)

RegisterNetEvent('QBCore:server:CloseServer', function(reason)
    local src = source
    if QBCore.Functions.HasPermission(src, 'admin') then
        local reason = reason or 'No reason specified'
        QBCore.Config.Server.closed = true
        QBCore.Config.Server.closedReason = reason
    else
        QBCore.Functions.Kick(src, 'You don\'t have permissions for this..', nil, nil)
    end
end)

RegisterNetEvent('QBCore:server:OpenServer', function()
    local src = source
    if QBCore.Functions.HasPermission(src, 'admin') then
        QBCore.Config.Server.closed = false
    else
        QBCore.Functions.Kick(src, 'You don\'t have permissions for this..', nil, nil)
    end
end)

-- Callbacks

RegisterNetEvent('QBCore:Server:TriggerCallback', function(name, ...)
    local src = source
    QBCore.Functions.TriggerCallback(name, src, function(...)
        TriggerClientEvent('QBCore:Client:TriggerCallback', src, name, ...)
    end, ...)
end)

RegisterNetEvent('QBCore:Server:TriggerRpc', function(name, id, ...)
    local src = source
    QBCore.Functions.TriggerCallback(name, src, function(...)
        TriggerClientEvent(id, src, ...)
    end, ...)
end)

-- Player

RegisterNetEvent('QBCore:Server:SetMetaData', function(meta, data)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if meta == 'hunger' or meta == 'thirst' or meta == 'alcohol' or meta == 'drug' then
        if data > 100 then
            data = 100
        elseif data < 0 then
            data = 0
        end
    end
    if Player then
        Player.Functions.SetMetaData(meta, data)
    end
    TriggerClientEvent('hud:client:UpdateNeeds', src, Player.PlayerData.metadata['hunger'], Player.PlayerData.metadata['thirst'], Player.PlayerData.metadata['alcohol'], Player.PlayerData.metadata['drug'])
end)

RegisterNetEvent('QBCore:ToggleDuty', function()
    local src = source
    local player = QBCore.Functions.GetPlayer(src)
    local itt = player.PlayerData.metadata["itt"]

    if itt then
        TriggerClientEvent('hud:client:DrawNotification', src, 'Vous êtes en interdiction de travail temporaire', "info")
        return
    end

    if player.PlayerData.job.onduty then
        player.Functions.SetJobDuty(false)
        TriggerClientEvent('hud:client:DrawNotification', src, 'Vous êtes hors service', "info")
    else
        player.Functions.SetJobDuty(true)
        TriggerClientEvent('hud:client:DrawNotification', src, 'Vous êtes en service', "info")
    end
    Player(player.PlayerData.source).state.onDuty = player.PlayerData.job.onduty
    TriggerClientEvent('QBCore:Client:SetDuty', src, player.PlayerData.job.onduty)
end)

-- Items
RegisterNetEvent('QBCore:Server:RemoveItem', function(itemName, amount, slot)
    local Player = QBCore.Functions.GetPlayer(source)
    exports['soz-monitor']:Log('FATAL', 'DEPRECATED use of QBCore:Server:RemoveItem ! item: '.. itemName, Player)
    exports['soz-inventory']:RemoveItem(Player.PlayerData.source, itemName, amount, false, slot)
end)

-- Non-Chat Command Calling (ex: qb-adminmenu)

RegisterNetEvent('QBCore:CallCommand', function(command, args)
    local src = source
    if QBCore.Commands.List[command] then
        local Player = QBCore.Functions.GetPlayer(src)
        if Player then
            local isGod = QBCore.Functions.HasPermission(src, 'admin')
            local hasPerm = QBCore.Functions.HasPermission(src, QBCore.Commands.List[command].permission)
            local isPrincipal = IsPlayerAceAllowed(src, 'command')
            if (QBCore.Commands.List[command].permission == Player.PlayerData.job.id) or isGod or hasPerm or isPrincipal then
                if (QBCore.Commands.List[command].argsrequired and #QBCore.Commands.List[command].arguments ~= 0 and args[#QBCore.Commands.List[command].arguments] == nil) then
                    TriggerClientEvent('hud:client:DrawNotification', src, 'Il vous manque des paramètres !', "error")
                else
                    QBCore.Commands.List[command].callback(src, args)
                end
            end
        end
    end
end)

-- Has Item Callback (can also use client function - QBCore.Functions.HasItem(item))

QBCore.Functions.CreateCallback('QBCore:HasItem', function(source, cb, items, amount)
    local src = source
    local retval = false
    local Player = QBCore.Functions.GetPlayer(src)
    if Player then
        if type(items) == 'table' then
            local count = 0
            local finalcount = 0
            for k, v in pairs(items) do
                if type(k) == 'string' then
                    finalcount = 0
                    for i, _ in pairs(items) do
                        if i then
                            finalcount = finalcount + 1
                        end
                    end
                    local item = Player.Functions.GetItemByName(k)
                    if item then
                        if item.amount >= v then
                            count = count + 1
                            if count == finalcount then
                                retval = true
                            end
                        end
                    end
                else
                    finalcount = #items
                    local item = Player.Functions.GetItemByName(v)
                    if item then
                        if amount then
                            if item.amount >= amount then
                                count = count + 1
                                if count == finalcount then
                                    retval = true
                                end
                            end
                        else
                            count = count + 1
                            if count == finalcount then
                                retval = true
                            end
                        end
                    end
                end
            end
        else
            local item = Player.Functions.GetItemByName(items)
            if item then
                if amount then
                    if item.amount >= amount then
                        retval = true
                    end
                else
                    retval = true
                end
            end
        end
    end
    cb(retval)
end)
