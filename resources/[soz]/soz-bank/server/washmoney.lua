function WashMoney()
    local OffshoreAccounts = {}

    for _, account in pairs(Accounts) do
        if string.find(account.id, "offshore_") ~= nil then
            OffshoreAccounts[#OffshoreAccounts + 1] = account
        end
    end

    local maxWashAmount = math.ceil((Config.OffShoreMaxWashAmount / #OffshoreAccounts) - 0.5)

    for _, account in pairs(OffshoreAccounts) do
        local toWash = maxWashAmount

        if account.marked_money < toWash then
            toWash = account.marked_money
        end

        Account.RemoveMoney(account.id, toWash, "marked_money")
        Account.AddMoney(string.gsub(account.id, "offshore_", ""), toWash, "money")
    end
end

TriggerEvent("cron:runAt", 2, 00, WashMoney)
