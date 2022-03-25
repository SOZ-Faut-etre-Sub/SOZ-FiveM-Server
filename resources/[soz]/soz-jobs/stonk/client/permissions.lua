local function isOnDuty()
    return PlayerData.job.onduty
end

function CanBagsBeCollected(shopId)
    local hasJobPermission = SozJobCore.Functions.HasPermission(SozJobCore.JobPermission.CashTransfer.CollectBags)

    if hasJobPermission then
        local shop = CollectedShops[shopId]
        if not shop then
            return isOnDuty()
        end

        local remainingBags = shop["remaining-bags"]
        if type(remainingBags) == "number" and remainingBags > 0 then
            return isOnDuty()
        end

        local lastCollect = shop["last-collection"]
        if lastCollect then
            local now = exports["soz-jobs"]:GetTimestamp()
            return lastCollect + StonkConfig.Collection.Cooldown < now
        end
    end

    return isOnDuty() and hasJobPermission
end
exports("CanBagsBeCollected", CanBagsBeCollected)

function CanBagsBeResold()
    local hasJobPermission = SozJobCore.Functions.HasPermission(SozJobCore.JobPermission.CashTransfer.ResaleBags)

    return isOnDuty() and hasJobPermission
end
exports("CanBagsBeResold", CanBagsBeResold)
