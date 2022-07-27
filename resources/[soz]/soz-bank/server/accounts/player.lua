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
    local result = MySQL.Sync.fetchScalar("SELECT money FROM bank_accounts WHERE account_type = 'player' AND accountid = ? AND citizenid = ?", {
        id,
        owner,
    })
    if result == nil then
        MySQL.insert.await("INSERT INTO bank_accounts (accountid, citizenid, account_type, money) VALUES (?, ?, 'player', ?)", {
            id,
            owner,
            0,
        })
        created = true
    end
    return result and result or Config.DefaultAccountMoney["player"] or 0, created
end

--- save
--- @param id any
--- @param owner any
--- @param amount number
--- @return boolean
function PlayerAccount:save(id, owner, amount, marked_money)
    local Player = QBCore.Functions.GetPlayerByCitizenId(owner)

    exports.oxmysql:update("UPDATE bank_accounts SET money = ? WHERE accountid = ? AND citizenid = ?", {
        amount,
        id,
        owner,
    })
    if Player then
        TriggerClientEvent("phone:client:app:bank:updateBalance", Player.PlayerData.source, Player.Functions.GetName(), id, amount)
    end
    return true
end

--- Exports functions
setmetatable(PlayerAccount, {__index = AccountShell})
_G.AccountType["player"] = PlayerAccount.new()
