local function GetOrCreateAccount(accountName)
    local account, created = Account(accountName), false
    if account == nil then
        account = Account.Create("bank-atm", "bank-atm", "bank-atm", accountName)
        created = true
    end
    return account, created
end

local function GetAtmHashByCoords(coords)
    local formattedCoords = {}
    for _, v in pairs({"x", "y", "z"}) do
        table.insert(formattedCoords, math.floor(coords[v] * 100) / 100)
    end
    return GetHashKey(table.concat(formattedCoords, "_"))
end

local function GetAtmAccountName(atmType, atmCoordsHash)
    return string.format("atm_%s_%s", atmType, atmCoordsHash)
end
exports("GetAtmAccountName", GetAtmAccountName)

function GetBankAccountName(bank)
    return string.format("bank_%s", bank)
end
exports("GetBankAccountName", GetBankAccountName)

local function getAtmAccount(atmType, coords)
    local coordsHash = GetAtmHashByCoords(coords)
    local accountName = GetAtmAccountName(atmType, coordsHash)
    return GetOrCreateAccount(accountName)
end
QBCore.Functions.CreateCallback("banking:server:getAtmMoney", function(source, cb, atmType, coords)
    local account, _ = getAtmAccount(atmType, coords)
    cb(account.money)
end)

local function getBankAccount(bank)
    local accountName = GetBankAccountName(bank)
    return GetOrCreateAccount(accountName)
end
QBCore.Functions.CreateCallback("banking:server:getBankMoney", function(source, cb, bank)
    local account, _ = getBankAccount(bank)
    cb(account.money)
end)

QBCore.Functions.CreateCallback("banking:server:needRefill", function(source, cb, data)
    local maxMoney, accountMoney
    if data.bank ~= nil then -- BANK
        local bankType = string.match(string.match(data.bank, "%a+%d"), "%a+")
        maxMoney = Config.BankAtmDefault[bankType].maxMoney or 0
        accountMoney = getBankAccount(data.bank) or 0
    else -- ATM
        maxMoney = Config.BankAtmDefault[data.atmType].maxMoney or 0
        accountMoney = getAtmAccount(data.atmType, data.coords) or 0
    end
    cb(accountMoney.money < maxMoney)
end)
