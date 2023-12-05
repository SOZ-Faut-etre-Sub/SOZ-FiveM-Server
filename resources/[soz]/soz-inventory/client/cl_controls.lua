local disableKeys

local DisableControlAction = DisableControlAction
local Wait = Wait
local CreateThread = CreateThread

CreateThread(function()
    while true do
        if disableKeys then
            Wait(0)
            DisableControlAction(2, 59) -- Left / Right
            DisableControlAction(0, 76, true) -- Vehicle Handbrake
            DisableControlAction(0, 71, true) -- Vehicle Acceleration
            DisableControlAction(0, 72, true) -- Vehicle Brakes
        else
            Wait(100)
        end
    end
end)

function inventoryDisableControlsActions(bool)
    disableKeys = bool
end
