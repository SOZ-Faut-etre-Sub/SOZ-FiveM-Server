QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    local token = QBCore.Functions.TriggerRpc("soz-api:server:GetJwtToken")

    LocalPlayer.state.SozJWTToken = token
end)
