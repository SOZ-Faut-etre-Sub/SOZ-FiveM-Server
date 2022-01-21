local Account = {}
local Accounts = {}

setmetatable(Account, {
    __call = function(self, arg)
        if arg then
            if type(arg) == "table" then
                return arg
            end
            if type(arg) == "number" then
                arg = tostring(arg)
            end
            return Accounts[arg]
        end
        return self
    end,
})

MySQL.ready(function()
    local AccountNotLoaded = table.clone(QBCore.Shared.Jobs)

    MySQL.query("SELECT * FROM bank_accounts WHERE not account_type = 'player'", {}, function(result)
        if result then
            for _, v in pairs(result) do
                if v.account_type == 'business' then
                    Account.Create(v.name, QBCore.Shared.Jobs[v.name].label or v.name, v.account_type, v.businessid, v.amount)
                    AccountNotLoaded[v.name] = nil
                end
            end
        end

        -- Create account present in configuration if not exist in database
        for k, v in pairs(AccountNotLoaded) do
            if k ~= "unemployed" then
                Account.Create(k, v.label, 'business', k)
            end
        end
    end)
end)

--- Management
function Account.Create(id, label, accountType, owner, amount)
    if _G.AccountType[accountType] == nil then
        print("Account type not valid !")
        return
    end

    local self = {
        id = tostring(id),
        label = label or id,
        type = accountType,
        owner = owner,
        amount = amount,
        changed = false,
        time = os.time(),
    }

    if not self.amount then
        self.amount, self.changed = _G.AccountType[self.type]:load(self.id, self.owner)
    end

    Accounts[self.id] = self
    return Accounts[self.id]
end

function Account.Remove(inv)
    inv = Account(inv)
    Accounts[inv.id] = nil
end


--- Create Player account
RegisterNetEvent("QBCore:Server:PlayerLoaded", function(player --[[PlayerData]] )
    Account.Create(player.PlayerData.source, player.Functions.GetName(), "player", player.PlayerData.citizenid)
end)

--- Drop Player account
RegisterNetEvent("QBCore:Server:PlayerUnload", function(playerID --[[playerID]] )
    local inv = Account(playerID)

    _G.AccountType[inv.type]:save(inv.id, inv.owner, inv.amount)
    Account.Remove(playerID)
end)

--- Loops
local function saveAccounts(loop)
    for _, inv in pairs(Accounts) do
        if inv.changed then
            if _G.AccountType[inv.type]:save(inv.id, inv.owner, inv.amount) then
                inv.changed = false
            end
        end
    end

    if loop then
        SetTimeout(60000, saveAccounts)
    end
end

saveAccounts(true)

-- Events
AddEventHandler("txAdmin:events:scheduledRestart", function(event)
    if event.secondsRemaining == 60 then
        SetTimeout(50000, function()
            saveAccounts()
        end)
    end
end)

AddEventHandler("onResourceStop", function(resource)
    if resource == GetCurrentResourceName() then
        saveAccounts()
    end
end)

_G.AccountType = {}
