function PaySocietyTaxes(d, h, m)
    if d ~= 4 then -- 1-7 = Sunday-Saturday
        return
    end

    for society, accounts in pairs(Config.SocietyTaxes.privateSociety) do
        societyTaxCalculation(society, accounts)
    end
end

function societyTaxCalculation(society, accounts)
    local societyMoney, societyTax = 0, 0

    for _, account in pairs(accounts) do
        societyMoney = societyMoney + Account.GetMoney(account, "money")
    end

    if societyMoney <= 1000000 then
        return societyTaxPayment(society, 0, 0)
    end

    if societyMoney > 1000000 and societyMoney <= 3000000 then
        societyTax = math.ceil(societyMoney * 0.02)
        return societyTaxPayment(society, 2, societyTax)
    end

    if societyMoney > 3000000 and societyMoney <= 5000000 then
        societyTax = math.ceil(societyMoney * 0.04)
        return societyTaxPayment(society, 4, societyTax)
    end

    if societyMoney > 5000000 and societyMoney <= 6000000 then
        societyTax = math.ceil(societyMoney * 0.08)
        return societyTaxPayment(society, 8, societyTax)
    end

    societyTax = math.ceil(societyMoney * 0.10)
    return societyTaxPayment(society, 10, societyTax)
end

function societyTaxPayment(society, percentage, tax)
    exports["soz-monitor"]:Log("INFO", "Society " .. society .. " paid " .. tax .. "$ tax. Percentage: " .. percentage .. "%")

    for account, repartition in pairs(Config.SocietyTaxes.taxRepartition) do
        local money = math.ceil(tax * repartition / 100)

        Account.TransfertMoney(society, account, money, function(success, reason)
            if success then
                exports["soz-monitor"]:Log("INFO", "Public society " .. account .. " receive " .. money .. "$ tax. Percentage: " .. repartition .. "%")
            else
                exports["soz-monitor"]:Log("ERROR", "Public society " .. account .. " can't receive " .. money .. "$ tax. Percentage: " .. repartition .. "%" ..
                                               " | Reason: " .. reason)
            end
        end)
    end
end

TriggerEvent("cron:runAt", 5, 0, PaySocietyTaxes)
