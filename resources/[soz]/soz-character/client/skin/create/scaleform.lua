Scaleform = {}
local sc = nil

Scaleform.Setup = function(scaleformType)
    local scaleform = RequestScaleformMovie(scaleformType)
    while not HasScaleformMovieLoaded(scaleform) do
        Wait(0)
    end

    -- draw it once to set up layout
    DrawScaleformMovieFullscreen(scaleform, 255, 255, 255, 0, 0)

    BeginScaleformMovieMethod(scaleform, "CLEAR_ALL")
    EndScaleformMovieMethod()

    BeginScaleformMovieMethod(scaleform, "SET_CLEAR_SPACE")
    ScaleformMovieMethodAddParamInt(200)
    EndScaleformMovieMethod()

    BeginScaleformMovieMethod(scaleform, "SET_DATA_SLOT")
    ScaleformMovieMethodAddParamInt(0)
    ScaleformMovieMethodAddParamPlayerNameString(GetControlInstructionalButton(0, 0, true))
    BeginTextCommandScaleformString("STRING")
    AddTextComponentSubstringKeyboardDisplay("Changer de caméra")
    EndTextCommandScaleformString()
    EndScaleformMovieMethod()

    BeginScaleformMovieMethod(scaleform, "DRAW_INSTRUCTIONAL_BUTTONS")
    EndScaleformMovieMethod()

    BeginScaleformMovieMethod(scaleform, "SET_BACKGROUND_COLOUR")
    ScaleformMovieMethodAddParamInt(0)
    ScaleformMovieMethodAddParamInt(0)
    ScaleformMovieMethodAddParamInt(0)
    ScaleformMovieMethodAddParamInt(80)
    EndScaleformMovieMethod()

    return scaleform
end

Scaleform.Display = function()
    if not sc then
        sc = Scaleform.Setup("instructional_buttons")
    end

    DrawScaleformMovieFullscreen(sc, 255, 255, 255, 255, 0)
end
