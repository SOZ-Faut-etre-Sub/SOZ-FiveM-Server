function DiplayInstructorNotification(type_, penalty)
    local subtitle, message, color
    if type_ == "INFO" then
        subtitle = "Information"
        message = penalty
        color = "info"

    elseif type_ == "WARNING" then
        penalty.warning = true
        subtitle = "Avertissement"
        message = penalty.warningMsg
        color = "warning"

    elseif type_ == "FAIL" then
        subtitle = "Fin de l'examen"
        message = penalty.failMsg
        color = "error"
    end

    exports["soz-hud"]:DrawAdvancedNotification("Instructeur auto-école", subtitle, message, "CHAR_BLANK_ENTRY", color, Config.NotificationDelay)
end
