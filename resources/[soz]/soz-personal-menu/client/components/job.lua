function JobEntry(menu)
    local SozJobCore = exports['soz-jobs']:GetCoreObject()
    local job = SozJobCore.Jobs[PlayerData.job.id]

    if not job then
        return
    end

    local jobMenu = MenuV:InheritMenu(menu, {subtitle = "Gestion entreprise"})
    menu:AddButton({label = "Gestion entreprise", value = invoiceMenu, description = "Gérer votre entreprise"})
end
