function CreateResaleZone(data)
    data.options = {
        {
            label = "Vendre l'énergie",
            event = "soz-upw:client:ResaleEnergy",
            canInteract = function()
                return OnDuty()
            end,
            blackoutGlobal = true,
        },
    }

    return CreateZone("UPW", "Resale", data)
end

AddEventHandler("soz-upw:client:ResaleEnergy", function()
    local progress, elapsed = exports["soz-utils"]:Progressbar("soz-upw:progressbar:resale", "Vous vendez de l'énergie", Config.Upw.Resale.Duration, false,
                                                               true,
                                                               {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "anim@mp_radio@garage@low", anim = "action_a"}, {}, {})

    if not progress then
        exports["soz-hud"]:DrawNotification("Il y a eu une erreur", "error")
        return
    end

    local res = QBCore.Functions.TriggerRpc("soz-upw:server:ResaleEnergy")
    local success, message = table.unpack(res)

    if success then
        exports["soz-hud"]:DrawNotification(message, "success")
        TriggerEvent("soz-upw:client:ResaleEnergy")
    else
        exports["soz-hud"]:DrawNotification(message, "error")
    end
end)
