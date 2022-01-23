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

    MySQL.query("SELECT * FROM bank_accounts", {}, function(result)
        if result then
            for _, v in pairs(result) do
                if v.account_type == 'player' then
                    Account.Create(v.accountid, v.citizenid, v.account_type, v.citizenid, v.amount)
                elseif v.account_type == 'business' then
                    Account.Create(v.businessid, QBCore.Shared.Jobs[v.businessid].label or v.name, v.account_type, v.businessid, v.amount)
                    AccountNotLoaded[v.businessid] = nil
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

function Account.Remove(acc)
    acc = Account(acc)
    Accounts[acc.id] = nil
end

function Account.AddMoney(acc, amount)
    acc = Account(acc)

    acc.amount = math.ceil(acc.amount + amount - 0.5)
    acc.changed = true
    return true
end

function Account.RemoveMoney(acc, amount)
    acc = Account(acc)
    if acc.amount - amount >= 0 then
        acc.amount = math.ceil(acc.amount - amount - 0.5)
        acc.changed = true
        return true
    else
        return false, 'no_account_money'
    end
end

function Account.TransfertMoney(accSource, accTarget, amount, cb)
    accSource = Account(accSource)
    accTarget = Account(accTarget)
    amount = math.round(amount, 0)
    local success, reason = false, nil

    if accSource then
        if accTarget then
            if amount > accSource.amount then
                amount = accSource.amount
            end

            if Account.RemoveMoney(accSource, amount) and Account.AddMoney(accTarget, amount) then
                _G.AccountType[accSource.type]:save(accSource.id, accSource.owner, accSource.amount)
                _G.AccountType[accTarget.type]:save(accTarget.id, accTarget.owner, accTarget.amount)

                success = true
            else
                success, reason = false, "transfert_failed"
            end
        else
            success, reason = false, "invalid_account"
        end
    else
        success, reason = false, "invalid_account"
    end

    if cb then
        cb(success, reason)
    end
end


--- Create Player account
RegisterNetEvent("QBCore:Server:PlayerLoaded", function(player --[[PlayerData]] )
    if Account(player.PlayerData.charinfo.account) == nil then
        Account.Create(player.PlayerData.charinfo.account, player.Functions.GetName(), "player", player.PlayerData.citizenid)
    end
end)

--- Loops
local function saveAccounts(loop)
    for _, acc in pairs(Accounts) do
        if acc.changed then
            if _G.AccountType[acc.type]:save(acc.id, acc.owner, acc.amount) then
                acc.changed = false
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

_G.Account = Account
_G.AccountType = {}
