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
    local result = MySQL.Sync.fetchScalar("SELECT money FROM bank_accounts WHERE account_type = 'bank-atm' AND businessid = ?", {
        owner,
    })
    if result == nil then
        MySQL.insert.await("INSERT INTO bank_accounts (businessid, account_type, money) VALUES (?, 'bank-atm', ?)", {
            owner,
            0,
        })
        created = true
    end
    return result or 0, created -- TODO Add default
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

--- Exports functions
setmetatable(BankAtmAccount, {__index = AccountShell})
_G.AccountType["bank-atm"] = BankAtmAccount.new()
