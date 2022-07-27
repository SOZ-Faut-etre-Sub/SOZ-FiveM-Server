Account = {}
Accounts = {}

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
    local SozJobCore = exports["soz-jobs"]:GetCoreObject()

    local EnterpriseAccountNotLoaded = table.clone(SozJobCore.Jobs)
    local EnterpriseSafeNotLoaded = table.clone(Config.SafeStorages)
    local BankNotLoaded = table.clone(Config.BankPedLocations)
    local AtmNotLoaded = table.clone(Config.AtmLocations)

    local weekday = os.date("%w")
    local hour = os.date("%H")

    if tonumber(weekday) == 1 and tonumber(hour) < 14 then
        exports.oxmysql:update_async("UPDATE bank_accounts SET money = money + 400000 WHERE account_type = 'business' AND businessid IN ('lspd', 'bcso')")
        exports.oxmysql:update_async("UPDATE bank_accounts SET money = money + 200000 WHERE account_type = 'business' AND businessid IN ('lsmc', 'bennys')")
    end

    MySQL.query("SELECT * FROM bank_accounts", {}, function(result)
        if result then
            for _, v in pairs(result) do
                if v.account_type == "player" then
                    Account.Create(v.accountid, v.citizenid, v.account_type, v.citizenid, v.money)
                elseif v.account_type == "business" then
                    Account.Create(v.businessid, SozJobCore.Jobs[v.businessid] and SozJobCore.Jobs[v.businessid].label or v.name, v.account_type, v.businessid,
                                   v.money)
                    EnterpriseAccountNotLoaded[v.businessid] = nil
                elseif v.account_type == "safestorages" then
                    if v.houseid then
                        Account.Create(v.houseid, v.houseid, "house_safe", v.houseid, v.money, v.marked_money)
                    else
                        Account.Create(v.businessid, Config.SafeStorages[v.businessid] and Config.SafeStorages[v.businessid].label or v.name, v.account_type,
                                       v.businessid, v.money, v.marked_money)
                        EnterpriseSafeNotLoaded[v.businessid] = nil
                    end
                elseif v.account_type == "offshore" then
                    Account.Create(v.businessid, v.businessid, v.account_type, v.businessid, v.money, v.marked_money)
                elseif v.account_type == "bank-atm" then
                    Account.Create(v.businessid, v.businessid, v.account_type, v.businessid, v.money, v.marked_money, v.coords)
                    if string.match(v.businessid, "bank_%w+") then
                        local bank = string.match(v.businessid, "%a+%d")
                        BankNotLoaded[bank] = nil
                    elseif string.match(v.businessid, "atm_%w+") then
                        AtmNotLoaded[v.businessid] = nil
                    end
                end
            end
        end

        -- Create account present in configuration if not exist in database
        for k, v in pairs(EnterpriseAccountNotLoaded) do
            if k ~= "unemployed" then
                Account.Create(k, v.label, "business", k)
            end
        end

        -- Create account present in configuration if not exist in database
        for k, v in pairs(EnterpriseSafeNotLoaded) do
            Account.Create(k, v.label, "safestorages", v.owner)
        end

        -- Create account present in configuration if not exist in database
        for k, coords in pairs(BankNotLoaded) do
            if k ~= "pacific2" and k ~= "pacific3" then
                Account.Create(k, k, "bank-atm", "bank_" .. k, nil, nil, coords)
            end
        end

        -- ATMs account
        for _, atmData in pairs(AtmNotLoaded) do
            local accId = atmData.accountId
            if Config.AtmPacks[accId] == nil then
                Account.Create(accId, accId, "bank-atm", accId, nil, nil, atmData.coords)
            end
        end
    end)

    for account, money in pairs(Config.FarmAccountMoney) do
        Account.Create(account, account, "farm", account, money.money, money.marked_money)
    end
end)

--- Management
function Account.Create(id, label, accountType, owner, money, marked_money, coords)
    if _G.AccountType[accountType] == nil then
        print("Account type not valid !")
        return
    end

    local self = {
        id = tostring(id),
        label = label or id,
        type = accountType,
        owner = owner,
        money = money,
        marked_money = marked_money or 0,
        coords = coords,
        changed = false,
        time = os.time(),
    }

    if not self.money then
        self.money, self.changed = _G.AccountType[self.type]:load(self.id, self.owner, self.coords)
    end

    if self.type == "safestorages" then
        if string.find(self.id, "safe_") == nil then
            self.id = "safe_" .. self.id
        end
    end

    Accounts[self.id] = self
    return Accounts[self.id]
end

function Account.Remove(acc)
    acc = Account(acc)
    Accounts[acc.id] = nil
end

function Account.AddMoney(acc, money, money_type)
    acc = Account(acc)

    if money_type == nil then
        money_type = "money"
    end

    acc[money_type] = math.ceil(acc[money_type] + money - 0.5)
    acc.changed = true
    return true
end

function Account.RemoveMoney(acc, money, money_type)
    acc = Account(acc)

    if money_type == nil then
        money_type = "money"
    end

    if acc[money_type] - money >= 0 then
        acc[money_type] = math.ceil(acc[money_type] - money - 0.5)
        acc.changed = true
        return true
    else
        return false, "no_account_money"
    end
end

function Account.TransfertMoney(accSource, accTarget, money, cb)
    accSource = Account(accSource)
    accTarget = Account(accTarget)
    money = math.round(money, 0)
    local success, reason = false, nil

    if accSource then
        if accTarget then
            if money <= accSource.money then
                if Account.RemoveMoney(accSource, money) and Account.AddMoney(accTarget, money) then
                    _G.AccountType[accSource.type]:save(accSource.id, accSource.owner, accSource.money, accSource.marked_money)
                    _G.AccountType[accTarget.type]:save(accTarget.id, accTarget.owner, accTarget.money, accTarget.marked_money)

                    success = true
                else
                    success, reason = false, "transfert_failed"
                end
            else
                success, reason = false, "no_account_money"
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

function Account.AccessGranted(acc, playerId)
    acc = Account(acc)

    local owner = acc.owner
    if string.find(owner, "safe_") ~= nil then
        owner = string.sub(owner, 6)
    end

    return _G.AccountType[acc.type]:AccessAllowed(owner, playerId)
end

--- Create Player account
RegisterNetEvent("QBCore:Server:PlayerLoaded", function(player --[[PlayerData]] )
    local account = Account(player.PlayerData.charinfo.account)
    if account == nil then
        account = Account.Create(player.PlayerData.charinfo.account, player.Functions.GetName(), "player", player.PlayerData.citizenid)
    end

    TriggerClientEvent("phone:client:app:bank:updateBalance", player.PlayerData.source, player.Functions.GetName(), account.id, account.money)
end)

--- Loops
local function saveAccounts(loop)
    for _, acc in pairs(Accounts) do
        if acc.changed then
            if _G.AccountType[acc.type]:save(acc.id, acc.owner, acc.money, acc.marked_money) then
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
AddEventHandler("onResourceStop", function(resource)
    if resource == GetCurrentResourceName() then
        saveAccounts()
    end
end)

exports("saveAccounts", saveAccounts)

_G.AccountType = {}

local function GetMetrics()
    local metrics = {}

    for _, acc in pairs(Accounts) do
        table.insert(metrics, {
            id = acc.id,
            label = acc.label,
            type = acc.type,
            owner = acc.owner,
            money = acc.money,
            marked_money = acc.marked_money,
        })
    end

    return metrics
end

exports("GetMetrics", GetMetrics)
