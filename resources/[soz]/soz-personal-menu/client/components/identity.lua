local identitySubmenu
local selectedCheckbox = nil
local isShowingAround = false
local showingTo = {}

local function UpdateIdentityMenu(identitySubmenu, checkbox, showingAround)
    if identitySubmenu and identitySubmenu.IsOpen then
        identitySubmenu:Close()
        identitySubmenu:ClearItems()
        GenerateIdentityMenu(identitySubmenu, checkbox, showingAround)
        identitySubmenu:Open()
    end
end

function GenerateIdentityMenu(identitySubmenu, selectedCheckbox, showingAround)
    local actions = {["see"] = "Voir", ["show"] = "Montrer"}
    local checkboxes = {
        ["identity"] = {label = "carte d'identité", event = "soz-identity:client:request-identity-data"},
        ["licenses"] = {label = "permis", event = "soz-identity:client:request-licenses-data"},
        ["health_book"] = {label = "carte de santé", event = "soz-core:client:player:health:request-health-book"},
    }

    local description = nil
    local hideLabel = "Masquer les papiers"
    if showingAround then
        description = "Vous montrez vos papiers aux personnes alentours"
        hideLabel = "Arrêter de montrer vos papiers"
    end

    for scope, checkbox in pairs(checkboxes) do
        for action, actionLabel in pairs(actions) do
            local box = identitySubmenu:AddCheckbox({
                label = string.format("%s %s", actionLabel, checkbox.label),
                description = description,
                value = scope == selectedCheckbox and action == "show",
            })

            box:On("change", function(_, checked)
                -- SEE & SHOW
                if checked then
                    selectedCheckbox = scope

                    if action == "see" then
                        TriggerEvent(checkbox.event, QBCore.Functions.GetPlayerData().source, action)

                    elseif action == "show" then
                        local coords = GetEntityCoords(PlayerPedId())
                        local closePlayers = QBCore.Functions.GetPlayersFromCoords(coords, 3.0)

                        if type(closePlayers) == "table" and #closePlayers > 1 then
                            UpdateIdentityMenu(identitySubmenu, selectedCheckbox, true)
                            for _, player in ipairs(closePlayers) do
                                if player ~= PlayerId() then
                                    local pid = GetPlayerServerId(player)
                                    table.insert(showingTo, pid)
                                    TriggerEvent(checkbox.event, pid, action)
                                else
                                    TriggerEvent("soz-identity:client:give-animation")
                                end
                            end

                        else
                            exports["soz-hud"]:DrawNotification("Il n'y a personne à proximité", "error", 3000)
                            selectedCheckbox = nil
                            UpdateIdentityMenu(identitySubmenu, selectedCheckbox, isShowingAround)
                            return
                        end
                    end

                    -- HIDE
                else
                    HideUI(identitySubmenu)
                end

            end)
        end
    end

    --- HIDE BUTTON
    identitySubmenu:AddButton({
        label = hideLabel,
        description = description,
        value = "hide",
        select = function()
            HideUI(identitySubmenu)
        end,
    })
end

function HideUI(identitySubmenu)
    TriggerEvent("soz-identity:client:hide")
    selectedCheckbox = nil
    if showingAround then
        TriggerServerEvent("soz-identity:server:hide-around", showingTo)
        isShowingAround = false
        showingTo = {}
    end
    UpdateIdentityMenu(identitySubmenu, selectedCheckbox, isShowingAround)
end

function IdentityEntry(menu)
    identitySubmenu = MenuV:InheritMenu(menu, {subtitle = "Gestion de l'identité"})

    menu:AddButton({
        label = "Mon identité",
        value = identitySubmenu,
        description = "Voir/Montrer vos papiers d'identité",
    })

    GenerateIdentityMenu(identitySubmenu, isShowingAround)
end

AddEventHandler("soz-personal-menu:client:identity:resetMenu", function()
    UpdateIdentityMenu(identitySubmenu, nil, false)
end)
