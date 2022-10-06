QBCore.Players = {}
QBCore.Player = {}

-- On player login get their data or set defaults
-- Don't touch any of this unless you know what you are doing
-- Will cause major issues!

function QBCore.Player.Login(source, citizenid, newData)
    local src = source
    if src then
        if citizenid then
            local license = QBCore.Functions.GetSozIdentifier(src)
            local account = exports.oxmysql:singleSync("SELECT a.* FROM soz_api.accounts a LEFT JOIN soz_api.account_identities ai ON a.id = ai.accountId WHERE a.whitelistStatus = 'ACCEPTED' AND ai.identityType = 'STEAM' AND ai.identityId = ? LIMIT 1", { license })
            local PlayerData = exports.oxmysql:singleSync('SELECT * FROM player where citizenid = ?', { citizenid })
            local apartment = exports.oxmysql:singleSync('SELECT label FROM housing_apartment where ? IN (owner, roommate)', { citizenid })
            local role = GetConvar("soz_anonymous_default_role", "user")

            if account then
                role = account.role:lower()
            end

            if PlayerData and (license == PlayerData.license or role == 'admin') then
                PlayerData.money = json.decode(PlayerData.money)
                PlayerData.job = json.decode(PlayerData.job)
                PlayerData.position = json.decode(PlayerData.position)
                PlayerData.metadata = json.decode(PlayerData.metadata)
                PlayerData.charinfo = json.decode(PlayerData.charinfo)
                PlayerData.skin = json.decode(PlayerData.skin)
                PlayerData.cloth_config = json.decode(PlayerData.cloth_config)
                PlayerData.features = json.decode(PlayerData.features)
                PlayerData.role = role
                if apartment then
                    PlayerData.address = apartment.label
                end

                if PlayerData.gang then
                    PlayerData.gang = json.decode(PlayerData.gang)
                else
                    PlayerData.gang = {}
                end

                QBCore.Player.CheckPlayerData(src, PlayerData)
            else
                DropPlayer(src, 'You Have Been Kicked For Exploitation')
                TriggerEvent('qb-log:server:CreateLog', 'anticheat', 'Anti-Cheat', 'white', GetPlayerName(src) .. ' Has Been Dropped For Character Joining Exploit', false)
            end
        else
            QBCore.Player.CheckPlayerData(src, newData)
        end
        return true
    else
        QBCore.ShowError(GetCurrentResourceName(), 'ERROR QBCORE.PLAYER.LOGIN - NO SOURCE GIVEN!')
        return false
    end
end

