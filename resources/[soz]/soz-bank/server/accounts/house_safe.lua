--- @class HouseSafeAccount
HouseSafeAccount = {}

function HouseSafeAccount.new()
    return setmetatable({}, {
        __index = HouseSafeAccount,
        __tostring = function()
            return "HouseSafeAccount"
        end,
    })
end

--- load
--- @param owner any
--- @return table
function HouseSafeAccount:load(id, owner)
    local created = false
    local result = MySQL.Sync.fetchScalar("SELECT money FROM bank_accounts WHERE account_type = 'safestorages' AND houseid = ?", {
        id,
    })
    if result == nil then
        MySQL.insert.await("INSERT INTO bank_accounts (houseid, account_type, money) VALUES (?, 'safestorages', ?)", {
            id,
            0,
        })
        created = true
    end
    return result and result or 0, created
end

--- AccessAllowed
--- @param acc any
--- @param player any
--- @return boolean
function HouseSafeAccount:AccessAllowed(owner, player)
    return true
end

--- save
--- @param id any
--- @param owner any
--- @param money number
--- @return boolean
function HouseSafeAccount:save(id, owner, money, marked_money)
    exports.oxmysql:update("UPDATE bank_accounts SET marked_money = ? WHERE account_type = 'safestorages' AND houseid = ?", {
        marked_money,
        id,
    })
    return true
end

--- Exports functions
setmetatable(HouseSafeAccount, {__index = AccountShell})
_G.AccountType["house_safe"] = HouseSafeAccount.new()
