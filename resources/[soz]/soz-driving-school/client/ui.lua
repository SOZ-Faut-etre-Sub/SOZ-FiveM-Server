function DiplayInstructorNotification(type_, penalty)
    local subtitle, message, color
    if type_ == "INFO" then
        subtitle = "Information"
        message = penalty
        color = 170

    elseif type_ == "WARNING" then
        penalty.warning = true
        subtitle = "Avertissement"
        message = penalty.warningMsg
        color = 90

    elseif type_ == "FAIL" then
        subtitle = "Fin de l'examen"
        message = penalty.failMsg
        color = 130
    end

    exports["soz-hud"]:DrawAdvancedNotification("Instructeur auto-école", subtitle, message, "CHAR_BLANK_ENTRY", 1, false, false, color)
end
