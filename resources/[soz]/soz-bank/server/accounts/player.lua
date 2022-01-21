--- @class PlayerAccount
PlayerAccount = {}

function PlayerAccount.new()
    return setmetatable({}, {
        __index = PlayerAccount,
        __tostring = function()
            return "PlayerAccount"
        end,
    })
end

--- load
--- @param owner any
--- @return table
function PlayerAccount:load(id, owner)
    local created = false
    local result = MySQL.Sync.fetchScalar("SELECT amount FROM bank_accounts WHERE account_type = 'player' AND citizenid = ?", {owner})
    if result == nil then
        MySQL.insert.await("INSERT INTO bank_accounts (citizenid, account_type, amount) VALUES (?, 'player', ?)", {owner, 0})
        created = true
    end
    return result and result or Config.DefaultAccountMoney["player"] or 0, created
end

--- save
--- @param id any
--- @param owner any
--- @param amount number
--- @return boolean
function PlayerAccount:save(id, owner, amount)
    MySQL.update.await("UPDATE bank_accounts SET amount = ? WHERE citizenid = ?", {amount, owner})
    return true
end

--- Exports functions
setmetatable(PlayerAccount, {__index = AccountShell})
_G.AccountType["player"] = PlayerAccount.new()
