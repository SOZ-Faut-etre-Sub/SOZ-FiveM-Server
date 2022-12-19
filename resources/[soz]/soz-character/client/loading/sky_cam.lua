local UnzoomSkyCam = nil
local ZoomSkyCam = nil

function StartUnzoomSkyCam()
    SetCloudHatOpacity(0.0)
    SetWeatherTypePersist("CLEAR")
    SetWeatherTypeNowPersist("CLEAR")
    SetWeatherTypeNow("CLEAR")
    SetOverrideWeather("CLEAR")
    UnzoomSkyCam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", -421.0049, 1155.414, 324.8574 + 500, -85.00, 0.00, 260.00, 100.00, false, 0)
    SetCamActive(UnzoomSkyCam, true)
    SetFocusArea(-421.0049, 1155.414, 324.8574 + 10, 50, 0.0, 0.0)
    ShakeCam(UnzoomSkyCam, "HAND_SHAKE", 0.15)
    SetEntityVisible(PlayerPedId(), false)
    RenderScriptCams(true, false, 3000, 1, 1)

    SetFocusArea(-265.51, -811.01, 31.85 + 175, 0.0, 0.0, 0.0)
    SetCamParams(UnzoomSkyCam, -400.00, 1700.00, 31.85 + 3000, -85.00, 0.00, 260.00, 100.0, 4500, 0, 0, 2)
    SetEntityCoords(PlayerPedId(), -421.0049, 1155.414, 324.8574 - 0.9, 0, 0, 0, false)
    SetEntityHeading(PlayerPedId(), 80)
    FreezeEntityPosition(PlayerPedId(), true)
    Citizen.Wait(4500)
end

function StopUnzoomSkyCam()
    if DoesCamExist(UnzoomSkyCam) then
        RenderScriptCams(false, true, 500, true, true)
        SetCamActive(UnzoomSkyCam, false)
        DestroyCam(UnzoomSkyCam, true)
        ClearFocus()

        UnzoomSkyCam = nil
    end
end

function StartZoomSkyCam()
    ZoomSkyCam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", -400.00, 1700.00, 31.85 + 3000, -85.00, 0.00, 260.00, 100.00, false, 0)
    SetCamActive(ZoomSkyCam, true)
    SetFocusArea(-265.51, -811.01, 31.85 + 175, 0.0, 0.0, 0.0)
    ShakeCam(ZoomSkyCam, "HAND_SHAKE", 0.15)
    SetEntityVisible(PlayerPedId(), false)
    RenderScriptCams(true, false, 3000, 1, 1)
end

function StopZoomSkyCam()
    if DoesCamExist(ZoomSkyCam) then
        RenderScriptCams(false, true, 4500, true, true)
        local waiting = true
        Citizen.CreateThread(function()
            while waiting do
                DisableControlAction(0, 1, true)
                DisableControlAction(0, 2, true)
                Citizen.Wait(0)
            end
        end)
        Citizen.Wait(4500)
        SetCamActive(ZoomSkyCam, false)
        DestroyCam(ZoomSkyCam, true)
        ClearFocus()
        waiting = false
        ZoomSkyCam = nil
    end
end

function ClearScreen()
    SetCloudHatOpacity(0.01)
    HideHudAndRadarThisFrame()
    ClearCloudHat()
    ClearOverrideWeather()
end
