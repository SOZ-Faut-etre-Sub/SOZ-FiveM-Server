local Cloakrooms = {}

local function GetCacheCloakroom(citizenid)
    if Cloakrooms[citizenid] then
        return Cloakrooms[citizenid]
    end
    Cloakrooms[citizenid] = {}

    local cloakroom = exports.oxmysql:query_async("SELECT * FROM player_cloth_set WHERE citizenid = ?", {citizenid})
    for _, clothe in pairs(cloakroom or {}) do
        Cloakrooms[citizenid][clothe.id] = {id = clothe.id, name = clothe.name, cloth = json.decode(clothe.cloth_set)}
    end

    return Cloakrooms[citizenid]
end

QBCore.Functions.CreateCallback("soz-character:server:GetPlayerCloakroom", function(source, cb)
    local Player = QBCore.Functions.GetPlayer(source)

    if Player then
        cb(GetCacheCloakroom(Player.PlayerData.citizenid))
    else
        cb({})
    end
end)

QBCore.Functions.CreateCallback("soz-character:server:SavePlayerClothe", function(source, cb, name)
    local Player = QBCore.Functions.GetPlayer(source)

    if name == nil then
        TriggerClientEvent("hud:client:DrawNotification", source, "Veuillez entrer un nom pour votre tenue.", "error")
        cb(false)
    end

    if Player then
        local clothSet = exports.oxmysql:scalar_async("SELECT COUNT(cloth_set) FROM player_cloth_set WHERE citizenid = ?", {
            Player.PlayerData.citizenid,
        })
        if clothSet >= 4 then -- TODO implement dynamic upgrade
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous ne pouvez pas avoir plus de 4 tenues.", "error")

            cb(false)
            return
        end

        local currentClothing = Player.PlayerData.cloth_config["BaseClothSet"]
        local id = exports.oxmysql:insert_async("INSERT INTO player_cloth_set (citizenid, name, cloth_set) VALUES (?, ?, ?)",
                                                {Player.PlayerData.citizenid, name, json.encode(currentClothing)})

        if id then
            Cloakrooms[Player.PlayerData.citizenid][id] = {id = id, name = name, cloth = currentClothing}

            cb(true)
        else
            cb(false)
        end
    else
        cb(false)
    end
end)

QBCore.Functions.CreateCallback("soz-character:server:DeletePlayerClothe", function(source, cb, id)
    local Player = QBCore.Functions.GetPlayer(source)

    if id == nil then
        TriggerClientEvent("hud:client:DrawNotification", source, "Erreur d'identifiant", "error")
        cb(false)
    end

    if Player then
        local affectedRows = exports.oxmysql:update_async("DELETE FROM player_cloth_set WHERE id = ? AND citizenid = ?", {
            id,
            Player.PlayerData.citizenid,
        })

        if affectedRows then
            Cloakrooms[Player.PlayerData.citizenid][id] = nil

            cb(true)
        else
            cb(false)
        end
    else
        cb(false)
    end
end)
