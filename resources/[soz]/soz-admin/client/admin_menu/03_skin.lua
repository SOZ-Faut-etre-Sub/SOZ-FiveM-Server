local skinMenu = MenuV:InheritMenu(AdminMenu, {subtitle = "Chien, Chat, Président, ..."})
local skinComponentMenu = MenuV:InheritMenu(skinMenu)

local PlayerComponent = {}

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
        SetPedRandomComponentVariation(ped, true)
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

    for i = 0, 11 do
        SetPedComponentVariation(ped, i, PlayerComponent[i], 0, 2)
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
        {label = "Chat", value = "a_c_cat_01"},
        {label = "Chien", value = "a_c_shepherd"},
        {label = "Civil Femme", value = "u_f_y_mistress"},
        {label = "Civil Homme", value = "a_m_y_latino_01"},
    },
    select = function(_, model)
        SetModel(model)
    end,
})

skinMenu:AddButton({label = "Modifier les éléments du personnage", value = skinComponentMenu})

skinComponentMenu:On("open", function(menu)
    local ped = PlayerPedId()
    menu:ClearItems()

    for i = 0, 11 do
        PlayerComponent[i] = GetPedDrawableVariation(ped, i)

        if GetNumberOfPedDrawableVariations(ped, i) > 0 then
            menu:AddSlider({
                label = Config.ComponentName[i],
                value = PlayerComponent[i],
                values = CreateRange(0, GetNumberOfPedDrawableVariations(ped, i) - 1),
                change = function(_, value)
                    PlayerComponent[i] = value - 1
                    ApplyPedComponent()
                end,
            })
        end
    end
end)

--- Add to main menu
AdminMenu:AddButton({icon = "🐕", label = "Modification du style du joueur", value = skinMenu})
