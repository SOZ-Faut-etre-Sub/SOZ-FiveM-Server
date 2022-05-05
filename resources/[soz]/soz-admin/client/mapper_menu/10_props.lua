--- @type Menu
local propsMenu = MenuV:InheritMenu(MapperMenu, {subtitle = "Un poteau, une borne, des poubelles !"})

local PropOption = {model = nil, event = nil, setupMode = false, prop = nil, propCoord = vec4(0, 0, 0, 0)}

--- function
local function setupGhostProp()
    if PropOption.prop ~= nil or PropOption.model == nil then
        return
    end

    PropOption.propCoord = vec4(GetOffsetFromEntityInWorldCoords(PlayerPedId(), vec3(0.0, 1.0, -1.0)), 0)
    PropOption.prop = CreateObject(GetHashKey(PropOption.model), PropOption.propCoord, 1, 1, 0)
    FreezeEntityPosition(PropOption.prop, true)
    SetEntityHeading(PropOption.prop, PropOption.propCoord.w)
end

local function selectModel(model)
    if model == nil then
        model = exports["soz-hud"]:Input("Nom du modèle : ", 32)
    end

    if model and model ~= "" then
        PropOption.model = model
        propsMenu:SetSubtitle("Modèle chargé : ~g~" .. model)
    end
end

--- Menu
propsMenu:AddSlider({
    label = "Choisir un modèle",
    value = nil,
    values = {{label = "poubelle", value = "prop_cs_bin_01_skinned"}},
    select = function(_, value)
        selectModel(value)
    end,
})
propsMenu:AddButton({
    label = "Choisir un autre modèle",
    value = nil,
    select = function()
        selectModel()
    end,
})

propsMenu:AddSlider({
    label = "Choisir un évènement",
    description = "Permet de filtrer les objets a afficher",
    value = nil,
    values = {{label = "Tout le temps", value = nil}, {label = "Noël", value = "xmas"}},
    select = function(_, value)
        PropOption.event = value
    end,
})

propsMenu:AddSlider({
    label = "Installation mode",
    value = nil,
    values = {{label = "Activer", value = "installOn"}, {label = "Désactiver", value = "installOff"}},
    select = function(_, value)
        if value == "installOn" then
            PropOption.setupMode = true

            CreateThread(function()
                local delta = 0.01
                setupGhostProp()
                SetEntityAlpha(PropOption.prop, 204, false)

                while PropOption.setupMode do
                    DisableControlAction(0, 27, true)
                    DisableControlAction(0, 36, true)
                    DisableControlAction(0, 207, true)
                    DisableControlAction(0, 208, true)
                    DisableControlAction(0, 261, true)
                    DisableControlAction(0, 262, true)

                    if IsDisabledControlPressed(0, 36) then -- ctrl
                        if IsDisabledControlPressed(0, 27) then -- arrow up
                            PropOption.propCoord = vec4(PropOption.propCoord.x, PropOption.propCoord.y + delta, PropOption.propCoord.z, PropOption.propCoord.w)
                        end
                        if IsControlPressed(0, 173) then -- arrow down
                            PropOption.propCoord = vec4(PropOption.propCoord.x, PropOption.propCoord.y - delta, PropOption.propCoord.z, PropOption.propCoord.w)
                        end
                        if IsControlPressed(0, 174) then -- arrow left
                            PropOption.propCoord = vec4(PropOption.propCoord.x - delta, PropOption.propCoord.y, PropOption.propCoord.z, PropOption.propCoord.w)
                        end
                        if IsControlPressed(0, 175) then -- arrow right
                            PropOption.propCoord = vec4(PropOption.propCoord.x + delta, PropOption.propCoord.y, PropOption.propCoord.z, PropOption.propCoord.w)
                        end

                        if IsDisabledControlPressed(0, 208) then -- arrow right
                            PropOption.propCoord = vec4(PropOption.propCoord.x, PropOption.propCoord.y, PropOption.propCoord.z + delta, PropOption.propCoord.w)
                        end
                        if IsDisabledControlPressed(0, 207) then -- arrow right
                            PropOption.propCoord = vec4(PropOption.propCoord.x, PropOption.propCoord.y, PropOption.propCoord.z - delta, PropOption.propCoord.w)
                        end

                        if IsDisabledControlPressed(0, 261) then -- arrow right
                            PropOption.propCoord = vec4(PropOption.propCoord.x, PropOption.propCoord.y, PropOption.propCoord.z, PropOption.propCoord.w + 1.0)
                        end
                        if IsDisabledControlPressed(0, 262) then -- arrow right
                            PropOption.propCoord = vec4(PropOption.propCoord.x, PropOption.propCoord.y, PropOption.propCoord.z, PropOption.propCoord.w - 1.0)
                        end

                        SetEntityCoords(PropOption.prop, PropOption.propCoord)
                        SetEntityHeading(PropOption.prop, PropOption.propCoord.w)
                    end

                    Wait(0)
                end
            end)
        elseif value == "installOff" then
            PropOption.setupMode = false
            SetEntityAlpha(PropOption.prop, 255, false)
        end
    end,
})

propsMenu:AddButton({
    label = "~r~Annuler~s~ la position de l'objet",
    value = nil,
    select = function()
        if PropOption.prop ~= nil then
            DeleteEntity(PropOption.prop)
        end

        PropOption.setupMode = nil
        PropOption.prop = nil
    end,
})
propsMenu:AddButton({
    label = "~g~Valider~s~ la position de l'objet",
    value = nil,
    select = function()
        if PropOption.prop == nil or PropOption.model == nil then
            return
        end

        TriggerServerEvent("admin:server:addPersistentProp", GetHashKey(PropOption.model), PropOption.event, PropOption.propCoord)
        DeleteEntity(PropOption.prop)

        PropOption.prop = nil
        PropOption.model = nil
    end,
})

--- Add to main menu
MapperMenu:AddButton({icon = "🚏", label = "Gestion des objets", value = propsMenu})
