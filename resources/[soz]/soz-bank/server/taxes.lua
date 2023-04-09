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

    local percent = 0

    if societyMoney <= 1000000 then
        percent = 0
    elseif societyMoney <= 2000000 then
        percent = 4
    elseif societyMoney <= 4000000 then
        percent = 8
    elseif societyMoney <= 6000000 then
        percent = 12
    else
        percent = 16
    end

    societyTax = math.ceil(societyMoney * percent / 100)
    return societyTaxPayment(society, percent, societyTax)
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
