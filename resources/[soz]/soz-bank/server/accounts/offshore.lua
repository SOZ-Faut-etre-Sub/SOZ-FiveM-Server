--- @class OffShoreAccount
OffShoreAccount = {}

function OffShoreAccount.new()
    return setmetatable({}, {
        __index = OffShoreAccount,
        __tostring = function()
            return "OffShoreAccount"
        end,
    })
end

--- load
--- @param owner any
--- @return table
function OffShoreAccount:load(id, owner)
    local created = false
    local result = MySQL.Sync.fetchScalar("SELECT money FROM bank_accounts WHERE account_type = 'offshore' AND businessid = ?", {
        id,
    })
    if result == nil then
        MySQL.insert.await("INSERT INTO bank_accounts (businessid, account_type, money) VALUES (?, 'offshore', ?)", {
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
function OffShoreAccount:AccessAllowed(owner, player)
    local Player = QBCore.Functions.GetPlayer(tonumber(player))

    if Player then
        return Player.PlayerData.job.name == owner and Player.PlayerData.job.isboss
    else
        return false
    end
end

--- save
--- @param id any
--- @param owner any
--- @param money number
--- @return boolean
function OffShoreAccount:save(id, owner, money, marked_money)
    MySQL.update.await("UPDATE bank_accounts SET money = ?, marked_money = ? WHERE account_type = 'offshore' AND businessid = ?", {
        money,
        marked_money,
        id,
    })
    return true
end

--- Exports functions
setmetatable(OffShoreAccount, {__index = AccountShell})
_G.AccountType["offshore"] = OffShoreAccount.new()
