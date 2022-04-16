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

function GetBankAccountName(bank)
    return string.format("bank_%s", bank)
end

QBCore.Functions.CreateCallback("banking:server:getAtmMoney", function(source, cb, atmType, coords)
    local coordsHash = GetAtmHashByCoords(coords)
    local accountName = GetAtmAccountName(atmType, coordsHash)
    local account = GetOrCreateAccount(accountName)
    -- TODO
    cb(account.money)
end)

QBCore.Functions.CreateCallback("banking:server:getBankMoney", function(source, cb, bank)
    local accountName = GetBankAccountName(bank)
    local account = GetOrCreateAccount(accountName)
    -- TODO
    cb(account.money)
end)
