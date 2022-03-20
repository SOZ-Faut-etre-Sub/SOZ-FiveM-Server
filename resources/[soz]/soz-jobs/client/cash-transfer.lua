QBCore = exports["qb-core"]:GetCoreObject()

function CanBagsBeCollected(shopId)
    local PlayerData = QBCore.Functions.GetPlayerData()

    local hasJobPermission = SozJobCore.Functions.HasPermission(PlayerData.job.id, PlayerData.job.grade, SozJobCore.JobPermission.CashTransfer.CollectBags)

    if hasJobPermission then
        if not PlayerData.job.metadata then
            return true
        end

        local lastCollect = PlayerData.job.metadata[shopId]
        if lastCollect then
            local now = exports["soz-jobs"]:GetTimestamp()
            return lastCollect + SozJobCore.CashTransfer.Cooldown < now
        else
            return true
        end
    end

    return hasJobPermission
end
exports("CanBagsBeCollected", CanBagsBeCollected)

AddEventHandler("soz-jobs:client:stonk-collect-bag", function ()
    TriggerEvent(
        "progressbar:client:progress",
        {
            name = "stonk-collect-bag",
            duration = SozJobCore.CashTransfer.CollectionDuration,
            label = "Vous collectez les sacs d'argent",
            controlDisables = {
                disableMovement = false,
                disableCarMovement = false,
                disableMouse = false,
                disableCombat = false,
            },
        },
        function (wasCancelled)
            if not wasCancelled then
                -- TODO
            else
                exports["soz-hud"]:DrawNotification("~r~Vous n'avez pas collecté les sacs d'argent")
            end
        end
    )
end)
