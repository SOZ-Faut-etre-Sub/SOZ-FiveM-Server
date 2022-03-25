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
