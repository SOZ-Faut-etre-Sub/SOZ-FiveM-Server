local fadeDelay = 500

--- Fade out to black screen
--- /!\ SHOULD BE EXECUTED WITHIN A THREAD
function ScreenFadeOut()
    DoScreenFadeOut(fadeDelay)
    Citizen.Wait(fadeDelay)
end

--- Fade in, from black screen to game
--- /!\ SHOULD BE EXECUTED WITHIN A THREAD
function ScreenFadeIn()
    DoScreenFadeIn(fadeDelay)
end
