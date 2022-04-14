-- Get all metrics about money
function GetBankMetrics()
    local bankMetrics = exports["soz-bank"]:GetMetrics()
    local metricsString = [[
# HELP soz_bank_account_money Amount of money in a bank account
# TYPE soz_bank_account_money gauge
]]

    for _, banKMetric in pairs(bankMetrics) do
        metricsString = metricsString .. string.format([[
soz_bank_account_money{type="%s",label="%s",owner="%s",id="%s"} %d
]], banKMetric.type, banKMetric.label, banKMetric.owner, banKMetric.id, banKMetric.money)
    end

    metricsString = metricsString .. [[

# HELP soz_bank_account_marked_money Amount of marked money in a bank account
# TYPE soz_bank_account_marked_money gauge
]]

    for _, banKMetric in pairs(bankMetrics) do
        metricsString = metricsString .. string.format([[
soz_bank_account_marked_money{type="%s",label="%s",owner="%s",id="%s"} %d
]], banKMetric.type, banKMetric.label, banKMetric.owner, banKMetric.id, banKMetric.marked_money)
    end

    return metricsString
end