function QBCore.Player.CheckPlayerData(source, PlayerData)
    local src = source
    PlayerData = PlayerData or {}
    PlayerData.source = src
    PlayerData.is_default = PlayerData.is_default or 1
    PlayerData.citizenid = PlayerData.citizenid or QBCore.Player.CreateCitizenId()
    PlayerData.license = PlayerData.license or QBCore.Functions.GetSozIdentifier(src)
    PlayerData.name = GetPlayerName(src)
    PlayerData.cid = PlayerData.cid or 1
    PlayerData.money = PlayerData.money or {}
    for moneytype, startamount in pairs(QBCore.Config.Money.MoneyTypes) do
        PlayerData.money[moneytype] = PlayerData.money[moneytype] or startamount
    end
    -- Charinfo
    PlayerData.charinfo = PlayerData.charinfo or {}
    PlayerData.charinfo.firstname = PlayerData.charinfo.firstname or 'Firstname'
    PlayerData.charinfo.lastname = PlayerData.charinfo.lastname or 'Lastname'
    PlayerData.charinfo.birthdate = PlayerData.charinfo.birthdate or '00-00-0000'
    PlayerData.charinfo.gender = PlayerData.charinfo.gender or 0
    PlayerData.charinfo.backstory = PlayerData.charinfo.backstory or 'placeholder backstory'
    PlayerData.charinfo.nationality = PlayerData.charinfo.nationality or 'USA'
    PlayerData.charinfo.phone = PlayerData.charinfo.phone or QBCore.Player.CreatePhoneNumber()
    PlayerData.charinfo.account = PlayerData.charinfo.account ~= nil and PlayerData.charinfo.account or math.random(111, 999) .. 'Z' .. math.random(1111, 9999) .. 'T' .. math.random(111, 999)
    -- Metadata
    PlayerData.metadata = PlayerData.metadata or {}
    -- Status
    PlayerData.metadata['walk'] = PlayerData.metadata['walk'] or nil
    PlayerData.metadata['isdead'] = PlayerData.metadata['isdead'] or false
    PlayerData.metadata['health'] = PlayerData.metadata['health'] or 200
    if PlayerData.metadata['isdead'] then
        PlayerData.metadata['health'] = 0
    end
    PlayerData.metadata['hunger'] = PlayerData.metadata['hunger'] or 100
    PlayerData.metadata['thirst'] = PlayerData.metadata['thirst'] or 100
    PlayerData.metadata['alcohol'] = PlayerData.metadata['alcohol'] or 0
    PlayerData.metadata['fiber'] = PlayerData.metadata['fiber'] or 70
    PlayerData.metadata['lipid'] = PlayerData.metadata['lipid'] or 70
    PlayerData.metadata['sugar'] = PlayerData.metadata['sugar'] or 70
    PlayerData.metadata['protein'] = PlayerData.metadata['protein'] or 70
    PlayerData.metadata['max_stamina'] = PlayerData.metadata['max_stamina'] or 100
    PlayerData.metadata['max_health'] = PlayerData.metadata['max_health'] or 200
    PlayerData.metadata['strength'] = PlayerData.metadata['strength'] or 100
    PlayerData.metadata['stress_level'] = PlayerData.metadata['stress_level'] or 0
    PlayerData.metadata['last_max_stamina_update'] = PlayerData.metadata['last_max_stamina_update'] or nil
    PlayerData.metadata['last_strength_update'] = PlayerData.metadata['last_strength_update'] or nil
    PlayerData.metadata['last_stress_level_update'] = PlayerData.metadata['last_stress_level_update'] or nil
    PlayerData.metadata['health_level'] = PlayerData.metadata['health_level'] or 100
    PlayerData.metadata['health_book_health_level'] = PlayerData.metadata['health_book_health_level'] or nil
    PlayerData.metadata['health_book_max_stamina'] = PlayerData.metadata['health_book_max_stamina'] or nil
    PlayerData.metadata['health_book_strength'] = PlayerData.metadata['health_book_strength'] or nil
    PlayerData.metadata['health_book_stress_level'] = PlayerData.metadata['health_book_stress_level'] or nil
    PlayerData.metadata['health_book_sugar'] = PlayerData.metadata['health_book_sugar'] or nil
    PlayerData.metadata['health_book_fiber'] = PlayerData.metadata['health_book_fiber'] or nil
    PlayerData.metadata['health_book_lipid'] = PlayerData.metadata['health_book_lipid'] or nil
    PlayerData.metadata['health_book_protein'] = PlayerData.metadata['health_book_protein'] or nil
    PlayerData.metadata['last_exercise_completed'] = PlayerData.metadata['last_exercise_completed'] or nil
    PlayerData.metadata['gym_subscription_expire_at'] = PlayerData.metadata['gym_subscription_expire_at'] or nil
    PlayerData.metadata['drug'] = PlayerData.metadata['drug'] or 0
    PlayerData.metadata['armor'] = {current = 0, hidden = false}
    PlayerData.metadata['inlaststand'] = PlayerData.metadata['inlaststand'] or false
    PlayerData.metadata['ishandcuffed'] = PlayerData.metadata['ishandcuffed'] or false
    PlayerData.metadata['tracker'] = PlayerData.metadata['tracker'] or false
    PlayerData.metadata['injail'] = PlayerData.metadata['injail'] or 0
    PlayerData.metadata['jailitems'] = PlayerData.metadata['jailitems'] or {}
    PlayerData.metadata['status'] = PlayerData.metadata['status'] or {}
    PlayerData.metadata['phone'] = PlayerData.metadata['phone'] or {}
    PlayerData.metadata['fitbit'] = PlayerData.metadata['fitbit'] or {}
    PlayerData.metadata['commandbinds'] = PlayerData.metadata['commandbinds'] or {}
    PlayerData.metadata['bloodtype'] = PlayerData.metadata['bloodtype'] or QBCore.Config.Player.Bloodtypes[math.random(1, #QBCore.Config.Player.Bloodtypes)]
    PlayerData.metadata['dealerrep'] = PlayerData.metadata['dealerrep'] or 0
    PlayerData.metadata['craftingrep'] = PlayerData.metadata['craftingrep'] or 0
    PlayerData.metadata['attachmentcraftingrep'] = PlayerData.metadata['attachmentcraftingrep'] or 0
    PlayerData.metadata['currentapartment'] = PlayerData.metadata['currentapartment'] or nil
    PlayerData.metadata['jobrep'] = PlayerData.metadata['jobrep'] or {
        ['tow'] = 0,
        ['trucker'] = 0,
        ['taxi'] = 0,
        ['hotdog'] = 0,
    }
    PlayerData.metadata['callsign'] = PlayerData.metadata['callsign'] or 'NO CALLSIGN'
    PlayerData.metadata['fingerprint'] = PlayerData.metadata['fingerprint'] or QBCore.Player.CreateFingerId()
    PlayerData.metadata['walletid'] = PlayerData.metadata['walletid'] or QBCore.Player.CreateWalletId()
    PlayerData.metadata['criminalrecord'] = PlayerData.metadata['criminalrecord'] or {
        ['hasRecord'] = false,
        ['date'] = nil
    }
    PlayerData.metadata['licences'] = PlayerData.metadata['licences'] or {
        ['car'] = 0,
        ['truck'] = 0,
        ['motorcycle'] = 0,
        ['heli'] = 0,
        ['boat'] = 0,
        ['weapon'] = false,
        ['hunting'] = false,
        ['fishing'] = false,
        ['rescuer'] = false,
    }
    PlayerData.metadata['inside'] = PlayerData.metadata['inside'] or {
        ['exitCoord'] = false,
        ['apartment'] = false,
    }
    PlayerData.metadata['phonedata'] = PlayerData.metadata['phonedata'] or {
        SerialNumber = QBCore.Player.CreateSerialNumber(),
        InstalledApps = {},
    }
    if not PlayerData.metadata.lastBidTime then
        PlayerData.metadata.canBid = true
    else
        local daysSinceLastBid = os.difftime(os.time(), PlayerData.metadata.lastBidTime) / (24 * 60 * 60)
        PlayerData.metadata.canBid = daysSinceLastBid >= 14
        if PlayerData.metadata.canBid then
            PlayerData.metadata.lastBidTime = nil
        end
    end

    -- Skin
    PlayerData.skin = PlayerData.skin or {}
    PlayerData.cloth_config = PlayerData.cloth_config or {}
    if PlayerData.cloth_config["JobClothSet"] and PlayerData.cloth_config["JobClothSet"].Components and PlayerData.cloth_config["JobClothSet"].Components["9"] then
        PlayerData.cloth_config["JobClothSet"].Components["9"] = nil
    end

    -- Job
    if not PlayerData.job or type(PlayerData.job) ~= 'table' then
        PlayerData.job = {}
    end

    PlayerData.job.id = PlayerData.job.id or 'unemployed'
    PlayerData.job.onduty = false
    Player(PlayerData.source).state.onDuty = PlayerData.job.onduty
    PlayerData.job.grade = tostring(PlayerData.job.grade) or "1"
    -- Gang
    PlayerData.gang = PlayerData.gang or {}
    PlayerData.gang.name = PlayerData.gang.name or 'none'
    PlayerData.gang.label = PlayerData.gang.label or 'No Gang Affiliaton'
    PlayerData.gang.isboss = PlayerData.gang.isboss or false
    PlayerData.gang.grade = PlayerData.gang.grade or {}
    PlayerData.gang.grade.name = PlayerData.gang.grade.name or 'none'
    PlayerData.gang.grade.level = PlayerData.gang.grade.level or 0
    -- Other
    PlayerData.position = PlayerData.position or QBConfig.DefaultSpawn
    PlayerData.LoggedIn = true
    -- Features
    PlayerData.features = PlayerData.features or {}
    PlayerData.role = PlayerData.role or "user"

    QBCore.Player.CreatePlayer(PlayerData)
end

-- On player logout

function QBCore.Player.Logout(source)
    local src = source
    TriggerClientEvent('QBCore:Client:OnPlayerUnload', src)

    local Player = QBCore.Players[src]

    if Player then
        Player.Functions.Save()
    end

    Wait(200)
    TriggerEvent('inventory:DropPlayerInventory', src)
    TriggerEvent('QBCore:Server:PlayerUnload', src)
    QBCore.Players[src] = nil
end

-- Create a new character
-- Don't touch any of this unless you know what you are doing
-- Will cause major issues!

function QBCore.Player.CreatePlayer(PlayerData)
    local self = {}
    self.Functions = {}
    self.PlayerData = PlayerData

    self.Functions.GetName = function()
        return self.PlayerData.charinfo.firstname .. ' ' .. self.PlayerData.charinfo.lastname
    end

    self.Functions.UpdatePlayerData = function(dontUpdateChat)
        TriggerClientEvent('QBCore:Player:SetPlayerData', self.PlayerData.source, self.PlayerData)
        if dontUpdateChat == nil then
            QBCore.Commands.Refresh(self.PlayerData.source)
        end
    end

    self.Functions.SetFeatures = function(features)
        self.PlayerData.features = features or {}
        self.Functions.UpdatePlayerData()
    end

    self.Functions.SetJob = function(jobId, gradeId)
        self.PlayerData.job = {
            id = jobId,
            grade = tostring(gradeId),
            onduty = self.PlayerData.job.onduty or false,
        }
        self.Functions.UpdatePlayerData()

        TriggerClientEvent('QBCore:Client:OnJobUpdate', self.PlayerData.source, self.PlayerData.job)
        TriggerEvent('QBCore:Server:OnJobUpdate', self.PlayerData.source, self.PlayerData.job)

        return true
    end

    self.Functions.SetGang = function(gang, grade)
        local gang = gang:lower()
        local grade = tostring(grade) or '0'

        if QBCore.Shared.Gangs[gang] then
            self.PlayerData.gang.name = gang
            self.PlayerData.gang.label = QBCore.Shared.Gangs[gang].label
            if QBCore.Shared.Gangs[gang].grades[grade] then
                local ganggrade = QBCore.Shared.Gangs[gang].grades[grade]
                self.PlayerData.gang.grade = {}
                self.PlayerData.gang.grade.name = ganggrade.name
                self.PlayerData.gang.grade.level = tonumber(grade)
                self.PlayerData.gang.isboss = ganggrade.isboss or false
            else
                self.PlayerData.gang.grade = {}
                self.PlayerData.gang.grade.name = 'No Grades'
                self.PlayerData.gang.grade.level = 0
                self.PlayerData.gang.isboss = false
            end

            self.Functions.UpdatePlayerData()
            TriggerClientEvent('QBCore:Client:OnGangUpdate', self.PlayerData.source, self.PlayerData.gang)
            return true
        end
        return false
    end

    self.Functions.SetJobDuty = function(onDuty)
        self.PlayerData.job.onduty = onDuty
        self.Functions.UpdatePlayerData()
    end

    self.Functions.SetMetaData = function(meta, val)
        local meta = meta:lower()
        if val ~= nil then
            self.PlayerData.metadata[meta] = val
            self.Functions.UpdatePlayerData()
        end
    end

    self.Functions.AddJobReputation = function(amount)
        local amount = tonumber(amount)
        self.PlayerData.metadata['jobrep'][self.PlayerData.job.id] = self.PlayerData.metadata['jobrep'][self.PlayerData.job.id] + amount
        self.Functions.UpdatePlayerData()
    end

    self.Functions.AddMoney = function(moneytype, amount, reason)
        reason = reason or 'unknown'
        local moneytype = moneytype:lower()
        local amount = tonumber(amount)
        if amount < 0 then
            return
        end
        if self.PlayerData.money[moneytype] then
            self.PlayerData.money[moneytype] = self.PlayerData.money[moneytype] + amount
            self.Functions.UpdatePlayerData()

            TriggerClientEvent('hud:client:OnMoneyChange', self.PlayerData.source, moneytype, amount, false)

            return true
        end
        return false
    end

    self.Functions.RemoveMoney = function(moneytype, amount, reason)
        reason = reason or 'unknown'
        local moneytype = moneytype:lower()
        local amount = tonumber(amount)
        if amount < 0 then
            return
        end
        if self.PlayerData.money[moneytype] then
            for _, mtype in pairs(QBCore.Config.Money.DontAllowMinus) do
                if mtype == moneytype then
                    if self.PlayerData.money[moneytype] - amount < 0 then
                        return false
                    end
                end
            end
            self.PlayerData.money[moneytype] = self.PlayerData.money[moneytype] - amount
            self.Functions.UpdatePlayerData()
            TriggerClientEvent('hud:client:OnMoneyChange', self.PlayerData.source, moneytype, amount, true)
            if moneytype == 'bank' then
                TriggerClientEvent('qb-phone:client:RemoveBankMoney', self.PlayerData.source, amount)
            end
            return true
        end
        return false
    end

    self.Functions.SetMoney = function(moneytype, amount, reason)
        reason = reason or 'unknown'
        local moneytype = moneytype:lower()
        local amount = tonumber(amount)

        if amount < 0 then
            return
        end

        if self.PlayerData.money[moneytype] then
            self.PlayerData.money[moneytype] = amount
            self.Functions.UpdatePlayerData()

            return true
        end

        return false
    end

    self.Functions.GetMoney = function(moneytype)
        if moneytype then
            local moneytype = moneytype:lower()
            return self.PlayerData.money[moneytype]
        end
        return false
    end

    self.Functions.RemoveItem = function(item, amount, slot)
        return exports['soz-inventory']:RemoveItem(self.PlayerData.source, item, amount, false, slot)
    end

    self.Functions.SetInventory = function(items, dontUpdateChat)
        self.PlayerData.items = items
        self.Functions.UpdatePlayerData(dontUpdateChat)

        exports['soz-monitor']:Log('TRACE', 'Inventory movement - Set ! items set: ' .. json.encode(items), { player = self.PlayerData })
    end

    self.Functions.SetSkin = function(skin, skipApply)
        self.PlayerData.skin = skin
        self.Functions.UpdatePlayerData(true)

        if not skipApply then
            TriggerClientEvent("soz-character:Client:ApplyCurrentSkin", self.PlayerData.source)
        end

        exports['soz-monitor']:Log('TRACE', 'Update player skin ' .. json.encode(skin), { player = self.PlayerData })
    end

    self.Functions.UpdateMaxWeight = function()
        local baseBag = 0
        local jobBag = 0

        if self.PlayerData.cloth_config["BaseClothSet"] then
            if self.PlayerData.cloth_config["BaseClothSet"].Components["5"] then
                baseBag = self.PlayerData.cloth_config["BaseClothSet"].Components["5"].Drawable
            end
        end
        if self.PlayerData.cloth_config["JobClothSet"] then
            if self.PlayerData.cloth_config["JobClothSet"].Components["5"] then
                jobBag = self.PlayerData.cloth_config["JobClothSet"].Components["5"].Drawable
            end
        end

        local strengthMultiplier = self.PlayerData.metadata.strength / 100
        local baseWeight = 20000 * strengthMultiplier

        if (baseBag == 0 and jobBag == 0) or ((baseBag ~= 0 or jobBag ~= 0) and self.PlayerData.cloth_config.Config.HideBag) then
            exports["soz-inventory"]:SetMaxWeight(self.PlayerData.source, math.floor(baseWeight))
        else
            exports["soz-inventory"]:SetMaxWeight(self.PlayerData.source, math.floor(baseWeight + 40000))
        end
    end

    self.Functions.UpdateArmour = function()
        local jobClothSet = self.PlayerData.cloth_config["JobClothSet"]
        if jobClothSet and jobClothSet.Components["9"] and jobClothSet.Components["9"].Drawable ~= 0 then
            self.Functions.SetArmour(true)
        else
            self.Functions.SetArmour(false)
        end
    end

    self.Functions.SetArmour = function(applyArmor)
        local ped = GetPlayerPed(self.PlayerData.source)
        self.PlayerData.metadata["armor"].hidden = not applyArmor

        if self.PlayerData.metadata["armor"].hidden then
            self.PlayerData.metadata["armor"].current = GetPedArmour(ped)
            SetPedArmour(ped, 0)
        else
            SetPedArmour(ped, self.PlayerData.metadata["armor"].current)
        end

        self.Functions.UpdatePlayerData()
    end

    self.Functions.SetClothConfig = function(config, skipApply)
        self.PlayerData.cloth_config = config
        self.Functions.UpdatePlayerData(true)

        self.Functions.UpdateMaxWeight()
        self.Functions.UpdateArmour()

        if not skipApply then
            TriggerClientEvent("soz-character:Client:ApplyCurrentClothConfig", self.PlayerData.source)
        end

        exports['soz-monitor']:Log('TRACE', 'Update player cloth config ' .. json.encode(config), { player = self.PlayerData })
    end

    self.Functions.GetItemByName = function(item)
        local item = tostring(item):lower()
        local slot = QBCore.Player.GetFirstSlotByItem(self.PlayerData.items, item)
        if slot then
            return self.PlayerData.items[slot]
        end
        return nil
    end

    self.Functions.GetItemsByName = function(item)
        local item = tostring(item):lower()
        local items = {}
        local slots = QBCore.Player.GetSlotsByItem(self.PlayerData.items, item)
        for _, slot in pairs(slots) do
            if slot then
                items[#items+1] = self.PlayerData.items[slot]
            end
        end
        return items
    end

    self.Functions.SetCreditCard = function(cardNumber)
        self.PlayerData.charinfo.card = cardNumber
        self.Functions.UpdatePlayerData()
    end

    self.Functions.GetCardSlot = function(cardNumber, cardType)
        local item = tostring(cardType):lower()
        local slots = QBCore.Player.GetSlotsByItem(self.PlayerData.items, item)
        for _, slot in pairs(slots) do
            if slot then
                if self.PlayerData.items[slot].metadata.cardNumber == cardNumber then
                    return slot
                end
            end
        end
        return nil
    end

    self.Functions.GetItemBySlot = function(slot)
        local slot = tonumber(slot)
        if self.PlayerData.items[slot] then
            return self.PlayerData.items[slot]
        end
        return nil
    end

    self.Functions.SetLicence = function (licence, points)
        local licences = self.PlayerData.metadata.licences
        if licences[licence] ~= nil then
            licences[licence] = tonumber(points)
            self.Functions.UpdatePlayerData()
        end
    end

    self.Functions.Save = function()
        QBCore.Player.Save(self.PlayerData.source)
    end

    QBCore.Players[self.PlayerData.source] = self
    exports['soz-inventory']:CreatePlayerInventory(self.PlayerData)

    -- At this point we are safe to emit new instance to third party resource for load handling
    TriggerEvent('QBCore:Server:PlayerLoaded', self)
    self.Functions.UpdatePlayerData()
    self.Functions.UpdateMaxWeight()
    self.Functions.UpdateArmour()
end

-- Save player info to database (make sure citizenid is the primary key in your database)

function QBCore.Player.Save(source)
    local src = source
    local ped = GetPlayerPed(src)
    local pcoords = GetEntityCoords(ped)
    local PlayerData = QBCore.Players[src].PlayerData
    if PlayerData then
        PlayerData.metadata["health"] = GetEntityHealth(ped)
        if not PlayerData.metadata["armor"].hidden then
            PlayerData.metadata["armor"].current = GetPedArmour(ped)
        end

        exports.oxmysql:insert('INSERT INTO player (citizenid, cid, license, name, money, charinfo, job, gang, position, metadata, skin, cloth_config, is_default, features) VALUES (:citizenid, :cid, :license, :name, :money, :charinfo, :job, :gang, :position, :metadata, :skin, :cloth_config, :is_default, :features) ON DUPLICATE KEY UPDATE cid = :cid, name = :name, money = :money, charinfo = :charinfo, job = :job, gang = :gang, position = :position, metadata = :metadata, skin = :skin, cloth_config = :cloth_config, is_default = :is_default, features = :features', {
            citizenid = PlayerData.citizenid,
            cid = tonumber(PlayerData.cid),
            license = PlayerData.license,
            name = PlayerData.name,
            money = json.encode(PlayerData.money),
            charinfo = json.encode(PlayerData.charinfo),
            job = json.encode(PlayerData.job),
            gang = json.encode(PlayerData.gang),
            position = json.encode(pcoords),
            metadata = json.encode(PlayerData.metadata),
            skin = json.encode(PlayerData.skin),
            cloth_config = json.encode(PlayerData.cloth_config),
            is_default = PlayerData.is_default,
            features = json.encode(PlayerData.features),
        })
    else
        exports['soz-monitor']:Log('ERROR', 'Save player error ! PlayerData is empty', { player = PlayerData })
    end
end

-- Delete character

local playertables = { -- Add tables as needed
    { table = 'player' },
    { table = 'apartments' },
    { table = 'bank_accounts' },
    { table = 'crypto_transactions' },
    { table = 'phone_invoices' },
    { table = 'phone_messages' },
    { table = 'player_cloth_set' },
    { table = 'player_boats' },
    { table = 'player_contacts' },
    { table = 'player_houses' },
    { table = 'player_mails' },
    { table = 'player_outfits' },
    { table = 'player_vehicles' }
}

function QBCore.Player.DeleteCharacter(source, citizenid)
    local src = source
    local license = QBCore.Functions.GetSozIdentifier(src)
    local result = exports.oxmysql:scalarSync('SELECT license FROM player where citizenid = ?', { citizenid })
    if license == result then
        for k, v in pairs(playertables) do
            exports.oxmysql:execute('DELETE FROM ' .. v.table .. ' WHERE citizenid = ?', { citizenid })
        end
        exports['soz-monitor']:Log('WARN', 'Character Deleted ! deleted' .. citizenid, { steam = license })
    else
        DropPlayer(src, 'You Have Been Kicked For Exploitation')
        exports['soz-monitor']:Log('WARN', 'Anti-Cheat ! Player has Been Dropped For Character Deletion Exploit', { steam = license })
    end
end

-- Util Functions

function QBCore.Player.GetTotalWeight(items)
    local weight = 0
    if items then
        for slot, item in pairs(items) do
            weight = weight + (item.weight * item.amount)
        end
    end
    return tonumber(weight)
end

function QBCore.Player.GetSlotsByItem(items, itemName)
    local slotsFound = {}
    if items then
        for slot, item in pairs(items) do
            if item.name:lower() == itemName:lower() then
                slotsFound[#slotsFound+1] = slot
            end
        end
    end
    return slotsFound
end

function QBCore.Player.GetFirstSlotByItem(items, itemName)
    if items then
        for slot, item in pairs(items) do
            if item.name:lower() == itemName:lower() then
                return tonumber(slot)
            end
        end
    end
    return nil
end

function QBCore.Player.CreateCitizenId()
    local UniqueFound = false
    local CitizenId = nil
    while not UniqueFound do
        CitizenId = tostring(QBCore.Shared.RandomStr(3) .. QBCore.Shared.RandomInt(5)):upper()
        local result = exports.oxmysql:executeSync('SELECT COUNT(*) as count FROM player WHERE citizenid = ?', { CitizenId })
        if result[1].count == 0 then
            UniqueFound = true
        end
    end
    return CitizenId
end

function QBCore.Player.CreateFingerId()
    local UniqueFound = false
    local FingerId = nil
    while not UniqueFound do
        FingerId = tostring(QBCore.Shared.RandomStr(2) .. QBCore.Shared.RandomInt(3) .. QBCore.Shared.RandomStr(1) .. QBCore.Shared.RandomInt(2) .. QBCore.Shared.RandomStr(3) .. QBCore.Shared.RandomInt(4))
        local query = '%' .. FingerId .. '%'
        local result = exports.oxmysql:executeSync('SELECT COUNT(*) as count FROM `player` WHERE `metadata` LIKE ?', { query })
        if result[1].count == 0 then
            UniqueFound = true
        end
    end
    return FingerId
end

function QBCore.Player.CreatePhoneNumber()
    local UniqueFound = false
    local PhoneNumber = nil
    while not UniqueFound do
        PhoneNumber = tostring('555-' .. QBCore.Shared.RandomInt(4))
        local query = '%' .. PhoneNumber .. '%'
        local result = exports.oxmysql:executeSync('SELECT COUNT(*) as count FROM `player` WHERE `charinfo` LIKE ?', { query })
        if result[1].count == 0 then
            UniqueFound = true
        end
    end
    return PhoneNumber
end

function QBCore.Player.CreateWalletId()
    local UniqueFound = false
    local WalletId = nil
    while not UniqueFound do
        WalletId = 'QB-' .. math.random(11111111, 99999999)
        local query = '%' .. WalletId .. '%'
        local result = exports.oxmysql:executeSync('SELECT COUNT(*) as count FROM player WHERE metadata LIKE ?', { query })
        if result[1].count == 0 then
            UniqueFound = true
        end
    end
    return WalletId
end

function QBCore.Player.CreateSerialNumber()
    local UniqueFound = false
    local SerialNumber = nil
    while not UniqueFound do
        SerialNumber = math.random(11111111, 99999999)
        local query = '%' .. SerialNumber .. '%'
        local result = exports.oxmysql:executeSync('SELECT COUNT(*) as count FROM player WHERE metadata LIKE ?', { query })
        if result[1].count == 0 then
            UniqueFound = true
        end
    end
    return SerialNumber
end

--- Loop
CreateThread(function()
    while true do
        for _, player in pairs(QBCore.Functions.GetQBPlayers()) do
            player.Functions.Save()
        end

        Wait(5 * 60 * 1000)
    end
end)