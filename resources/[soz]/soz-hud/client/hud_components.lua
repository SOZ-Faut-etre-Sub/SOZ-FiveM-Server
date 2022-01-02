CreateThread(function()
    -- https://docs.fivem.net/natives/?_0x6806C51AD12B83B8
    while true do
        HideHudComponentThisFrame(1)  -- 1 : WANTED_STARS
        HideHudComponentThisFrame(2)  -- 2 : WEAPON_ICON
        HideHudComponentThisFrame(3)  -- 3 : CASH
        HideHudComponentThisFrame(4)  -- 4 : MP_CASH
        HideHudComponentThisFrame(6)  -- 6 : VEHICLE_NAME
        HideHudComponentThisFrame(7)  -- 7 : AREA_NAME
        HideHudComponentThisFrame(8)  -- 8 : VEHICLE_CLASS
        HideHudComponentThisFrame(9)  -- 9 : STREET_NAME
        HideHudComponentThisFrame(13) -- 13 : CASH_CHANGE
        HideHudComponentThisFrame(17) -- 17 : SAVING_GAME
        HideHudComponentThisFrame(19) -- 19 : WEAPON_WHEEL
        HideHudComponentThisFrame(20) -- 20 : WEAPON_WHEEL_STATS
        HideHudComponentThisFrame(21) -- 21 : HUD_COMPONENTS
        HideHudComponentThisFrame(22) -- 22 : HUD_WEAPONS

        DisableControlAction(1, 37)

        Wait(4)
    end
end)