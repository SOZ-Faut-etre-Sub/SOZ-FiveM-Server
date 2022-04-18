RegisterNetEvent("police:client:OpenCloakroomMenu", function()
    PoliceJob.Functions.Menu.GenerateMenu(PlayerData.job.id, function(menu)
        menu:AddButton({
            label = "Tenue civile",
            value = nil,
            select = function()
                TriggerEvent("soz-character:Client:ApplyCurrentClothConfig")
            end,
        })

        for name, skin in pairs(Config.Cloakroom[PlayerData.job.id][PlayerData.skin.Model.Hash]) do
            menu:AddButton({
                label = name,
                value = nil,
                select = function()
                    TriggerEvent("soz-character:Client:ApplyTemporaryClothSet", skin)
                end,
            })
        end
    end)
end)

RegisterNetEvent("police:client:SetPrisonerClothes", function()
    local playerPed = PlayerPedId()
    local playerPedModel = GetEntityModel(playerPed)

    if not LocalPlayer.state.havePrisonerClothes then
        TriggerEvent("soz-character:Client:ApplyTemporaryClothSet", Config.PrisonerClothes[playerPedModel])
        LocalPlayer.state:set("havePrisonerClothes", true, true)
    else
        TriggerEvent("soz-character:Client:ApplyCurrentClothConfig")
        LocalPlayer.state:set("havePrisonerClothes", false, true)
    end
end)
