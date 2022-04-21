local skinMenu = MenuV:InheritMenu(AdminMenu, {subtitle = "Chien, Chat, Président, ..."})
local skinComponentMenu = MenuV:InheritMenu(skinMenu)

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
            value = 0,
            values = CreateRange(0, 20),
            change = function(_, value)
                PlayerComponentVariation[i] = value - 1
                ApplyPedComponent()
            end,
        })
    end
end

--- Menu entries
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

skinComponentMenu:On("open", function(menu)
    local ped = PlayerPedId()
    menu:ClearItems()

    menu:AddTitle({label = "Éléments du personnage"})
    for _, i in pairs({3, 4, 6, 8, 11}) do
        GenerateDrawableList(menu, ped, i)
    end

    menu:AddTitle({label = "Accessoires du personnage"})
    for _, i in pairs({0, 1, 2, 6, 7}) do
        PlayerProp[i] = GetPedPropIndex(ped, i)
        PlayerPropVariation[i] = GetPedPropTextureIndex(ped, i)

        if GetNumberOfPedPropDrawableVariations(ped, i) > 0 then
            menu:AddSlider({
                label = Config.PropName[i],
                value = PlayerProp[i] + 1,
                values = CreateRange(0, GetNumberOfPedPropDrawableVariations(ped, i) - 1),
                change = function(_, value)
                    PlayerProp[i] = value - 1
                    ApplyPedComponent()
                end,
            })
            menu:AddSlider({
                label = Config.PropName[i] .. " variation",
                value = 0,
                values = CreateRange(0, 20),
                change = function(_, value)
                    PlayerPropVariation[i] = value - 1
                    ApplyPedComponent()
                end,
            })
        end
    end

    menu:AddTitle({label = "Autres"})
    for _, i in pairs({0, 1, 2, 5, 7, 9, 10}) do
        GenerateDrawableList(menu, ped, i)
    end

    menu:AddTitle({label = "Actions"})
    menu:AddButton({
        label = "Copier la tenue dans le presse papier",
        value = nil,
        select = function()
            local skin = {Components = {}, Props = {}}

            for i, v in pairs(PlayerComponent) do
                skin.Components[i] = {Drawable = v, Texture = PlayerComponentVariation[i] or 0, Palette = 0}
            end
            for i, v in pairs(PlayerProp) do
                skin.Props[i] = {Drawable = v, Texture = PlayerPropVariation[i] or 0, Palette = 0}
            end

            SendNUIMessage({string = json.encode(skin)})
        end,
    })
end)

--- Add to main menu
AdminMenu:AddButton({icon = "🐕", label = "Modification du style du joueur", value = skinMenu})
