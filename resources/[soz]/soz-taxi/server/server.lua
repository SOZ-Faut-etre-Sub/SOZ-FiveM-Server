local QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("taxi:server:NpcPay", function(Payment)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)

    TriggerEvent("banking:server:TransferMoney", "farm_taxi", "safe_taxi", Payment)
    TriggerEvent("monitor:server:event", "job_carljr_npc_course", {player_source = Player.PlayerData.source},
                 {amount = tonumber(Payment), position = GetEntityCoords(GetPlayerPed(Player.PlayerData.source))})
end)
