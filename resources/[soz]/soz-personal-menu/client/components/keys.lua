function KeysEntry(menu)
    menu:AddButton({
        label = "Gestion des clés",
        value = nil,
        select = function()
            menu:Close()
            TriggerEvent("inventory:client:openPlayerKeyInventory", "vehicle")
        end,
    })
end
