local societyMenu = MenuV:CreateMenu(nil, "", "menu_job_upw", "soz", "upw:menu")
local societyMenuState = {
    ["displayInverter"] = false,
    ["displayJobTerminal"] = false,
    ["displayGlobalTerminal"] = false,
    ["displayPlant"] = false,
    ["displayResell"] = false,
}

local function SetBlipVisibility(type, visible, entreprise)
    local facilities = QBCore.Functions.TriggerRpc("soz-upw:server:GetFacilitiesFromDb", {type})

    for _, facility in ipairs(facilities) do
        local data = json.decode(facility.data)
        local blip_id = ("job_upw_%s"):format(facility.identifier)

        if type ~= "terminal" then
            QBCore.Functions.HideBlip(blip_id, not visible)
        end

        if type == "terminal" and entreprise and data.scope == "entreprise" then
            QBCore.Functions.HideBlip(blip_id, not visible)
        end

        if type == "terminal" and not entreprise and data.scope ~= "entreprise" then
            QBCore.Functions.HideBlip(blip_id, not visible)
        end
    end

    if type == "resell" then
        QBCore.Functions.HideBlip("job_upw_resell", not visible)
    end
end

RegisterNetEvent("jobs:client:upw:OpenSocietyMenu", function()
    if societyMenu.IsOpen then
        societyMenu:Close()
        return
    end

    societyMenu:ClearItems()

    if OnDuty() then
        societyMenu:AddCheckbox({
            label = "Afficher les Onduleurs",
            value = societyMenuState.displayInverter,
            change = function(_, value)
                societyMenuState.displayInverter = value
                SetBlipVisibility("inverter", value)
            end,
        })
        societyMenu:AddCheckbox({
            label = "Afficher les Bornes entreprises",
            value = societyMenuState.displayJobTerminal,
            change = function(_, value)
                societyMenuState.displayJobTerminal = value
                SetBlipVisibility("terminal", value, true)
            end,
        })
        societyMenu:AddCheckbox({
            label = "Afficher les Bornes civiles",
            value = societyMenuState.displayGlobalTerminal,
            change = function(_, value)
                societyMenuState.displayGlobalTerminal = value
                SetBlipVisibility("terminal", value, false)
            end,
        })
        societyMenu:AddCheckbox({
            label = "Afficher les Installations électriques",
            value = societyMenuState.displayPlant,
            change = function(_, value)
                societyMenuState.displayPlant = value
                SetBlipVisibility("plant", value, false)
            end,
        })
        societyMenu:AddCheckbox({
            label = "Afficher le Stockage de revente",
            value = societyMenuState.displayResell,
            change = function(_, value)
                societyMenuState.displayResell = value
                SetBlipVisibility("resell", value)
            end,
        })
    else
        societyMenu:AddButton({label = "Tu n'es pas en service !", disabled = true})
    end

    if societyMenu.IsOpen then
        MenuV:CloseAll(function()
            societyMenu:Close()
        end)
    else
        MenuV:CloseAll(function()
            societyMenu:Open()
        end)
    end
end)
