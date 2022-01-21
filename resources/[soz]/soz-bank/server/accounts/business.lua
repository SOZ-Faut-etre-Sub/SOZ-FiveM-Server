--- @class BusinessAccount
BusinessAccount = {}

function BusinessAccount.new()
    return setmetatable({}, {
        __index = BusinessAccount,
        __tostring = function()
            return "BusinessAccount"
        end,
    })
end

--- load
--- @param owner any
--- @return table
function BusinessAccount:load(id, owner)
    local created = false
    local result = MySQL.Sync.fetchScalar("SELECT amount FROM bank_accounts WHERE account_type = 'business' AND businessid = ?", {owner})
    if result == nil then
        MySQL.insert.await("INSERT INTO bank_accounts (businessid, account_type, amount) VALUES (?, 'business', ?)", {owner, 0})
        created = true
    end
    return result and result or Config.DefaultAccountMoney["business"] or 0, created
end

--- save
--- @param id any
--- @param owner any
--- @param amount number
--- @return boolean
function BusinessAccount:save(id, owner, amount)
    MySQL.update.await("UPDATE bank_accounts SET amount = ? WHERE businessid = ?", {amount, owner})
    return true
end

--- Exports functions
setmetatable(BusinessAccount, {__index = AccountShell})
_G.AccountType["business"] = BusinessAccount.new()
