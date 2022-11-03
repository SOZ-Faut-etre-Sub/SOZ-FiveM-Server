local function OpenSocietyMenu()
    if not SozJobCore.Jobs[PlayerData.job.id] then
        return
    end

    local event = 'soz-core:client:job:open-menu'

    if SozJobCore.Jobs[PlayerData.job.id].menuCallback then
        event = SozJobCore.Jobs[PlayerData.job.id].menuCallback
    end

    if PlayerData.metadata["isdead"] then
        return
    end

    TriggerEvent(event, PlayerData.job.id)
end

RegisterKeyMapping("society-menu", "Ouvrir le menu entreprise", "keyboard", "F3")
RegisterCommand("society-menu", OpenSocietyMenu, false)
