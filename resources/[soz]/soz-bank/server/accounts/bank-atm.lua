--- @class BankAtmAccount
BankAtmAccount = {}

function BankAtmAccount.new()
    return setmetatable({}, {
        __index = BankAtmAccount,
        __tostring = function()
            return "BankAtmAccount"
        end,
    })
end

--- load
--- @param owner any
--- @return table
function BankAtmAccount:load(id, owner)
    local created = false
    local defaultMoney = 0
    local result = MySQL.Sync.fetchScalar("SELECT money FROM bank_accounts WHERE account_type = 'bank-atm' AND businessid = ?", {
        owner,
    })
    if result == nil then
        local ownerType = GetOwnerType(owner)
        defaultMoney = GetDefaultMoney(ownerType) or 0
        MySQL.insert.await("INSERT INTO bank_accounts (businessid, account_type, money) VALUES (?, 'bank-atm', ?)", {
            owner,
            defaultMoney,
        })
        created = true
    end
    return result or defaultMoney, created
end

--- save
--- @param id any
--- @param owner any
--- @param amount number
--- @return boolean
function BankAtmAccount:save(id, owner, amount, marked_money)
    MySQL.update.await("UPDATE bank_accounts SET money = ? WHERE account_type = 'bank-atm' AND businessid = ?", {
        amount,
        owner,
    })
    return true
end

--- Get owner type based on businessid, eg. "bank_pacific1" => "pacific"
--- @param businessid string
--- @return string
function GetOwnerType(businessid)
    return string.match(string.match(businessid, "%a+%d"), "%a+")
end

--- Get default money amout for specified type of account (bank/ATM)
---@param bankType string
---@return number
function GetDefaultMoney(bankType)
    if Config.BankAtmDefault[bankType] ~= nil then
        return Config.BankAtmDefault[bankType].maxMoney
    end
end

--- Exports functions
setmetatable(BankAtmAccount, {__index = AccountShell})
_G.AccountType["bank-atm"] = BankAtmAccount.new()
