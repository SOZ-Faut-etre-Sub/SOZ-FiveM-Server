local globalHUD, cinematicHUD = true, false

local function ApplyHUD()
    TriggerEvent("hud:client:OverrideVisibility", not (cinematicHUD or not globalHUD))
end

function HudToggleEntry(menu)
    local global =
        menu:AddCheckbox({label = "HUD: Global", value = globalHUD, description = "Active/Désactive le HUD"})
    local cinematic = menu:AddCheckbox(
                          {
            label = "HUD: Cinématique",
            value = cinematicHUD,
            description = "Active/Désactive les barres noires",
        }
                      )

    global:On(
        "change", function()
            globalHUD = not globalHUD
            ApplyHUD()
        end
    )

    cinematic:On(
        "change", function()
            cinematicHUD = not cinematicHUD
            ApplyHUD()
        end
    )
end

--- Utility functions
local function drawRct(x, y, width, height, r, g, b, a)
    DrawRect(x + width / 2, y + height / 2, width, height, r, g, b, a)
end

--- Loops
Citizen.CreateThread(
    function()
        while true do

            if cinematicHUD or not globalHUD then
                HideHelpTextThisFrame()
                ThefeedHideThisFrame()
                HideHudAndRadarThisFrame()
                HideHudComponentThisFrame(15) -- 15 : SUBTITLE_TEXT
                HideHudComponentThisFrame(18) -- 18 : GAME_STREAM
            end

            if cinematicHUD then
                drawRct(0.0, 0.0, 1.0, 0.10, 0, 0, 0, 255) -- Top Bar
                drawRct(0.0, 0.90, 1.0, 0.10, 0, 0, 0, 255) -- Bottom Bar
            end

            Wait(0)
        end
    end
)
