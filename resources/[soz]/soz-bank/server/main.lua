QBCore = exports["qb-core"]:GetCoreObject()

local function format_int(number)
    local i, j, minus, int, fraction = tostring(number):find('([-]?)(%d+)([.]?%d*)')
    int = int:reverse():gsub("(%d%d%d)", "%1,")
    return minus .. int:reverse():gsub("^,", "") .. fraction
end


QBCore.Functions.CreateCallback('banking:getBankingInformation', function(source, cb)
    local src = source
    local xPlayer = QBCore.Functions.GetPlayer(src)
    while xPlayer == nil do Wait(0) end
    if (xPlayer) then
        local banking = {
            ['name'] = xPlayer.PlayerData.charinfo.firstname .. ' ' .. xPlayer.PlayerData.charinfo.lastname,
            ['bankbalance'] = '$'.. format_int(xPlayer.PlayerData.money['bank']),
            ['cash'] = '$'.. format_int(xPlayer.PlayerData.money['money']),
            ['accountinfo'] = xPlayer.PlayerData.charinfo.account,
        }
        --if savingsAccounts[xPlayer.PlayerData.citizenid] then
        --    local cid = xPlayer.PlayerData.citizenid
        --    banking['savings'] = {
        --        ['amount'] = savingsAccounts[cid].GetBalance(),
        --        ['details'] = savingsAccounts[cid].getAccount(),
        --        ['statement'] = savingsAccounts[cid].getStatement(),
        --    }
        --end
        cb(banking)
    else
        cb(nil)
    end
end)