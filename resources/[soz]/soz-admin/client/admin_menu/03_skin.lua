local skinMenu, skinComponentMenu
local PlayerComponent, PlayerComponentVariation = {}, {}
local PlayerProp, PlayerPropVariation = {}, {}

--- Functions
local function LoadPlayerModel(skin)
    RequestModel(skin)
    while not HasModelLoaded(skin) do
        Wait(0)
    end
end

local function SetModel(skin)
    local ped = PlayerPedId()
    local model = GetHashKey(skin)
    SetEntityInvincible(ped, true)

    if IsModelInCdimage(model) and IsModelValid(model) then
        LoadPlayerModel(model)
        SetPlayerModel(PlayerId(), model)

        SetPedDefaultComponentVariation(PlayerPedId())

        SetModelAsNoLongerNeeded(model)
    end

    SetEntityInvincible(ped, false)
end

local function CreateRange(from, to)
    local r = {}
    for i = from, to do
        table.insert(r, {label = i, value = i})
    end
    return r
end

local function ApplyPedComponent()
    local ped = PlayerPedId()

    for component, value in pairs(PlayerComponent) do
        SetPedComponentVariation(ped, component, value, PlayerComponentVariation[component] or 0, 2)
    end

    for prop, value in pairs(PlayerProp) do
        SetPedPropIndex(ped, prop, value, PlayerPropVariation[prop] or 0, 2)
    end
end

local function GenerateDrawableList(menu, ped, i)
    PlayerComponent[i] = GetPedDrawableVariation(ped, i)
    PlayerComponentVariation[i] = GetPedTextureVariation(ped, i)

    if GetNumberOfPedDrawableVariations(ped, i) > 0 then
        menu:AddSlider({
            label = Config.ComponentName[i],
            value = PlayerComponent[i] + 1,
            values = CreateRange(0, GetNumberOfPedDrawableVariations(ped, i) - 1),
            change = function(_, value)
                PlayerComponent[i] = value - 1
                ApplyPedComponent()
            end,
        })
        menu:AddSlider({
            label = Config.ComponentName[i] .. " variation",
            value = PlayerComponentVariation[i] + 1,
            values = CreateRange(0, 20),
            change = function(_, value)
                PlayerComponentVariation[i] = value - 1
                ApplyPedComponent()
            end,
        })
    end
end

local function getPlayerSkin()
    local ped = PlayerPedId()
    local skin = {Components = {}, Props = {}}

    for i, _ in pairs(PlayerComponent) do
        skin.Components[i] = {
            Drawable = tonumber(GetPedDrawableVariation(ped, i)),
            Texture = tonumber(GetPedTextureVariation(ped, i)),
            Palette = 0,
        }
    end
    for i, _ in pairs(PlayerProp) do
        skin.Props[i] = {
            Drawable = tonumber(GetPedPropIndex(ped, i)),
            Texture = tonumber(GetPedPropTextureIndex(ped, i)),
            Palette = 0,
        }
    end

    return skin
end

function AdminMenuSkin(menu, permission)
    if skinMenu == nil then
        skinMenu = MenuV:InheritMenu(menu, {subtitle = "Chien, Chat, Président, ..."})
    end
    if skinComponentMenu == nil then
        skinComponentMenu = MenuV:InheritMenu(skinMenu)
    end

    skinMenu:ClearItems()
    skinComponentMenu:ClearItems()

    skinMenu:AddButton({
        label = "Changer l'apparence du personnage",
        value = nil,
        select = function()
            local model = exports["soz-hud"]:Input("Modèle de personnage :", 32)

            if model and model ~= "" then
                SetModel(model)
            end
        end,
    })

    skinMenu:AddSlider({
        label = "Liste d'apparence prédéfini",
        value = "model",
        values = {
            {label = "Chien", value = "a_c_shepherd"},
            {label = "Chat", value = "a_c_cat_01"},
            {label = "Civil Femme", value = "u_f_y_mistress"},
            {label = "Civil Homme", value = "a_m_y_latino_01"},
            {label = "Joueur Femme", value = "mp_f_freemode_01"},
            {label = "Joueur Homme", value = "mp_m_freemode_01"},
        },
        select = function(_, model)
            SetModel(model)
        end,
    })

    skinMenu:AddButton({label = "Modifier les éléments du personnage", value = skinComponentMenu})

    skinComponentMenu:On("open", function(m)
        local ped = PlayerPedId()
        m:ClearItems()

        m:AddTitle({label = "Éléments du personnage"})
        for _, i in pairs({3, 4, 6, 8, 11}) do
            GenerateDrawableList(m, ped, i)
        end

        m:AddTitle({label = "Accessoires du personnage"})
        for _, i in pairs({0, 1, 2, 6, 7}) do
            PlayerProp[i] = GetPedPropIndex(ped, i)
            PlayerPropVariation[i] = GetPedPropTextureIndex(ped, i)

            if GetNumberOfPedPropDrawableVariations(ped, i) > 0 then
                m:AddSlider({
                    label = Config.PropName[i],
                    value = PlayerProp[i] + 1,
                    values = CreateRange(0, GetNumberOfPedPropDrawableVariations(ped, i) - 1),
                    change = function(_, value)
                        PlayerProp[i] = value - 1
                        ApplyPedComponent()
                    end,
                })
                m:AddSlider({
                    label = Config.PropName[i] .. " variation",
                    value = PlayerPropVariation[i] + 1,
                    values = CreateRange(0, 20),
                    change = function(_, value)
                        PlayerPropVariation[i] = value - 1
                        ApplyPedComponent()
                    end,
                })
            end
        end

        m:AddTitle({label = "Autres"})
        for _, i in pairs({0, 1, 2, 5, 7, 9, 10}) do
            GenerateDrawableList(m, ped, i)
        end

        m:AddTitle({label = "Actions"})
        m:AddButton({
            label = "Copier la tenue dans le presse papier",
            value = nil,
            select = function()
                SendNUIMessage({string = json.encode(getPlayerSkin())})
            end,
        })
        m:AddButton({
            label = "Sauvegarder cette tenue",
            value = nil,
            select = function()
                TriggerServerEvent("admin:skin:UpdateClothes", getPlayerSkin())
            end,
        })
    end)

    skinComponentMenu:On("close", function(m)
        m:ClearItems()
    end)

    --- Add to main menu
    menu:AddButton({
        icon = "🐕",
        label = "Modification du style du joueur",
        value = skinMenu,
        disabled = permission ~= "admin",
    })
end
