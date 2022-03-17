--- @class SafeStorageAccount
SafeStorageAccount = {}

function SafeStorageAccount.new()
    return setmetatable({}, {
        __index = SafeStorageAccount,
        __tostring = function()
            return "SafeStorageAccount"
        end,
    })
end

--- load
--- @param owner any
--- @return table
function SafeStorageAccount:load(id, owner)
    local created = false
    local result = MySQL.Sync.fetchScalar("SELECT money FROM bank_accounts WHERE account_type = 'safestorages' AND businessid = ?", {
        id,
    })
    if result == nil then
        MySQL.insert.await("INSERT INTO bank_accounts (businessid, account_type, money) VALUES (?, 'safestorages', ?)", {
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
function SafeStorageAccount:AccessAllowed(owner, player)
    local SozJobCore = exports["soz-jobs"]:GetCoreObject()
    local Player = QBCore.Functions.GetPlayer(tonumber(player))

    if Player then
        return Player.PlayerData.job.id == owner and
                   SozJobCore.Functions.HasPermission(Player.PlayerData.job.id, Player.PlayerData.job.grade, SozJobCore.JobPermission.SocietyPrivateStorage)
    else
        return false
    end
end

--- save
--- @param id any
--- @param owner any
--- @param money number
--- @return boolean
function SafeStorageAccount:save(id, owner, money, marked_money)
    MySQL.update.await("UPDATE bank_accounts SET money = ?, marked_money = ? WHERE account_type = 'safestorages' AND businessid = ?", {
        money,
        marked_money,
        id,
    })
    return true
end

--- Exports functions
setmetatable(SafeStorageAccount, {__index = AccountShell})
_G.AccountType["safestorages"] = SafeStorageAccount.new()
