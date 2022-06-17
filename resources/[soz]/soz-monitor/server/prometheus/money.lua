-- Get all metrics about money
function GetBankMetrics()
    local bankMetrics = exports["soz-bank"]:GetMetrics()
    local lines = {
        [[
# HELP soz_bank_account_money Amount of money in a bank account
# TYPE soz_bank_account_money gauge
]],
    }

    for _, banKMetric in pairs(bankMetrics) do
        table.insert(lines,
                     string.format("soz_bank_account_money{type=\"%s\",label=\"%s\",owner=\"%s\",id=\"%s\"} %d", banKMetric.type, banKMetric.label,
                                   banKMetric.owner, banKMetric.id, banKMetric.money))
    end

    table.insert(lines, [[
# HELP soz_bank_account_marked_money Amount of marked money in a bank account
# TYPE soz_bank_account_marked_money gauge
]])

    for _, banKMetric in pairs(bankMetrics) do
        table.insert(lines,
                     string.format("soz_bank_account_marked_money{type=\"%s\",label=\"%s\",owner=\"%s\",id=\"%s\"} %d", banKMetric.type, banKMetric.label,
                                   banKMetric.owner, banKMetric.id, banKMetric.marked_money))
    end

    return table.concat(lines, "\n")
end
