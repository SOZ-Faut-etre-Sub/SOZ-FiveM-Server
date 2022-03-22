local function OpenSocietyMenu()
    if not SozJobCore.Jobs[PlayerData.job.id] then
        return
    end

    if not SozJobCore.Jobs[PlayerData.job.id].menuCallback then
        return
    end

    TriggerEvent(SozJobCore.Jobs[PlayerData.job.id].menuCallback)
end

RegisterKeyMapping("society-menu", "Ouvrir le menu entreprise", "keyboard", "F3")
RegisterCommand("society-menu", OpenSocietyMenu, false)
