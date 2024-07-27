local function GetOrCreateAccount(accountName, coords)
    local account, created = Account(accountName), false
    if account == nil then
        account = Account.Create(accountName, "bank-atm", "bank-atm", accountName, nil, nil, coords)
        created = true
    end
    return account, created
end

function GetBankAccountName(bank)
    return string.format("bank_%s", bank)
end
exports("GetBankAccountName", GetBankAccountName)

local function GetAtmAccount(atmType, coords)
    local coordsHash = GetAtmHashByCoords(coords)
    local accountName = GetAtmAccountName(atmType, coordsHash, coords)
    return GetOrCreateAccount(accountName, coords)
end

QBCore.Functions.CreateCallback("banking:server:getAtmAccount", function(source, cb, atmType, coords)
    local coordsHash = GetAtmHashByCoords(coords)
    local account, created = GetAtmAccount(atmType, coords)
    if created then
        for _, playerId in pairs(GetPlayers()) do
            TriggerClientEvent("banking:client:displayAtmBlips", playerId, { [account.owner] = coords })
        end
    end
    cb({ account = account.owner, name = string.format("atm_%s_%s", atmType, coordsHash) })
end)

QBCore.Functions.CreateCallback("banking:server:getAtmMoney", function(source, cb, atmType, coords)
    local account, _ = GetAtmAccount(atmType, coords)
    cb(account.money)
end)

local function getBankAccount(bank)
    local accountName = GetBankAccountName(bank)
    return GetOrCreateAccount(accountName)
end

QBCore.Functions.CreateCallback("banking:server:getBankAccount", function(source, cb, bank)
    local account, _ = getBankAccount(bank)
    cb(account.id)
end)

QBCore.Functions.CreateCallback("banking:server:getBankMoney", function(source, cb, bank)
    local account, _ = getBankAccount(bank)
    cb(account.money)
end)

function GetAccountMoney(accountName, type)
    local account = GetOrCreateAccount(accountName)

    return Account.GetMoney(account, type or "money")
end
exports("GetAccountMoney", GetAccountMoney)

QBCore.Functions.CreateCallback("banking:server:hasEnoughLiquidity", function(source, cb, accountId, amount)
    local account = Account(accountId)
    if account == nil then
        TriggerClientEvent("soz-core:client:notification:draw", source, "Compte invalide", "error")
        return
    end

    if account.money >= amount then
        cb(true)
    else
        cb(false, "invalid_liquidity")
    end
end)

RegisterNetEvent("banking:server:RemoveLiquidity", function(accountId, amount)
    local account = Account(accountId)
    if account == nil then
        TriggerClientEvent("soz-core:client:notification:draw", source, "Compte invalide", "error")
        return
    end
    Account.RemoveMoney(accountId, amount, "money")
end)

QBCore.Functions.CreateCallback("banking:server:needRefill", function(source, cb, data)
    local maxMoney, account
    if data.bank ~= nil then
        -- BANK
        local bankType = string.match(string.match(data.bank, "%a+%d"), "%a+")
        maxMoney = Config.BankAtmDefault[bankType].maxMoney
        account = getBankAccount(data.bank)
    else
        -- ATM
        maxMoney = Config.BankAtmDefault[data.atmType].maxMoney
        account = GetAtmAccount(data.atmType, data.coords)
    end
    cb({
        needRefill = account.money < maxMoney,
        currentAmount = account.money,
        missingAmount = maxMoney - account.money,
        accountId = account.id,
    })
end)

RegisterNetEvent("banking:server:RemoveAtmLiquidityRatio", function(coords, atmType, value)
    if (type(coords) ~= "vector3") then
        coords = vector3(coords.x, coords.y, coords.z)
    end
    local account = GetAtmAccount(atmType, coords)
    Account.RemoveMoney(account, account.money * value, "money")
end)
