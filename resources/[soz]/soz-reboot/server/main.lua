local QBCore = exports["qb-core"]:GetCoreObject()

--- Disable player login when server is in rebooting stage
AddEventHandler("playerConnecting", function(name, setKickReason, deferrals)
    deferrals.defer()

    if Config.Server.Closed then
        deferrals.done("Le serveur est en cours de redémarrage, veuillez réessayer plus tard.")
    end

    deferrals.done()
end)

--- Functions
local reboot = function()
    print("[soz-reboot] Le serveur passe en mode reboot !")
    Config.Server.Closed = true

    print("[soz-reboot] Déconnexion des joueurs...")
    for _, Player in pairs(QBCore.Functions.GetQBPlayers()) do
        DropPlayer(Player.PlayerData.source, "Le serveur redémarre...")
    end

    print("[soz-reboot] Sauvegarde des inventaires...")
    exports["soz-inventory"]:saveInventories()

    local parkingtime = os.time()
    print("[soz-reboot] Mise des véhicules dans le void...")
    MySQL.Sync.execute("UPDATE player_vehicles SET state = 4, parkingtime = ? WHERE life_counter = 0", {parkingtime})

    print("[soz-reboot] Mise des véhicules à la fourrière")
    MySQL.Sync.execute("UPDATE player_vehicles SET state = 2, garage = 'fourriere', parkingtime = ?, life_counter = life_counter - 1 WHERE state = 0",
                       {parkingtime})

    print("[soz-reboot] Sauvegarde des comptes bancaires...")
    exports["soz-bank"]:saveAccounts()

    print("[soz-reboot] Sauvegarde d'Unexpected Power & Water...")
    exports["soz-upw"]:saveUpw()

    print("[soz-reboot] Finalisation des enchères du concessionnaire sportif...")
    exports["soz-vehicle"]:finishAuctions()
end

local thunder = function()
    exports["soz-core"]:setWeatherUpdate(false)

    GlobalState.weather = "clearing"
    Wait(5 * 60 * 1000)
    GlobalState.weather = "rain"
    Wait(5 * 60 * 1000)
    GlobalState.weather = "thunder"
    Wait(2 * 60 * 1000)
    GlobalState.blackout = true
    Wait(2 * 60 * 1000)
    TriggerClientEvent("InteractSound_CL:PlayOnOne", -1, "system/reboot", 0.05)
    Wait(30 * 1000)
    TriggerClientEvent("InteractSound_CL:PlayOnOne", -1, "system/reboot", 0.05)
    Wait(30 * 1000)

    reboot()
end

--- Commands
RegisterCommand("reboot", reboot, true)

RegisterCommand("thunder", thunder, true)
