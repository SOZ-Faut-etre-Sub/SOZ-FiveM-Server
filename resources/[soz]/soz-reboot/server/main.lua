local QBCore = exports["qb-core"]:GetCoreObject()

--- Disable player login when server is in rebooting stage
AddEventHandler("playerConnecting", function(name, setKickReason, deferrals)
    deferrals.defer()

    if Config.Server.Closed then
        deferrals.done("Le serveur est en cours de redémarrage, veuillez réessayer plus tard.")
    end

    deferrals.done()
end)

RegisterCommand("reboot", function(source, args, rawCommand)
    print("[soz-reboot] Le serveur passe en mode reboot !")
    Config.Server.Closed = true

    print("[soz-reboot] Déconnexion des joueurs...")
    for _, Player in pairs(QBCore.Functions.GetQBPlayers()) do
        DropPlayer(Player.PlayerData.source, "Le serveur redémarre...")
    end

    print("[soz-reboot] Sauvegarde des inventaires...")
    exports["soz-inventory"]:saveInventories()

    print("[soz-reboot] Sauvegarde des comptes bancaires...")
    exports["soz-bank"]:saveAccounts()

    print("[soz-reboot] Extinction du serveur...")
    ExecuteCommand("quit")
end, true)
