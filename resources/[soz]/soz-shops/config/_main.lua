Config = {}

if IsDuplicityVersion() then
    Config.ComponentList = {}
else
    Config.ComponentList = exports["soz-character"]:GetLabels()
end

Config.Products = {}
Config.Locations = {}
