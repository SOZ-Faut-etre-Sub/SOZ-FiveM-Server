function VoipEntry(menu)
    menu:AddButton({
        label = "Redémarrer la voip",
        value = nil,
        select = function()
            menu:Close()
            TriggerEvent("voip:client:reset")
        end,
    })
end
