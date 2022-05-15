local function DisplayWelcomeBooklet(newState)
    if newState then
        SendNUIMessage({action = "show"})
        SetNuiFocus(true, true)
    else
        SendNUIMessage({action = "hide"})
        SetNuiFocus(false, false)
    end
end

function WelcomeEntry(menu)
    menu:AddButton({
        label = "Guide de bienvenue",
        description = "Bienvenue à Los Santos !",
        select = function()
            DisplayWelcomeBooklet(true)
            menu:Close()
        end,
    })
end

RegisterNUICallback("welcome-hide", function()
    DisplayWelcomeBooklet(false)
end)
