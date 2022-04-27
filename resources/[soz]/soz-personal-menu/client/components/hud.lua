local globalHUD, cinematicHUD, cinematicCam = true, false, false

--- Utility functions
local function drawRct(x, y, width, height, r, g, b, a)
    DrawRect(x + width / 2, y + height / 2, width, height, r, g, b, a)
end

local function CreateThread()
    TriggerEvent("hud:client:OverrideVisibility", globalHUD and not cinematicHUD)
    Citizen.CreateThread(function()
        while cinematicHUD or not globalHUD or cinematicCam do

            if not globalHUD then
                HideHelpTextThisFrame()
                HideHudAndRadarThisFrame()
                HideHudComponentThisFrame(15) -- 15 : SUBTITLE_TEXT
                HideHudComponentThisFrame(18) -- 18 : GAME_STREAM
            end

            if cinematicHUD then
                drawRct(0.0, 0.0, 1.0, 0.10, 0, 0, 0, 255) -- Top Bar
                drawRct(0.0, 0.90, 1.0, 0.10, 0, 0, 0, 255) -- Bottom Bar
            end

            if cinematicCam then
                ForceCinematicRenderingThisUpdate(true)
            end

            Wait(0)
        end
    end)
end

function HudToggleEntry(menu)
    menu:AddCheckbox({
        label = "HUD: Global",
        value = globalHUD,
        description = "Active/Désactive le HUD",
        change = function()
            globalHUD = not globalHUD
            CreateThread()
        end,
    })
    menu:AddCheckbox({
        label = "HUD: Cinématique",
        value = cinematicHUD,
        description = "Active/Désactive les barres noires",
        change = function()
            cinematicHUD = not cinematicHUD
            CreateThread()
        end,
    })
    menu:AddCheckbox({
        label = "Caméra: Cinématique",
        value = cinematicCam,
        description = "Active/Désactive la caméra cinématique",
        change = function()
            cinematicCam = not cinematicCam
            CreateThread()
        end,
    })
end
