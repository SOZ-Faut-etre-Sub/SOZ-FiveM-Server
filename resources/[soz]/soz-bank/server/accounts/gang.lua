--- @class GangAccount
GangAccount = {}

function GangAccount.new()
    return setmetatable({}, {
        __index = GangAccount,
        __tostring = function()
            return "GangAccount"
        end,
    })
end

--- load
--- @param owner any
function GangAccount:load(id, owner)
    local result = MySQL.Sync.fetchSingle("SELECT money, marked_money FROM bank_accounts WHERE account_type = 'gang' AND gangid = ?", {
        id,
    })

    if result ~= nil then
        return result["money"], false, result["marked_money"]
    end

    MySQL.insert.await("INSERT INTO bank_accounts (gangid, account_type, money) VALUES (?, 'gang', ?)", {id, 0})
    return 0, true, 0
end

--- AccessAllowed
--- @param player any
--- @return boolean
function GangAccount:AccessAllowed(owner, player)
    return true
end

--- save
--- @param id any
--- @param owner any
--- @param money number
--- @return boolean
function GangAccount:save(id, owner, money, marked_money)
    exports.oxmysql:update("UPDATE bank_accounts SET money = ?, marked_money = ? WHERE account_type = 'gang' AND gangid = ?", {
        money,
        marked_money,
        id,
    })
    return true
end

--- Exports functions
setmetatable(GangAccount, {__index = AccountShell})
_G.AccountType["gang"] = GangAccount.new()
