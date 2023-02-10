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

local function CountClothSet(cloakroom)
    local count = 0
    for _, __ in pairs(cloakroom) do
        count = count + 1
    end
    return count
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

    if name == nil or name == "" then
        cb("Veuillez entrer un nom pour votre tenue.")
        return
    end

    if Player and Player.PlayerData.metadata.inside then
        local clothSet = exports.oxmysql:scalar_async("SELECT COUNT(cloth_set) FROM player_cloth_set WHERE citizenid = ?", {
            Player.PlayerData.citizenid,
        })
        local playerApartmentTier = 0
        if Player.PlayerData.apartment and tostring(Player.PlayerData.apartment.id) == Player.PlayerData.metadata.inside.apartment then
            playerApartmentTier = Player.PlayerData.apartment.tier or 0
        else
            local apartment = exports.oxmysql:singleSync("SELECT tier FROM housing_apartment where id = ?", {
                Player.PlayerData.metadata.inside.apartment,
            })
            if apartment then
                playerApartmentTier = apartment.tier
            end
        end
        local max = Config.CloakroomUpgrades[playerApartmentTier]
        if clothSet >= max then
            cb("Vous ne pouvez pas avoir plus de " .. max .. " tenues.")
            return
        end

        local currentClothing = Player.PlayerData.cloth_config["BaseClothSet"]
        local id = exports.oxmysql:insert_async("INSERT INTO player_cloth_set (citizenid, name, cloth_set) VALUES (?, ?, ?)",
                                                {Player.PlayerData.citizenid, name, json.encode(currentClothing)})

        if id then
            Cloakrooms[Player.PlayerData.citizenid][id] = {id = id, name = name, cloth = currentClothing}

            cb(nil)
        else
            cb("Une erreur est survenue.")
        end
    else
        cb("Une erreur est survenue.")
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

exports("TruncatePlayerCloakroomFromTier", function(citizenid, tier)
    local clothes = GetCacheCloakroom(citizenid)

    local toDelete = math.max(0, CountClothSet(clothes) - Config.CloakroomUpgrades[tier])

    for _, clothe in pairs(clothes) do
        if toDelete == 0 then
            break
        end
        local affectedRows = exports.oxmysql:update_async("DELETE FROM player_cloth_set WHERE id = ? AND citizenid = ?", {
            clothe.id,
            citizenid,
        })

        if affectedRows then
            Cloakrooms[citizenid][clothe.id] = nil
            toDelete = toDelete - 1
        end
    end
end)
