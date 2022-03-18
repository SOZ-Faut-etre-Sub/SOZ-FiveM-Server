local createCharacterMenu = MenuV:CreateMenu(nil, "", "menu_job_lspd", "soz", "create-character")

local function OpenCreateCharacterMenu(skin)
    local p = promise.new()
    createCharacterMenu:ClearItems()

    local playerId = PlayerId()
    local modelMenu = CreateModelMenu(createCharacterMenu, playerId, skin)
    local bodyMenu = CreateBodyMenu(createCharacterMenu, playerId, skin)
    local hairMenu = CreateHairMenu(createCharacterMenu, playerId, skin)
    local makeupMenu = CreateMakeupMenu(createCharacterMenu, playerId, skin)
    local clothMenu = CreateClothMenu(createCharacterMenu, playerId, skin)

    createCharacterMenu:AddButton({label = "Identité", value = modelMenu})
    createCharacterMenu:AddButton({label = "Physique", value = bodyMenu})
    createCharacterMenu:AddButton({label = "Coiffure", value = hairMenu})
    createCharacterMenu:AddButton({label = "Maquillage", value = makeupMenu})
    createCharacterMenu:AddButton({label = "Vêtements", value = clothMenu})

    createCharacterMenu:Open()
    createCharacterMenu:On("close", function()
        p:resolve(skin)
    end)

    return Citizen.Await(p)
end

function CreateCharacter()
    local skin = GetDefaultBodySkin()
    local confirm = false
    ApplyPlayerBodySkin(PlayerId(), skin)

    while not confirm do
        Camera.Activate()
        skin = OpenCreateCharacterMenu(skin);
        Camera.Deactivate()

        local confirmWord = exports["soz-hud"]:Input("Entrer 'OUI' pour confirmer le skin de ce personnage", 32)

        if confirmWord == "OUI" then
            confirm = true
        end
    end
end
