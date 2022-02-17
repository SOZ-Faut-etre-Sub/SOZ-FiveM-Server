local QBCore = exports["qb-core"]:GetCoreObject()

-- Functions

local function GiveStarterItems(source)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)

    for k, v in pairs(QBCore.Shared.StarterItems) do
        local metadata = {}
        if v.item == "id_card" then
            metadata.citizenid = Player.PlayerData.citizenid
            metadata.firstname = Player.PlayerData.charinfo.firstname
            metadata.lastname = Player.PlayerData.charinfo.lastname
            metadata.birthdate = Player.PlayerData.charinfo.birthdate
            metadata.gender = Player.PlayerData.charinfo.gender
            metadata.nationality = Player.PlayerData.charinfo.nationality
        elseif v.item == "driver_license" then
            metadata.firstname = Player.PlayerData.charinfo.firstname
            metadata.lastname = Player.PlayerData.charinfo.lastname
            metadata.birthdate = Player.PlayerData.charinfo.birthdate
            metadata.type = "Class C Driver License"
        end
        exports["soz-inventory"]:AddItem(Player.PlayerData.source, v.item, v.amount, false, metadata)
    end
end

-- Events

RegisterNetEvent("soz-character:server:loadUserData", function(data)
    local src = source
    local newData = data
    if QBCore.Player.Login(src, newData.citizenid) then
        exports["soz-monitor"]:Log("INFO", "Player has successfully loaded !", newData)
        QBCore.Commands.Refresh(src)
    end
end)

RegisterNetEvent("soz-character:server:createCharacter", function(data)
    local src = source
    local newData = {}
    newData.charinfo = data
    if QBCore.Player.Login(src, false, newData) then
        exports["soz-monitor"]:Log("INFO", GetPlayerName(src) .. " has succesfully loaded!")
        QBCore.Commands.Refresh(src)
        TriggerClientEvent("soz-character:client:closeNUIdefault", src)
        GiveStarterItems(src)
    end
end)

-- Callbacks

QBCore.Functions.CreateCallback("soz-character:server:GetUserCharacters", function(source, cb)
    local src = source
    local license = QBCore.Functions.GetIdentifier(src, "license")
    exports.oxmysql:execute("SELECT * FROM players WHERE license = ?", {
        license,
    }, function(result)
        cb(result)
    end)
end)

QBCore.Functions.CreateCallback("soz-character:server:GetUserTempCharacters", function(source, cb)
    local src = source
    local license = QBCore.Functions.GetIdentifier(src, "license")
    exports.oxmysql:execute("SELECT * FROM player_temp WHERE license = ?", {
        license,
    }, function(result)
        cb(result)
    end)
end)

QBCore.Functions.CreateCallback("soz-character:server:getSkin", function(source, cb)
    local license = QBCore.Functions.GetIdentifier(source, "license")
    local ply2Chars = nil
    exports.oxmysql:execute("SELECT * FROM players WHERE license = ?", {
        license,
    }, function(result2)
        ply2Chars = result2
        local cid2 = ply2Chars[1].citizenid
        local result = exports.oxmysql:executeSync("SELECT * FROM playerskins WHERE citizenid = ? AND active = ?", {
            cid2,
            1,
        })
        if result[1] ~= nil then
            cb(result[1].model, result[1].skin)
        else
            cb(nil)
        end
    end)
end)
