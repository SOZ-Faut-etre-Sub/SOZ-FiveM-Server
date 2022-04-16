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

QBCore.Functions.CreateCallback("banking:server:getBankAtmAccount", function(source, cb, atmType, coords)
    local coordsHash = GetAtmHashByCoords(coords)
    local accountName = GetAtmAccountName(atmType, coordsHash)
    local account = Account(accountName)
    if account == nil then
        account = Account.Create("bank-atm", "bank-atm", "bank-atm", accountName)
    end
    -- TODO
    cb()
end)
