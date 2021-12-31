
local function Input(title, maxChar, content)
    AddTextEntry("FMMC_MPM_NA", title or "")
    DisplayOnscreenKeyboard(1, "FMMC_MPM_NA", "", content or "", "", "", "", maxChar or 32)
    while (UpdateOnscreenKeyboard() == 0) do
        DisableAllControlActions(0)
        Wait(0)
    end
    if (GetOnscreenKeyboardResult()) then
        return GetOnscreenKeyboardResult()
    end
end

exports('Input', function(title, maxChar, content)
    return Input(title, maxChar, content)
end)
