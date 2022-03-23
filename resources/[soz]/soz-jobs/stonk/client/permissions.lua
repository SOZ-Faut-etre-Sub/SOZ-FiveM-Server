function CanBagsBeCollected(shopId)
    if not PlayerData.job.onduty then
        return false
    end

    local hasJobPermission = SozJobCore.Functions.HasPermission(PlayerData.job.id, PlayerData.job.grade, SozJobCore.JobPermission.CashTransfer.CollectBags)

    if hasJobPermission then
        local lastCollect = CollectedShops[shopId]
        if lastCollect then
            local now = exports["soz-jobs"]:GetTimestamp()
            return lastCollect + StonkConfig.Cooldown < now
        else
            return true
        end
    end

    return hasJobPermission
end
exports("CanBagsBeCollected", CanBagsBeCollected)
