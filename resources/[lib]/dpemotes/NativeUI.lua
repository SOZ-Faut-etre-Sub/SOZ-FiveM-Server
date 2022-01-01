UIResRectangle = setmetatable({}, UIResRectangle)
UIResRectangle.__index = UIResRectangle
UIResRectangle.__call = function() return "Rectangle" end

UIResText = setmetatable({}, UIResText)
UIResText.__index = UIResText
UIResText.__call = function() return "Text" end

Sprite = setmetatable({}, Sprite)
Sprite.__index = Sprite
Sprite.__call = function() return "Sprite" end

UIMenuItem = setmetatable({}, UIMenuItem)
UIMenuItem.__index = UIMenuItem
UIMenuItem.__call = function() return "UIMenuItem", "UIMenuItem" end

UIMenuCheckboxItem = setmetatable({}, UIMenuCheckboxItem)
UIMenuCheckboxItem.__index = UIMenuCheckboxItem
UIMenuCheckboxItem.__call = function() return "UIMenuItem", "UIMenuCheckboxItem" end

UIMenuListItem = setmetatable({}, UIMenuListItem)
UIMenuListItem.__index = UIMenuListItem
UIMenuListItem.__call = function() return "UIMenuItem", "UIMenuListItem" end

UIMenuSliderItem = setmetatable({}, UIMenuSliderItem)
UIMenuSliderItem.__index = UIMenuSliderItem
UIMenuSliderItem.__call = function() return "UIMenuItem", "UIMenuSliderItem" end

UIMenuColouredItem = setmetatable({}, UIMenuColouredItem)
UIMenuColouredItem.__index = UIMenuColouredItem
UIMenuColouredItem.__call = function() return "UIMenuItem", "UIMenuColouredItem" end

UIMenuProgressItem = setmetatable({}, UIMenuProgressItem)
UIMenuProgressItem.__index = UIMenuProgressItem
UIMenuProgressItem.__call = function() return "UIMenuItem", "UIMenuProgressItem" end

UIMenuHeritageWindow = setmetatable({}, UIMenuHeritageWindow)
UIMenuHeritageWindow.__index = UIMenuHeritageWindow
UIMenuHeritageWindow.__call = function() return "UIMenuWindow", "UIMenuHeritageWindow" end

UIMenuGridPanel = setmetatable({}, UIMenuGridPanel)
UIMenuGridPanel.__index = UIMenuGridPanel
UIMenuGridPanel.__call = function() return "UIMenuPanel", "UIMenuGridPanel" end

UIMenuColourPanel = setmetatable({}, UIMenuColourPanel)
UIMenuColourPanel.__index = UIMenuColourPanel
UIMenuColourPanel.__call = function() return "UIMenuPanel", "UIMenuColourPanel" end

UIMenuPercentagePanel = setmetatable({}, UIMenuPercentagePanel)
UIMenuPercentagePanel.__index = UIMenuPercentagePanel
UIMenuPercentagePanel.__call = function() return "UIMenuPanel", "UIMenuPercentagePanel" end

UIMenu = setmetatable({}, UIMenu)
UIMenu.__index = UIMenu
UIMenu.__call = function() return "UIMenu" end

MenuPool = setmetatable({}, MenuPool)
MenuPool.__index = MenuPool

NativeUI = {}

CharacterMap = { [' '] = 6, ['!'] = 6, ['"'] = 6, ['#'] = 11,['$'] = 10, ['%'] = 17,['&'] = 13, ['\\'] = 4,['('] = 6, [')'] = 6,['*'] = 7, ['+'] = 10, [','] = 4, ['-'] = 6,  ['.'] = 4,  ['/'] = 7,  ['0'] = 12, ['1'] = 7,  ['2'] = 11, ['3'] = 11, ['4'] = 11, ['5'] = 11, ['6'] = 12, ['7'] = 10, ['8'] = 11, ['9'] = 11, [':'] = 5,  [';'] = 4,  ['<'] = 9,  ['='] = 9,  ['>'] = 9,  ['?'] = 10, ['@'] = 15, ['A'] = 12, ['B'] = 13, ['C'] = 14, ['D'] = 14, ['E'] = 12, ['F'] = 12, ['G'] = 15, ['H'] = 14, ['I'] = 5,  ['J'] = 11, ['K'] = 13, ['L'] = 11, ['M'] = 16, ['N'] = 14, ['O'] = 16, ['P'] = 12, ['Q'] = 15, ['R'] = 13, ['S'] = 12, ['T'] = 11, ['U'] = 13, ['V'] = 12, ['W'] = 18, ['X'] = 11, ['Y'] = 11, ['Z'] = 12, ['['] = 6,  [']'] = 6,  ['^'] = 9,  ['_'] = 18, ['`'] = 8,  ['a'] = 11, ['b'] = 12, ['c'] = 11, ['d'] = 12, ['e'] = 12, ['f'] = 5,  ['g'] = 13, ['h'] = 11, ['i'] = 4,  ['j'] = 4,  ['k'] = 10, ['l'] = 4,  ['m'] = 18, ['n'] = 11, ['o'] = 12, ['p'] = 12, ['q'] = 12, ['r'] = 7,  ['s'] = 9,  ['t'] = 5,  ['u'] = 11, ['v'] = 10, ['w'] = 14, ['x'] = 9,  ['y'] = 10, ['z'] = 9,  ['{'] = 6,  ['|'] = 3,  ['}'] = 6 }

BadgeStyle = { None = 0, BronzeMedal = 1, GoldMedal = 2, SilverMedal = 3, Alert = 4, Crown = 5, Ammo = 6, Armour = 7, Barber = 8, Clothes = 9, Franklin = 10, Bike = 11, Car = 12, Gun = 13, Heart = 14, Makeup = 15, Mask = 16, Michael = 17, Star = 18, Tattoo = 19, Trevor = 20, Lock = 21, Tick = 22 }

BadgeTexture = {
    [0] = function() return "" end,
    [1] = function() return "mp_medal_bronze" end,
    [2] = function() return "mp_medal_gold" end,
    [3] = function() return "medal_silver" end,
    [4] = function() return "mp_alerttriangle" end,
    [5] = function() return "mp_hostcrown" end,
    [6] = function(Selected) if Selected then return "shop_ammo_icon_b" else return "shop_ammo_icon_a" end end,
    [7] = function(Selected) if Selected then return "shop_armour_icon_b" else return "shop_armour_icon_a" end end,
    [8] = function(Selected) if Selected then return "shop_barber_icon_b" else return "shop_barber_icon_a"  end end,
    [9] = function(Selected) if Selected then return "shop_clothing_icon_b" else return "shop_clothing_icon_a" end end,
    [10] = function(Selected) if Selected then return "shop_franklin_icon_b" else return "shop_franklin_icon_a" end end,
    [11] = function(Selected) if Selected then return "shop_garage_bike_icon_b" else return "shop_garage_bike_icon_a" end end,
    [12] = function(Selected) if Selected then return "shop_garage_icon_b" else return "shop_garage_icon_a" end end,
    [13] = function(Selected) if Selected then return "shop_gunclub_icon_b" else return "shop_gunclub_icon_a" end end,
    [14] = function(Selected) if Selected then return "shop_health_icon_b" else return "shop_health_icon_a" end end,
    [15] = function(Selected) if Selected then return "shop_makeup_icon_b" else return "shop_makeup_icon_a" end end,
    [16] = function(Selected) if Selected then return "shop_mask_icon_b" else return "shop_mask_icon_a" end end,
    [17] = function(Selected) if Selected then return "shop_michael_icon_b" else return "shop_michael_icon_a" end end,
    [18] = function() return "shop_new_star" end,
    [19] = function(Selected) if Selected then return "shop_tattoos_icon_b" else return "shop_tattoos_icon_a" end end,
    [20] = function(Selected) if Selected then return "shop_trevor_icon_b" else return "shop_trevor_icon_a" end end,
    [21] = function() return "shop_lock" end,
    [22] = function() return "shop_tick_icon" end,
}

BadgeDictionary = {
    [0] = function(Selected)
        if Selected then
            return "commonmenu"
        else
            return "commonmenu"
        end
    end,
}

BadgeColour = {
    [5] = function(Selected) if Selected then return 0, 0, 0, 255 else return 255, 255, 255, 255 end end,
    [21] = function(Selected) if Selected then return 0, 0, 0, 255 else return 255, 255, 255, 255 end end,
    [22] = function(Selected) if Selected then return 0, 0, 0, 255 else return 255, 255, 255, 255   end end,
}

Colours = {
    PureWhite = {255, 255, 255, 255},
    White = {240, 240, 240, 255},
    Black = {0, 0, 0, 255},
    Grey = {155, 155, 155, 255},
    GreyLight = {205, 205, 205, 255},
    GreyDark = {77, 77, 77, 255},
    Red = {224, 50, 50, 255},
    RedLight = {240, 153, 153, 255},
    RedDark = {112, 25, 25, 255},
    Blue = {93, 182, 229, 255},
    BlueLight = {174, 219, 242, 255},
    BlueDark = {47, 92, 115, 255},
    Yellow = {240, 200, 80, 255},
    YellowLight = {254, 235, 169, 255},
    YellowDark = {126, 107, 41, 255},
    Orange = {255, 133, 85, 255},
    OrangeLight = {255, 194, 170, 255},
    OrangeDark = {127, 66, 42, 255},
    Green = {114, 204, 114, 255},
    GreenLight = {185, 230, 185, 255},
    GreenDark = {57, 102, 57, 255},
    Purple = {132, 102, 226, 255},
    PurpleLight = {192, 179, 239, 255},
    PurpleDark = {67, 57, 111, 255},
    Pink = {203, 54, 148, 255},
    RadarHealth = {53, 154, 71, 255},
    RadarArmour = {93, 182, 229, 255},
    RadarDamage = {235, 36, 39, 255},
    NetPlayer1 = {194, 80, 80, 255},
    NetPlayer2 = {156, 110, 175, 255},
    NetPlayer3 = {255, 123, 196, 255},
    NetPlayer4 = {247, 159, 123, 255},
    NetPlayer5 = {178, 144, 132, 255},
    NetPlayer6 = {141, 206, 167, 255},
    NetPlayer7 = {113, 169, 175, 255},
    NetPlayer8 = {211, 209, 231, 255},
    NetPlayer9 = {144, 127, 153, 255},
    NetPlayer10 = {106, 196, 191, 255},
    NetPlayer11 = {214, 196, 153, 255},
    NetPlayer12 = {234, 142, 80, 255},
    NetPlayer13 = {152, 203, 234, 255},
    NetPlayer14 = {178, 98, 135, 255},
    NetPlayer15 = {144, 142, 122, 255},
    NetPlayer16 = {166, 117, 94, 255},
    NetPlayer17 = {175, 168, 168, 255},
    NetPlayer18 = {232, 142, 155, 255},
    NetPlayer19 = {187, 214, 91, 255},
    NetPlayer20 = {12, 123, 86, 255},
    NetPlayer21 = {123, 196, 255, 255},
    NetPlayer22 = {171, 60, 230, 255},
    NetPlayer23 = {206, 169, 13, 255},
    NetPlayer24 = {71, 99, 173, 255},
    NetPlayer25 = {42, 166, 185, 255},
    NetPlayer26 = {186, 157, 125, 255},
    NetPlayer27 = {201, 225, 255, 255},
    NetPlayer28 = {240, 240, 150, 255},
    NetPlayer29 = {237, 140, 161, 255},
    NetPlayer30 = {249, 138, 138, 255},
    NetPlayer31 = {252, 239, 166, 255},
    NetPlayer32 = {240, 240, 240, 255},
    SimpleBlipDefault = {159, 201, 166, 255},
    MenuBlue = {140, 140, 140, 255},
    MenuGreyLight = {140, 140, 140, 255},
    MenuBlueExtraDark = {40, 40, 40, 255},
    MenuYellow = {240, 160, 0, 255},
    MenuYellowDark = {240, 160, 0, 255},
    MenuGreen = {240, 160, 0, 255},
    MenuGrey = {140, 140, 140, 255},
    MenuGreyDark = {60, 60, 60, 255},
    MenuHighlight = {30, 30, 30, 255},
    MenuStandard = {140, 140, 140, 255},
    MenuDimmed = {75, 75, 75, 255},
    MenuExtraDimmed = {50, 50, 50, 255},
    BriefTitle = {95, 95, 95, 255},
    MidGreyMp = {100, 100, 100, 255},
    NetPlayer1Dark = {93, 39, 39, 255},
    NetPlayer2Dark = {77, 55, 89, 255},
    NetPlayer3Dark = {124, 62, 99, 255},
    NetPlayer4Dark = {120, 80, 80, 255},
    NetPlayer5Dark = {87, 72, 66, 255},
    NetPlayer6Dark = {74, 103, 83, 255},
    NetPlayer7Dark = {60, 85, 88, 255},
    NetPlayer8Dark = {105, 105, 64, 255},
    NetPlayer9Dark = {72, 63, 76, 255},
    NetPlayer10Dark = {53, 98, 95, 255},
    NetPlayer11Dark = {107, 98, 76, 255},
    NetPlayer12Dark = {117, 71, 40, 255},
    NetPlayer13Dark = {76, 101, 117, 255},
    NetPlayer14Dark = {65, 35, 47, 255},
    NetPlayer15Dark = {72, 71, 61, 255},
    NetPlayer16Dark = {85, 58, 47, 255},
    NetPlayer17Dark = {87, 84, 84, 255},
    NetPlayer18Dark = {116, 71, 77, 255},
    NetPlayer19Dark = {93, 107, 45, 255},
    NetPlayer20Dark = {6, 61, 43, 255},
    NetPlayer21Dark = {61, 98, 127, 255},
    NetPlayer22Dark = {85, 30, 115, 255},
    NetPlayer23Dark = {103, 84, 6, 255},
    NetPlayer24Dark = {35, 49, 86, 255},
    NetPlayer25Dark = {21, 83, 92, 255},
    NetPlayer26Dark = {93, 98, 62, 255},
    NetPlayer27Dark = {100, 112, 127, 255},
    NetPlayer28Dark = {120, 120, 75, 255},
    NetPlayer29Dark = {152, 76, 93, 255},
    NetPlayer30Dark = {124, 69, 69, 255},
    NetPlayer31Dark = {10, 43, 50, 255},
    NetPlayer32Dark = {95, 95, 10, 255},
    Bronze = {180, 130, 97, 255},
    Silver = {150, 153, 161, 255},
    Gold = {214, 181, 99, 255},
    Platinum = {166, 221, 190, 255},
    Gang1 = {29, 100, 153, 255},
    Gang2 = {214, 116, 15, 255},
    Gang3 = {135, 125, 142, 255},
    Gang4 = {229, 119, 185, 255},
    SameCrew = {252, 239, 166, 255},
    Freemode = {45, 110, 185, 255},
    PauseBg = {0, 0, 0, 255},
    Friendly = {93, 182, 229, 255},
    Enemy = {194, 80, 80, 255},
    Location = {240, 200, 80, 255},
    Pickup = {114, 204, 114, 255},
    PauseSingleplayer = {114, 204, 114, 255},
    FreemodeDark = {22, 55, 92, 255},
    InactiveMission = {154, 154, 154, 255},
    Damage = {194, 80, 80, 255},
    PinkLight = {252, 115, 201, 255},
    PmMitemHighlight = {252, 177, 49, 255},
    ScriptVariable = {0, 0, 0, 255},
    Yoga = {109, 247, 204, 255},
    Tennis = {241, 101, 34, 255},
    Golf = {214, 189, 97, 255},
    ShootingRange = {112, 25, 25, 255},
    FlightSchool = {47, 92, 115, 255},
    NorthBlue = {93, 182, 229, 255},
    SocialClub = {234, 153, 28, 255},
    PlatformBlue = {11, 55, 123, 255},
    PlatformGreen = {146, 200, 62, 255},
    PlatformGrey = {234, 153, 28, 255},
    FacebookBlue = {66, 89, 148, 255},
    IngameBg = {0, 0, 0, 255},
    Darts = {114, 204, 114, 255},
    Waypoint = {164, 76, 242, 255},
    Michael = {101, 180, 212, 255},
    Franklin = {171, 237, 171, 255},
    Trevor = {255, 163, 87, 255},
    GolfP1 = {240, 240, 240, 255},
    GolfP2 = {235, 239, 30, 255},
    GolfP3 = {255, 149, 14, 255},
    GolfP4 = {246, 60, 161, 255},
    WaypointLight = {210, 166, 249, 255},
    WaypointDark = {82, 38, 121, 255},
    PanelLight = {0, 0, 0, 255},
    MichaelDark = {72, 103, 116, 255},
    FranklinDark = {85, 118, 85, 255},
    TrevorDark = {127, 81, 43, 255},
    ObjectiveRoute = {240, 200, 80, 255},
    PausemapTint = {0, 0, 0, 255},
    PauseDeselect = {100, 100, 100, 255},
    PmWeaponsPurchasable = {45, 110, 185, 255},
    PmWeaponsLocked = {240, 240, 240, 255},
    ScreenBg = {0, 0, 0, 255},
    Chop = {224, 50, 50, 255},
    PausemapTintHalf = {0, 0, 0, 255},
    NorthBlueOfficial = {0, 71, 133, 255},
    ScriptVariable2 = {0, 0, 0, 255},
    H = {33, 118, 37, 255},
    HDark = {37, 102, 40, 255},
    T = {234, 153, 28, 255},
    TDark = {225, 140, 8, 255},
    HShard = {20, 40, 0, 255},
    ControllerMichael = {48, 255, 255, 255},
    ControllerFranklin = {48, 255, 0, 255},
    ControllerTrevor = {176, 80, 0, 255},
    ControllerChop = {127, 0, 0, 255},
    VideoEditorVideo = {53, 166, 224, 255},
    VideoEditorAudio = {162, 79, 157, 255},
    VideoEditorText = {104, 192, 141, 255},
    HbBlue = {29, 100, 153, 255},
    HbYellow = {234, 153, 28, 255},
    VideoEditorScore = {240, 160, 1, 255},
    VideoEditorAudioFadeout = {59, 34, 57, 255},
    VideoEditorTextFadeout = {41, 68, 53, 255},
    VideoEditorScoreFadeout = {82, 58, 10, 255},
    HeistBackground = {37, 102, 40, 255},
    VideoEditorAmbient = {240, 200, 80, 255},
    VideoEditorAmbientFadeout = {80, 70, 34, 255},
    Gb = {255, 133, 85, 255},
    G = {255, 194, 170, 255},
    B = {255, 133, 85, 255},
    LowFlow = {240, 200, 80, 255},
    LowFlowDark = {126, 107, 41, 255},
    G1 = {247, 159, 123, 255},
    G2 = {226, 134, 187, 255},
    G3 = {239, 238, 151, 255},
    G4 = {113, 169, 175, 255},
    G5 = {160, 140, 193, 255},
    G6 = {141, 206, 167, 255},
    G7 = {181, 214, 234, 255},
    G8 = {178, 144, 132, 255},
    G9 = {0, 132, 114, 255},
    G10 = {216, 85, 117, 255},
    G11 = {30, 100, 152, 255},
    G12 = {43, 181, 117, 255},
    G13 = {233, 141, 79, 255},
    G14 = {137, 210, 215, 255},
    G15 = {134, 125, 141, 255},
    Adversary = {109, 34, 33, 255},
    DegenRed = {255, 0, 0, 255},
    DegenYellow = {255, 255, 0, 255},
    DegenGreen = {0, 255, 0, 255},
    DegenCyan = {0, 255, 255, 255},
    DegenBlue = {0, 0, 255, 255},
    DegenMagenta = {255, 0, 255, 255},
    Stunt1 = {38, 136, 234, 255},
    Stunt2 = {224, 50, 50, 255},
}

--[[
    Utils.lua 
    Utilities
--]]

function GetResolution()
    local W, H = GetActiveScreenResolution()
    if (W/H) > 3.5 then
        return GetScreenResolution()
    else
        return W, H
    end
end

function FormatXWYH(Value, Value2)
    return Value/1920, Value2/1080
end

function math.round(num, numDecimalPlaces)
    return tonumber(string.format("%." .. (numDecimalPlaces or 0) .. "f", num))
end

function tobool(input)
    if input == "true" or tonumber(input) == 1 or input == true then
    return true
    else
    return false
    end
end

function string.split(inputstr, sep)
    if sep == nil then
    sep = "%s"
    end
    local t={} ; i=1
    for str in string.gmatch(inputstr, "([^"..sep.."]+)") do
    t[i] = str
    i = i + 1
    end

    return t
end

function string.starts(String, Start)
    return string.sub(String, 1, string.len(Start)) == Start
end

function IsMouseInBounds(X, Y, Width, Height)
    local MX, MY = math.round(GetControlNormal(0, 239) * 1920), math.round(GetControlNormal(0, 240) * 1080)
    MX, MY = FormatXWYH(MX, MY)
    X, Y = FormatXWYH(X, Y)
    Width, Height = FormatXWYH(Width, Height)
    return (MX >= X and MX <= X + Width) and (MY > Y and MY < Y + Height)
end

function GetSafeZoneBounds()
    local SafeSize = GetSafeZoneSize()
    SafeSize = math.round(SafeSize, 2)
    SafeSize = (SafeSize * 100) - 90
    SafeSize = 10 - SafeSize

    local W, H = 1920, 1080

    return {X = math.round(SafeSize * ((W/H) * 5.4)), Y = math.round(SafeSize * 5.4)}
end

function Controller()
    return not IsInputDisabled(2)
end

--[[    
    UIResRectangle.lua
    Elements
--]]

function UIResRectangle.New(X, Y, Width, Height, R, G, B, A)
    local _UIResRectangle = {
        X = tonumber(X) or 0,
        Y = tonumber(Y) or 0,
        Width = tonumber(Width) or 0,
        Height = tonumber(Height) or 0,
        _Colour = {R = tonumber(R) or 255, G = tonumber(G) or 255, B = tonumber(B) or 255, A = tonumber(A) or 255},
    }
    return setmetatable(_UIResRectangle, UIResRectangle)
end

function UIResRectangle:Position(X, Y)
    if tonumber(X) and tonumber(Y) then
        self.X = tonumber(X)
        self.Y = tonumber(Y)
    else
        return {X = self.X, Y = self.Y}
    end
end

function UIResRectangle:Size(Width, Height)
    if tonumber(Width) and tonumber(Height) then
        self.Width = tonumber(Width)
        self.Height = tonumber(Height)
    else
        return {Width = self.Width, Height = self.Height}
    end
end

function UIResRectangle:Colour(R, G, B, A)
    if tonumber(R) or tonumber(G) or tonumber(B) or tonumber(A) then
        self._Colour.R = tonumber(R) or 255
        self._Colour.B = tonumber(B) or 255
        self._Colour.G = tonumber(G) or 255
        self._Colour.A = tonumber(A) or 255
    else
        return self._Colour
    end
end

function UIResRectangle:Draw()
    local Position = self:Position()
    local Size = self:Size()
    Size.Width, Size.Height = FormatXWYH(Size.Width, Size.Height)
    Position.X, Position.Y = FormatXWYH(Position.X, Position.Y)
    DrawRect(Position.X + Size.Width * 0.5, Position.Y + Size.Height * 0.5, Size.Width, Size.Height, self._Colour.R, self._Colour.G, self._Colour.B, self._Colour.A)
end

function DrawRectangle(X, Y, Width, Height, R, G, B, A)
    X, Y, Width, Height = X or 0, Y or 0, Width or 0, Height or 0
    X, Y = FormatXWYH(X, Y)
    Width, Height = FormatXWYH(Width, Height)
    DrawRect(X + Width * 0.5, Y + Height * 0.5, Width, Height, tonumber(R) or 255, tonumber(G) or 255, tonumber(B) or 255, tonumber(A) or 255)
end

--[[
    UIResText.lua
    Elements
--]]

function GetCharacterCount(str)
    local characters = 0
    for c in str:gmatch("[%z\1-\127\194-\244][\128-\191]*") do
        local a = c:byte(1, -1)
        if a ~= nil then
            characters = characters + 1
        end
    end
    return characters
end

function GetByteCount(str)
    local bytes = 0

    for c in str:gmatch("[%z\1-\127\194-\244][\128-\191]*") do
        local a,b,c,d = c:byte(1, -1)
        if a ~= nil then
            bytes = bytes + 1
        end
        if b ~= nil then
            bytes = bytes + 1
        end
        if c ~= nil then
            bytes = bytes + 1
        end
        if d ~= nil then
            bytes = bytes + 1
        end
    end
    return bytes
end

function AddLongStringForAscii(str)
    local maxbytelength = 99
    for i = 0, GetCharacterCount(str), 99 do
        AddTextComponentSubstringPlayerName(string.sub(str, i, math.min(maxbytelength, GetCharacterCount(str) - i))) --needs changed
    end
end

function AddLongStringForUtf8(str)
    local maxbytelength = 99
    local bytecount = GetByteCount(str)

    if bytecount < maxbytelength then
        AddTextComponentSubstringPlayerName(str)
        return
    end

    local startIndex = 0

    for i = 0, GetCharacterCount(str), 1 do
        local length = i - startIndex
        if GetByteCount(string.sub(str, startIndex, length)) > maxbytelength then
            AddTextComponentSubstringPlayerName(string.sub(str, startIndex, length - 1))
            i = i - 1
            startIndex = startIndex + (length - 1)
        end
    end
    AddTextComponentSubstringPlayerName(string.sub(str, startIndex, GetCharacterCount(str) - startIndex))
end 

function AddLongString(str)
    local bytecount = GetByteCount(str)
    if bytecount == GetCharacterCount(str) then
        AddLongStringForAscii(str)
    else
        AddLongStringForUtf8(str)
    end
end

function MeasureStringWidthNoConvert(str, font, scale)
    BeginTextCommandWidth("STRING")
    AddLongString(str)
    SetTextFont(font or 0)
    SetTextScale(1.0, scale or 0)
    return EndTextCommandGetWidth(true)
end

function MeasureStringWidth(str, font, scale)
    return MeasureStringWidthNoConvert(str, font, scale) * 1920
end

function UIResText.New(Text, X, Y, Scale, R, G, B, A, Font, Alignment, DropShadow, Outline, WordWrap)
    local _UIResText = {
        _Text = tostring(Text) or "",
        X = tonumber(X) or 0,
        Y = tonumber(Y) or 0,
        Scale = tonumber(Scale) or 0,
        _Colour = {R = tonumber(R) or 255, G = tonumber(G) or 255, B = tonumber(B) or 255, A = tonumber(A) or 255},
        Font = tonumber(Font) or 0,
        Alignment = Alignment or nil,
        DropShadow = Dropshadow or nil,
        Outline = Outline or nil,
        WordWrap = tonumber(WordWrap) or 0,
    }
    return setmetatable(_UIResText, UIResText)
end

function UIResText:Position(X, Y)
    if tonumber(X) and tonumber(Y) then
        self.X = tonumber(X)
        self.Y = tonumber(Y)
    else
        return {X = self.X, Y = self.Y}
    end
end

function UIResText:Colour(R, G, B, A)
    if tonumber(R) and tonumber(G) and tonumber(B) and tonumber(A) then
        self._Colour.R = tonumber(R)
        self._Colour.B = tonumber(B)
        self._Colour.G = tonumber(G)
        self._Colour.A = tonumber(A)
    else
        return self._Colour
    end
end

function UIResText:Text(Text)
    if tostring(Text) and Text ~= nil then
        self._Text = tostring(Text)
    else
        return self._Text
    end
end

function UIResText:Draw()
    local Position = self:Position()
    Position.X, Position.Y = FormatXWYH(Position.X, Position.Y)

    SetTextFont(self.Font)
    SetTextScale(1.0, self.Scale)
    SetTextColour(self._Colour.R, self._Colour.G, self._Colour.B, self._Colour.A)

    if self.DropShadow then
        SetTextDropShadow()
    end
    if self.Outline then
        SetTextOutline()
    end

    if self.Alignment ~= nil then
        if self.Alignment == 1 or self.Alignment == "Center" or self.Alignment == "Centre" then
            SetTextCentre(true)
        elseif self.Alignment == 2 or self.Alignment == "Right" then
            SetTextRightJustify(true)
            SetTextWrap(0, Position.X)
        end
    end

    if tonumber(self.WordWrap) then
        if tonumber(self.WordWrap) ~= 0 then
            SetTextWrap(Position.X, Position.X + (tonumber(self.WordWrap) / Resolution.Width))
        end
    end

    BeginTextCommandDisplayText("STRING")
    AddLongString(self._Text)
    EndTextCommandDisplayText(Position.X, Position.Y)
end

function RenderText(Text, X, Y, Font, Scale, R, G, B, A, Alignment, DropShadow, Outline, WordWrap)
    Text = tostring(Text)
    X, Y = FormatXWYH(X, Y)
    SetTextFont(Font or 0)
    SetTextScale(1.0, Scale or 0)
    SetTextColour(R or 255, G or 255, B or 255, A or 255)

    if DropShadow then
        SetTextDropShadow()
    end
    if Outline then
        SetTextOutline()
    end

    if Alignment ~= nil then
        if Alignment == 1 or Alignment == "Center" or Alignment == "Centre" then
            SetTextCentre(true)
        elseif Alignment == 2 or Alignment == "Right" then
            SetTextRightJustify(true)
            SetTextWrap(0, X)
        end
    end

    if tonumber(WordWrap) then
        if tonumber(WordWrap) ~= 0 then
            WordWrap, _ = FormatXWYH(WordWrap, 0)
            SetTextWrap(WordWrap, X - WordWrap)
        end
    end

    BeginTextCommandDisplayText("STRING")
    AddLongString(Text)
    EndTextCommandDisplayText(X, Y)
end

--[[
    Sprite.lua
    Elements
--]]

function Sprite.New(TxtDictionary, TxtName, X, Y, Width, Height, Heading, R, G, B, A)
    local _Sprite = {
        TxtDictionary = tostring(TxtDictionary),
        TxtName = tostring(TxtName),
        X = tonumber(X) or 0,
        Y = tonumber(Y) or 0,
        Width = tonumber(Width) or 0, 
        Height = tonumber(Height) or 0,
        Heading = tonumber(Heading) or 0,
        _Colour = {R = tonumber(R) or 255, G = tonumber(G) or 255, B = tonumber(B) or 255, A = tonumber(A) or 255},
    }
    return setmetatable(_Sprite, Sprite)
end

function Sprite:Position(X, Y)
    if tonumber(X) and tonumber(Y) then
        self.X = tonumber(X)
        self.Y = tonumber(Y)
    else
        return {X = self.X, Y = self.Y}
    end
end

function Sprite:Size(Width, Height)
    if tonumber(Width) and tonumber(Width) then
        self.Width = tonumber(Width)
        self.Height = tonumber(Height)
    else
        return {Width = self.Width, Height = self.Height}
    end
end

function Sprite:Colour(R, G, B, A)
    if tonumber(R) or tonumber(G) or tonumber(B) or tonumber(A) then
        self._Colour.R = tonumber(R) or 255
        self._Colour.B = tonumber(B) or 255
        self._Colour.G = tonumber(G) or 255
        self._Colour.A = tonumber(A) or 255
    else
        return self._Colour
    end
end

function Sprite:Draw()
    if not HasStreamedTextureDictLoaded(self.TxtDictionary) then
        RequestStreamedTextureDict(self.TxtDictionary, true)
    end
    local Position = self:Position()
    local Size = self:Size()
    Size.Width, Size.Height = FormatXWYH(Size.Width, Size.Height)
    Position.X, Position.Y = FormatXWYH(Position.X, Position.Y)
    DrawSprite(self.TxtDictionary, self.TxtName, Position.X + Size.Width * 0.5, Position.Y + Size.Height * 0.5, Size.Width, Size.Height, self.Heading, self._Colour.R, self._Colour.G, self._Colour.B, self._Colour.A)
end

function DrawTexture(TxtDictionary, TxtName, X, Y, Width, Height, Heading, R, G, B, A)
    if not HasStreamedTextureDictLoaded(tostring(TxtDictionary) or "") then
        RequestStreamedTextureDict(tostring(TxtDictionary) or "", true)
    end
    X, Y, Width, Height = X or 0, Y or 0, Width or 0, Height or 0
    X, Y = FormatXWYH(X, Y)
    Width, Height = FormatXWYH(Width, Height)
    DrawSprite(tostring(TxtDictionary) or "", tostring(TxtName) or "", X + Width * 0.5, Y + Height * 0.5, Width, Height, tonumber(Heading) or 0, tonumber(R) or 255, tonumber(G) or 255, tonumber(B) or 255, tonumber(A) or 255)
end

--[[
    StringMeasurer.lua
    Elements
--]]

function MeasureString(str)
    local output = 0
    for i = 1, GetCharacterCount(str), 1 do
        if CharacterMap[string.sub(str, i, i)] then
            output = output + CharacterMap[string.sub(str, i, i)] + 1
        end
    end
    return output
end

--[[
    Badge.lua
    Elements
--]]

function GetBadgeTexture(Badge, Selected)
    if BadgeTexture[Badge] then
        return BadgeTexture[Badge](Selected)
    else
        return ""
    end
end

function GetBadgeDictionary(Badge, Selected)
    if BadgeDictionary[Badge] then
        return BadgeDictionary[Badge](Selected)
    else
        return "commonmenu"
    end
end

function GetBadgeColour(Badge, Selected)
    if BadgeColour[Badge] then
        return BadgeColour[Badge](Selected)
    else
        return 255, 255, 255, 255
    end
end

--[[
    Colours.lua
    Elements
--]]

--[[
    UIMenuItem.lua
    Items
--]]

function UIMenuItem.New(Text, Description)
    _UIMenuItem = {
        Rectangle = UIResRectangle.New(0, 0, 431, 38, 255, 255, 255, 20),
        Text = UIResText.New(tostring(Text) or "", 8, 0, 0.33, 245, 245, 245, 255, 0),
        _Description = tostring(Description) or "";
        SelectedSprite = Sprite.New("commonmenu", "gradient_nav", 0, 0, 431, 38),
        LeftBadge = { Sprite = Sprite.New("commonmenu", "", 0, 0, 40, 40), Badge = 0},
        RightBadge = { Sprite = Sprite.New("commonmenu", "", 0, 0, 40, 40), Badge = 0},
        Label = {
            Text = UIResText.New("", 0, 0, 0.35, 245, 245, 245, 255, 0, "Right"),
            MainColour = {R = 255, G = 255, B = 255, A = 255},
            HighlightColour = {R = 0, G = 0, B = 0, A = 255},
        },
        _Selected = false,
        _Hovered = false,
        _Enabled = true,
        _Offset = {X = 0, Y = 0},
        ParentMenu = nil,
        Panels = {},
        Activated = function(menu, item, panels) end,
        ActivatedPanel = function(menu, item, panel, panelvalue) end,
    }
    return setmetatable(_UIMenuItem, UIMenuItem)
end

function UIMenuItem:SetParentMenu(Menu)
    if Menu ~= nil and Menu() == "UIMenu" then
        self.ParentMenu = Menu
    else
        return self.ParentMenu
    end
end

function UIMenuItem:Selected(bool)
    if bool ~= nil then
        self._Selected = tobool(bool)
    else
        return self._Selected
    end
end

function UIMenuItem:Hovered(bool)
    if bool ~= nil then
        self._Hovered = tobool(bool)
    else
        return self._Hovered
    end
end

function UIMenuItem:Enabled(bool)
    if bool ~= nil then
        self._Enabled = tobool(bool)
    else
        return self._Enabled
    end
end

function UIMenuItem:Description(str)
    if tostring(str) and str ~= nil then
        self._Description = tostring(str)
    else
        return self._Description
    end
end

function UIMenuItem:Offset(X, Y)
    if tonumber(X) or tonumber(Y) then
        if tonumber(X) then
            self._Offset.X = tonumber(X)
        end
        if tonumber(Y) then
            self._Offset.Y = tonumber(Y)
        end
    else
        return self._Offset
    end
end

function UIMenuItem:Position(Y)
    if tonumber(Y) then
        self.Rectangle:Position(self._Offset.X, Y + 144 + self._Offset.Y)
        self.SelectedSprite:Position(0 + self._Offset.X, Y + 144 + self._Offset.Y)
        self.Text:Position(8 + self._Offset.X, Y + 147 + self._Offset.Y)
        self.LeftBadge.Sprite:Position(0 + self._Offset.X, Y + 142 + self._Offset.Y)
        self.RightBadge.Sprite:Position(385 + self._Offset.X, Y + 142 + self._Offset.Y)
        self.Label.Text:Position(420 + self._Offset.X, Y + 148 + self._Offset.Y)
    end
end

function UIMenuItem:RightLabel(Text, MainColour, HighlightColour)
    if tostring(Text) and Text ~= nil then
        if type(MainColour) == "table" then
            self.Label.MainColour = MainColour
        end
        if type(HighlightColour) == "table" then
            self.Label.HighlightColour = HighlightColour
        end
        self.Label.Text:Text(tostring(Text))
    else
        return self.Label.Text:Text()
    end
end

function UIMenuItem:SetLeftBadge(Badge)
    if tonumber(Badge) then
        self.LeftBadge.Badge = tonumber(Badge)
    end
end

function UIMenuItem:SetRightBadge(Badge)
    if tonumber(Badge) then
        self.RightBadge.Badge = tonumber(Badge)
    end
end

function UIMenuItem:Text(Text)
    if tostring(Text) and Text ~= nil then
        self.Text:Text(tostring(Text))
    else
        return self.Text:Text()
    end
end

function UIMenuItem:AddPanel(Panel)
    if Panel() == "UIMenuPanel" then
        table.insert(self.Panels, Panel)
        Panel:SetParentItem(self)
    end
end

function UIMenuItem:RemovePanelAt(Index)
    if tonumber(Index) then
        if self.Panels[Index] then
            table.remove(self.Panels, tonumber(Index))
        end
    end
end

function UIMenuItem:FindPanelIndex(Panel)
    if Panel() == "UIMenuPanel" then
        for Index = 1, #self.Panels do
            if self.Panels[Index] == Panel then
                return Index
            end
        end
    end
    return nil
end

function UIMenuItem:FindPanelItem()
    for Index = #self.Items, 1, -1 do
        if self.Items[Index].Panel then
            return Index
        end
    end
    return nil
end

function UIMenuItem:Draw()
    self.Rectangle:Size(431 + self.ParentMenu.WidthOffset, self.Rectangle.Height)
    self.SelectedSprite:Size(431 + self.ParentMenu.WidthOffset, self.SelectedSprite.Height)

    if self._Hovered and not self._Selected then
        self.Rectangle:Draw()
    end

    if self._Selected then
        self.SelectedSprite:Draw()
    end

    if self._Enabled then
        if self._Selected then
            self.Text:Colour(0, 0, 0, 255)
            self.Label.Text:Colour(self.Label.HighlightColour.R, self.Label.HighlightColour.G, self.Label.HighlightColour.B, self.Label.HighlightColour.A)
        else
            self.Text:Colour(245, 245, 245, 255)
            self.Label.Text:Colour(self.Label.MainColour.R, self.Label.MainColour.G, self.Label.MainColour.B, self.Label.MainColour.A)
        end
    else
        self.Text:Colour(163, 159, 148, 255)
        self.Label.Text:Colour(163, 159, 148, 255)
    end

    if self.LeftBadge.Badge == BadgeStyle.None then
        self.Text:Position(8 + self._Offset.X, self.Text.Y)
    else
        self.Text:Position(35 + self._Offset.X, self.Text.Y)
        self.LeftBadge.Sprite.TxtDictionary = GetBadgeDictionary(self.LeftBadge.Badge, self._Selected)
        self.LeftBadge.Sprite.TxtName = GetBadgeTexture(self.LeftBadge.Badge, self._Selected)
        self.LeftBadge.Sprite:Colour(GetBadgeColour(self.LeftBadge.Badge, self._Selected))
        self.LeftBadge.Sprite:Draw()
    end

    if self.RightBadge.Badge ~= BadgeStyle.None then
        self.RightBadge.Sprite:Position(385 + self._Offset.X + self.ParentMenu.WidthOffset, self.RightBadge.Sprite.Y)
        self.RightBadge.Sprite.TxtDictionary = GetBadgeDictionary(self.RightBadge.Badge, self._Selected)
        self.RightBadge.Sprite.TxtName = GetBadgeTexture(self.RightBadge.Badge, self._Selected)
        self.RightBadge.Sprite:Colour(GetBadgeColour(self.RightBadge.Badge, self._Selected))
        self.RightBadge.Sprite:Draw()
    end

    if self.Label.Text:Text() ~= "" and string.len(self.Label.Text:Text()) > 0 then
        self.Label.Text:Position(420 + self._Offset.X + self.ParentMenu.WidthOffset, self.Label.Text.Y)
        self.Label.Text:Draw()
    end

    self.Text:Draw()
end

--[[
    UIMenuCheckboxItem.lua
    Items
--]]

function UIMenuCheckboxItem.New(Text, Check, Description)
    local _UIMenuCheckboxItem = {
        Base = UIMenuItem.New(Text or "", Description or ""),
        CheckedSprite = Sprite.New("commonmenu", "shop_box_blank", 410, 95, 50, 50),
        Checked = tobool(Check),
        CheckboxEvent = function(menu, item, checked) end,
    }
    return setmetatable(_UIMenuCheckboxItem, UIMenuCheckboxItem)
end

function UIMenuCheckboxItem:SetParentMenu(Menu)
    if Menu() == "UIMenu" then
        self.Base.ParentMenu = Menu
    else
        return self.Base.ParentMenu
    end
end

function UIMenuCheckboxItem:Position(Y)
    if tonumber(Y) then
        self.Base:Position(Y)
        self.CheckedSprite:Position(380 + self.Base._Offset.X + self.Base.ParentMenu.WidthOffset, Y + 138 + self.Base._Offset.Y)
    end
end

function UIMenuCheckboxItem:Selected(bool)
    if bool ~= nil then
        self.Base._Selected = tobool(bool)
    else
        return self.Base._Selected
    end
end

function UIMenuCheckboxItem:Hovered(bool)
    if bool ~= nil then
        self.Base._Hovered = tobool(bool)
    else
        return self.Base._Hovered
    end
end

function UIMenuCheckboxItem:Enabled(bool)
    if bool ~= nil then
        self.Base._Enabled = tobool(bool)
    else
        return self.Base._Enabled
    end
end

function UIMenuCheckboxItem:Description(str)
    if tostring(str) and str ~= nil then
        self.Base._Description = tostring(str)
    else
        return self.Base._Description
    end
end

function UIMenuCheckboxItem:Offset(X, Y)
    if tonumber(X) or tonumber(Y) then
        if tonumber(X) then
            self.Base._Offset.X = tonumber(X)
        end
        if tonumber(Y) then
            self.Base._Offset.Y = tonumber(Y)
        end
    else
        return self.Base._Offset
    end
end

function UIMenuCheckboxItem:Text(Text)
    if tostring(Text) and Text ~= nil then
        self.Base.Text:Text(tostring(Text))
    else
        return self.Base.Text:Text()
    end
end

function UIMenuCheckboxItem:SetLeftBadge()
    error("This item does not support badges")
end

function UIMenuCheckboxItem:SetRightBadge()
    error("This item does not support badges")
end

function UIMenuCheckboxItem:RightLabel()
    error("This item does not support a right label")
end

function UIMenuCheckboxItem:Draw()
    self.Base:Draw()
    self.CheckedSprite:Position(380 + self.Base._Offset.X + self.Base.ParentMenu.WidthOffset, self.CheckedSprite.Y)
    if self.Base:Selected() then
        if self.Checked then
            self.CheckedSprite.TxtName = "shop_box_tickb"
        else
            self.CheckedSprite.TxtName = "shop_box_blankb"
        end
    else
        if self.Checked then
            self.CheckedSprite.TxtName = "shop_box_tick"
        else
            self.CheckedSprite.TxtName = "shop_box_blank"
        end
    end
    self.CheckedSprite:Draw()
end

--[[
    UIMenuListItem.lua
    Items
--]]

function UIMenuListItem.New(Text, Items, Index, Description)
    if type(Items) ~= "table" then Items = {} end
    if Index == 0 then Index = 1 end
    local _UIMenuListItem = {
        Base = UIMenuItem.New(Text or "", Description or ""),
        Items = Items,
        LeftArrow = Sprite.New("commonmenu", "arrowleft", 110, 105, 30, 30),
        RightArrow = Sprite.New("commonmenu", "arrowright", 280, 105, 30, 30),
        ItemText = UIResText.New("", 290, 104, 0.35, 255, 255, 255, 255, 0, "Right"),
        _Index = tonumber(Index) or 1,
        Panels = {},
        OnListChanged = function(menu, item, newindex) end,
        OnListSelected = function(menu, item, newindex) end,
    }
    return setmetatable(_UIMenuListItem, UIMenuListItem)
end

function UIMenuListItem:SetParentMenu(Menu)
    if Menu ~= nil and Menu() == "UIMenu" then
        self.Base.ParentMenu = Menu
    else
        return self.Base.ParentMenu
    end
end

function UIMenuListItem:Position(Y)
    if tonumber(Y) then
        self.LeftArrow:Position(300 + self.Base._Offset.X + self.Base.ParentMenu.WidthOffset, 147 + Y + self.Base._Offset.Y)
        self.RightArrow:Position(400 + self.Base._Offset.X + self.Base.ParentMenu.WidthOffset, 147 + Y + self.Base._Offset.Y)
        self.ItemText:Position(300 + self.Base._Offset.X + self.Base.ParentMenu.WidthOffset, 147 + Y + self.Base._Offset.Y)
        self.Base:Position(Y)
    end
end

function UIMenuListItem:Selected(bool)
    if bool ~= nil then
        self.Base._Selected = tobool(bool)
    else
        return self.Base._Selected
    end
end

function UIMenuListItem:Hovered(bool)
    if bool ~= nil then
        self.Base._Hovered = tobool(bool)
    else
        return self.Base._Hovered
    end
end

function UIMenuListItem:Enabled(bool)
    if bool ~= nil then
        self.Base._Enabled = tobool(bool)
    else
        return self.Base._Enabled
    end
end

function UIMenuListItem:Description(str)
    if tostring(str) and str ~= nil then
        self.Base._Description = tostring(str)
    else
        return self.Base._Description
    end
end

function UIMenuListItem:Offset(X, Y)
    if tonumber(X) or tonumber(Y) then
        if tonumber(X) then
            self.Base._Offset.X = tonumber(X)
        end
        if tonumber(Y) then
            self.Base._Offset.Y = tonumber(Y)
        end
    else
        return self.Base._Offset
    end
end

function UIMenuListItem:Text(Text)
    if tostring(Text) and Text ~= nil then
        self.Base.Text:Text(tostring(Text))
    else
        return self.Base.Text:Text()
    end
end

function UIMenuListItem:Index(Index)
    if tonumber(Index) then
        if tonumber(Index) > #self.Items then
            self._Index = 1
        elseif tonumber(Index) < 1 then
            self._Index = #self.Items
        else
            self._Index = tonumber(Index)
        end
    else
        return self._Index
    end
end

function UIMenuListItem:ItemToIndex(Item)
    for i = 1, #self.Items do
        if type(Item) == type(self.Items[i]) and Item == self.Items[i] then
            return i
        elseif type(self.Items[i]) == "table" and (type(Item) == type(self.Items[i].Name) or type(Item) == type(self.Items[i].Value)) and (Item == self.Items[i].Name or Item == self.Items[i].Value) then
            return i
        end
    end
end

function UIMenuListItem:IndexToItem(Index)
    if tonumber(Index) then
        if tonumber(Index) == 0 then Index = 1 end
        if self.Items[tonumber(Index)] then
            return self.Items[tonumber(Index)]
        end
    end
end

function UIMenuListItem:SetLeftBadge()
    error("This item does not support badges")
end

function UIMenuListItem:SetRightBadge()
    error("This item does not support badges")
end

function UIMenuListItem:RightLabel()
    error("This item does not support a right label")
end

function UIMenuListItem:AddPanel(Panel)
    if Panel() == "UIMenuPanel" then
        table.insert(self.Panels, Panel)
        Panel:SetParentItem(self)
    end
end

function UIMenuListItem:RemovePanelAt(Index)
    if tonumber(Index) then
        if self.Panels[Index] then
            table.remove(self.Panels, tonumber(Index))
        end
    end
end

function UIMenuListItem:FindPanelIndex(Panel)
    if Panel() == "UIMenuPanel" then
        for Index = 1, #self.Panels do
            if self.Panels[Index] == Panel then
                return Index
            end
        end
    end
    return nil
end

function UIMenuListItem:FindPanelItem()
    for Index = #self.Items, 1, -1 do
        if self.Items[Index].Panel then
            return Index
        end
    end
    return nil
end

function UIMenuListItem:Draw()
    self.Base:Draw()

    if self:Enabled() then
        if self:Selected() then
            self.ItemText:Colour(0, 0, 0, 255)
            self.LeftArrow:Colour(0, 0, 0, 255)
            self.RightArrow:Colour(0, 0, 0, 255)
        else
            self.ItemText:Colour(245, 245, 245, 255)
            self.LeftArrow:Colour(245, 245, 245, 255)
            self.RightArrow:Colour(245, 245, 245, 255)
        end
    else
        self.ItemText:Colour(163, 159, 148, 255)
        self.LeftArrow:Colour(163, 159, 148, 255)
        self.RightArrow:Colour(163, 159, 148, 255)
    end

    local Text = (type(self.Items[self._Index]) == "table") and tostring(self.Items[self._Index].Name) or tostring(self.Items[self._Index])
    local Offset = MeasureStringWidth(Text, 0, 0.35)

    self.ItemText:Text(Text)
    self.LeftArrow:Position(378 - Offset + self.Base._Offset.X + self.Base.ParentMenu.WidthOffset, self.LeftArrow.Y)

    if self:Selected() then
        self.LeftArrow:Draw()
        self.RightArrow:Draw()
        self.ItemText:Position(403 + self.Base._Offset.X + self.Base.ParentMenu.WidthOffset, self.ItemText.Y)
    else
        self.ItemText:Position(418 + self.Base._Offset.X + self.Base.ParentMenu.WidthOffset, self.ItemText.Y)
    end

    self.ItemText:Draw()
end

--[[
    UIMenuSliderItem.lua
    Items
--]]

function UIMenuSliderItem.New(Text, Items, Index, Description, Divider)
    if type(Items) ~= "table" then Items = {} end
    if Index == 0 then Index = 1 end
    local _UIMenuSliderItem = {
        Base = UIMenuItem.New(Text or "", Description or ""),
        Items = Items,
        ShowDivider = tobool(Divider),
        LeftArrow = Sprite.New("commonmenutu", "arrowleft", 0, 105, 15, 15),
        RightArrow = Sprite.New("commonmenutu", "arrowright", 0, 105, 15, 15),
        Background = UIResRectangle.New(0, 0, 150, 9, 4, 32, 57, 255),
        Slider = UIResRectangle.New(0, 0, 75, 9, 57, 116, 200, 255),
        Divider = UIResRectangle.New(0, 0, 2.5, 20, 245, 245, 245, 255),
        _Index = tonumber(Index) or 1,
        OnSliderChanged = function(menu, item, newindex) end,
        OnSliderSelected = function(menu, item, newindex) end,
    }
    return setmetatable(_UIMenuSliderItem, UIMenuSliderItem)
end

function UIMenuSliderItem:SetParentMenu(Menu)
    if Menu() == "UIMenu" then
        self.Base.ParentMenu = Menu
    else
        return self.Base.ParentMenu
    end
end

function UIMenuSliderItem:Position(Y)
    if tonumber(Y) then
        self.Background:Position(250 + self.Base._Offset.X + self.Base.ParentMenu.WidthOffset, Y + 158.5 + self.Base._Offset.Y)
        self.Slider:Position(250 + self.Base._Offset.X + self.Base.ParentMenu.WidthOffset, Y + 158.5 + self.Base._Offset.Y)
        self.Divider:Position(323.5 + self.Base._Offset.X + self.Base.ParentMenu.WidthOffset, Y + 153 + self.Base._Offset.Y)
        self.LeftArrow:Position(235 + self.Base._Offset.X + self.Base.ParentMenu.WidthOffset, 155.5 + Y + self.Base._Offset.Y)
        self.RightArrow:Position(400 + self.Base._Offset.X + self.Base.ParentMenu.WidthOffset, 155.5 + Y + self.Base._Offset.Y)
        self.Base:Position(Y)
    end
end

function UIMenuSliderItem:Selected(bool)
    if bool ~= nil then
        self.Base._Selected = tobool(bool)
    else
        return self.Base._Selected
    end
end

function UIMenuSliderItem:Hovered(bool)
    if bool ~= nil then
        self.Base._Hovered = tobool(bool)
    else
        return self.Base._Hovered
    end
end

function UIMenuSliderItem:Enabled(bool)
    if bool ~= nil then
        self.Base._Enabled = tobool(bool)
    else
        return self.Base._Enabled
    end
end

function UIMenuSliderItem:Description(str)
    if tostring(str) and str ~= nil then
        self.Base._Description = tostring(str)
    else
        return self.Base._Description
    end
end

function UIMenuSliderItem:Offset(X, Y)
    if tonumber(X) or tonumber(Y) then
        if tonumber(X) then
            self.Base._Offset.X = tonumber(X)
        end
        if tonumber(Y) then
            self.Base._Offset.Y = tonumber(Y)
        end
    else
        return self.Base._Offset
    end
end

function UIMenuSliderItem:Text(Text)
    if tostring(Text) and Text ~= nil then
        self.Base.Text:Text(tostring(Text))
    else
        return self.Base.Text:Text()
    end
end

function UIMenuSliderItem:Index(Index)
    if tonumber(Index) then
        if tonumber(Index) > #self.Items then
            self._Index = 1
        elseif tonumber(Index) < 1 then
            self._Index = #self.Items
        else
            self._Index = tonumber(Index)
        end
    else
        return self._Index
    end
end

function UIMenuSliderItem:ItemToIndex(Item)
    for i = 1, #self.Items do
        if type(Item) == type(self.Items[i]) and Item == self.Items[i] then
            return i
        end
    end
end

function UIMenuSliderItem:IndexToItem(Index)
    if tonumber(Index) then
        if tonumber(Index) == 0 then Index = 1 end
        if self.Items[tonumber(Index)] then
            return self.Items[tonumber(Index)]
        end
    end
end

function UIMenuSliderItem:SetLeftBadge()
    error("This item does not support badges")
end

function UIMenuSliderItem:SetRightBadge()
    error("This item does not support badges")
end

function UIMenuSliderItem:RightLabel()
    error("This item does not support a right label")
end

function UIMenuSliderItem:Draw()
    self.Base:Draw()

    if self:Enabled() then
        if self:Selected() then
            self.LeftArrow:Colour(0, 0, 0, 255)
            self.RightArrow:Colour(0, 0, 0, 255)
        else
            self.LeftArrow:Colour(245, 245, 245, 255)
            self.RightArrow:Colour(245, 245, 245, 255)
        end
    else
        self.LeftArrow:Colour(163, 159, 148, 255)
        self.RightArrow:Colour(163, 159, 148, 255)
    end
    
    local Offset = ((self.Background.Width - self.Slider.Width)/(#self.Items - 1)) * (self._Index-1)

    self.Slider:Position(250 + self.Base._Offset.X + Offset + self.Base.ParentMenu.WidthOffset, self.Slider.Y)

    if self:Selected() then
        self.LeftArrow:Draw()
        self.RightArrow:Draw()
    end

    self.Background:Draw()
    self.Slider:Draw()
    if self.ShowDivider then
        self.Divider:Draw()
    end
end

--[[
    UIMenuColouredItem.lua
    Items
--]]

function UIMenuColouredItem.New(Text, Description, MainColour, HighlightColour)
    if type(Colour) ~= "table" then Colour = {R = 0, G = 0, B = 0, A = 255} end
    if type(HighlightColour) ~= "table" then Colour = {R = 255, G = 255, B = 255, A = 255} end
    local _UIMenuColouredItem = {
        Base = UIMenuItem.New(Text or "", Description or ""),
        Rectangle = UIResRectangle.New(0, 0, 431, 38, MainColour.R, MainColour.G, MainColour.B, MainColour.A),
        MainColour = MainColour,
        HighlightColour = HighlightColour,
        Activated = function(menu, item) end,
    }
    _UIMenuColouredItem.Base.SelectedSprite:Colour(HighlightColour.R, HighlightColour.G, HighlightColour.B, HighlightColour.A)
    return setmetatable(_UIMenuColouredItem, UIMenuColouredItem)
end

function UIMenuColouredItem:SetParentMenu(Menu)
    if Menu() == "UIMenu" then
        self.Base.ParentMenu = Menu
    else
        return self.Base.ParentMenu
    end
end

function UIMenuColouredItem:Position(Y)
    if tonumber(Y) then
        self.Base:Position(Y)
        self.Rectangle:Position(self.Base._Offset.X, Y + 144 + self.Base._Offset.Y)
    end
end

function UIMenuColouredItem:Selected(bool)
    if bool ~= nil then
        self.Base._Selected = tobool(bool)
    else
        return self.Base._Selected
    end
end

function UIMenuColouredItem:Hovered(bool)
    if bool ~= nil then
        self.Base._Hovered = tobool(bool)
    else
        return self.Base._Hovered
    end
end

function UIMenuColouredItem:Enabled(bool)
    if bool ~= nil then
        self.Base._Enabled = tobool(bool)
    else
        return self.Base._Enabled
    end
end

function UIMenuColouredItem:Description(str)
    if tostring(str) and str ~= nil then
        self.Base._Description = tostring(str)
    else
        return self.Base._Description
    end
end

function UIMenuColouredItem:Offset(X, Y)
    if tonumber(X) or tonumber(Y) then
        if tonumber(X) then
            self.Base._Offset.X = tonumber(X)
        end
        if tonumber(Y) then
            self.Base._Offset.Y = tonumber(Y)
        end
    else
        return self.Base._Offset
    end
end

function UIMenuColouredItem:Text(Text)
    if tostring(Text) and Text ~= nil then
        self.Base.Text:Text(tostring(Text))
    else
        return self.Base.Text:Text()
    end
end

function UIMenuColouredItem:RightLabel(Text, MainColour, HighlightColour)
    if tostring(Text) and Text ~= nil then
        if type(MainColour) == "table" then
            self.Base.Label.MainColour = MainColour
        end
        if type(HighlightColour) == "table" then
            self.Base.Label.HighlightColour = HighlightColour
        end
        self.Base.Label.Text:Text(tostring(Text))
    else
        return self.Base.Label.Text:Text()
    end
end

function UIMenuColouredItem:SetLeftBadge(Badge)
    if tonumber(Badge) then
        self.Base.LeftBadge.Badge = tonumber(Badge)
    end
end

function UIMenuColouredItem:SetRightBadge(Badge)
    if tonumber(Badge) then
        self.Base.RightBadge.Badge = tonumber(Badge)
    end
end

function UIMenuColouredItem:Draw()
    self.Rectangle:Size(431 + self.ParentMenu.WidthOffset, self.Rectangle.Height)
    self.Rectangle:Draw()
    self.Base:Draw()
end

--[[
    UIMenuProgressItem.lua
    Items
--]]

function UIMenuProgressItem.New(Text, Items, Index, Description, Counter)
    if type(Items) ~= "table" then Items = {} end
    if Index == 0 then Index = 1 end
    local _UIMenuProgressItem = {
        Base = UIMenuItem.New(Text or "", Description or ""),
        Data = {
            Items = Items,
            Counter = tobool(Counter),
            Max = 407.5,
            Index = tonumber(Index) or 1,
        },
        Background = UIResRectangle.New(0, 0, 415, 20),
        Bar = UIResRectangle.New(0, 0, 407.5, 12.5),
        OnProgressChanged = function(menu, item, newindex) end,
        OnProgressSelected = function(menu, item, newindex) end,
    }

    _UIMenuProgressItem.Base.Rectangle.Height = 60
    _UIMenuProgressItem.Base.SelectedSprite.Height = 60

    if _UIMenuProgressItem.Data.Counter then
        _UIMenuProgressItem.Base:RightLabel(_UIMenuProgressItem.Data.Index.."/"..#_UIMenuProgressItem.Data.Items)
    else
        _UIMenuProgressItem.Base:RightLabel((type(_UIMenuProgressItem.Data.Items[_UIMenuProgressItem.Data.Index]) == "table") and tostring(_UIMenuProgressItem.Data.Items[_UIMenuProgressItem.Data.Index].Name) or tostring(_UIMenuProgressItem.Data.Items[_UIMenuProgressItem.Data.Index]))
    end

    _UIMenuProgressItem.Bar.Width = _UIMenuProgressItem.Data.Index/#_UIMenuProgressItem.Data.Items * _UIMenuProgressItem.Data.Max

    return setmetatable(_UIMenuProgressItem, UIMenuProgressItem)
end

function UIMenuProgressItem:SetParentMenu(Menu)
    if Menu() == "UIMenu" then
        self.Base.ParentMenu = Menu
    else
        return self.Base.ParentMenu
    end
end

function UIMenuProgressItem:Position(Y)
    if tonumber(Y) then
        self.Base:Position(Y)
        self.Background:Position(8 + self.Base._Offset.X + self.Base.ParentMenu.WidthOffset, 177 + Y + self.Base._Offset.Y)
        self.Bar:Position(11.75 + self.Base._Offset.X + self.Base.ParentMenu.WidthOffset, 180.75 + Y + self.Base._Offset.Y)
    end
end

function UIMenuProgressItem:Selected(bool)
    if bool ~= nil then
        self.Base._Selected = tobool(bool)
    else
        return self.Base._Selected
    end
end

function UIMenuProgressItem:Hovered(bool)
    if bool ~= nil then
        self.Base._Hovered = tobool(bool)
    else
        return self.Base._Hovered
    end
end

function UIMenuProgressItem:Enabled(bool)
    if bool ~= nil then
        self.Base._Enabled = tobool(bool)
    else
        return self.Base._Enabled
    end
end

function UIMenuProgressItem:Description(str)
    if tostring(str) and str ~= nil then
        self.Base._Description = tostring(str)
    else
        return self.Base._Description
    end
end

function UIMenuProgressItem:Offset(X, Y)
    if tonumber(X) or tonumber(Y) then
        if tonumber(X) then
            self.Base._Offset.X = tonumber(X)
        end
        if tonumber(Y) then
            self.Base._Offset.Y = tonumber(Y)
        end
    else
        return self.Base._Offset
    end
end

function UIMenuProgressItem:Text(Text)
    if tostring(Text) and Text ~= nil then
        self.Base.Text:Text(tostring(Text))
    else
        return self.Base.Text:Text()
    end
end

function UIMenuProgressItem:Index(Index)
    if tonumber(Index) then
        if tonumber(Index) > #self.Data.Items then
            self.Data.Index = 1
        elseif tonumber(Index) < 1 then
            self.Data.Index = #self.Data.Items
        else
            self.Data.Index = tonumber(Index)
        end

        if self.Data.Counter then
            self.Base:RightLabel(self.Data.Index.."/"..#self.Data.Items)
        else
            self.Base:RightLabel((type(self.Data.Items[self.Data.Index]) == "table") and tostring(self.Data.Items[self.Data.Index].Name) or tostring(self.Data.Items[self.Data.Index]))
        end

        self.Bar.Width = self.Data.Index/#self.Data.Items * self.Data.Max
    else
        return self.Data.Index
    end
end

function UIMenuProgressItem:ItemToIndex(Item)
    for i = 1, #self.Data.Items do
        if type(Item) == type(self.Data.Items[i]) and Item == self.Data.Items[i] then
            return i
        elseif type(self.Data.Items[i]) == "table" and (type(Item) == type(self.Data.Items[i].Name) or type(Item) == type(self.Data.Items[i].Value)) and (Item == self.Data.Items[i].Name or Item == self.Data.Items[i].Value) then
            return i
        end
    end
end

function UIMenuProgressItem:IndexToItem(Index)
    if tonumber(Index) then
        if tonumber(Index) == 0 then Index = 1 end
        if self.Data.Items[tonumber(Index)] then
            return self.Data.Items[tonumber(Index)]
        end
    end
end

function UIMenuProgressItem:SetLeftBadge()
    error("This item does not support badges")
end

function UIMenuProgressItem:SetRightBadge()
    error("This item does not support badges")
end

function UIMenuProgressItem:RightLabel()
    error("This item does not support a right label")
end

function UIMenuProgressItem:CalculateProgress(CursorX)
    local Progress = CursorX - self.Bar.X
    self:Index(math.round(#self.Data.Items * (((Progress >= 0 and Progress <= self.Data.Max) and Progress or ((Progress < 0) and 0 or self.Data.Max))/self.Data.Max)))
end

function UIMenuProgressItem:Draw()
    self.Base:Draw()

    if self.Base._Selected then
        self.Background:Colour(table.unpack(Colours.Black))
        self.Bar:Colour(table.unpack(Colours.White))
    else
        self.Background:Colour(table.unpack(Colours.White))
        self.Bar:Colour(table.unpack(Colours.Black))
    end

    self.Background:Draw()
    self.Bar:Draw()
end

--[[
    UIMenuHeritageWindow.lua
    Windows
--]]

function UIMenuHeritageWindow.New(Mum, Dad)
    if not tonumber(Mum) then Mum = 0 end
    if not (Mum >= 0 and Mum <= 21) then Mum = 0 end
    if not tonumber(Dad) then Dad = 0 end
    if not (Dad >= 0 and Dad <= 23) then Dad = 0 end
    _UIMenuHeritageWindow = {
        Background = Sprite.New("pause_menu_pages_char_mom_dad", "mumdadbg", 0, 0, 431, 228), -- Background is required, must be a sprite or a rectangle.
        MumSprite = Sprite.New("char_creator_portraits", ((Mum < 21) and "female_"..Mum or "special_female_"..(tonumber(string.sub(Mum, 2, 2)) - 1)), 0, 0, 228, 228),
        DadSprite = Sprite.New("char_creator_portraits", ((Dad < 21) and "male_"..Dad or "special_male_"..(tonumber(string.sub(Dad, 2, 2)) - 1)), 0, 0, 228, 228),
        Mum = Mum,
        Dad = Dad,
        _Offset = {X = 0, Y = 0}, -- required
        ParentMenu = nil, -- required
    }
    return setmetatable(_UIMenuHeritageWindow, UIMenuHeritageWindow)
end

function UIMenuHeritageWindow:SetParentMenu(Menu) -- required
    if Menu() == "UIMenu" then
        self.ParentMenu = Menu
    else
        return self.ParentMenu
    end
end

function UIMenuHeritageWindow:Offset(X, Y) -- required
    if tonumber(X) or tonumber(Y) then
        if tonumber(X) then
            self._Offset.X = tonumber(X)
        end
        if tonumber(Y) then
            self._Offset.Y = tonumber(Y)
        end
    else
        return self._Offset
    end
end

function UIMenuHeritageWindow:Position(Y) -- required
    if tonumber(Y) then
        self.Background:Position(self._Offset.X, 144 + Y + self._Offset.Y)
        self.MumSprite:Position(self._Offset.X + (self.ParentMenu.WidthOffset/2) + 25, 144 + Y + self._Offset.Y)
        self.DadSprite:Position(self._Offset.X + (self.ParentMenu.WidthOffset/2) + 195, 144 + Y + self._Offset.Y)
    end
end

function UIMenuHeritageWindow:Index(Mum, Dad)
    if not tonumber(Mum) then Mum = self.Mum end
    if not (Mum >= 0 and Mum <= 21) then Mum = self.Mum end
    if not tonumber(Dad) then Dad = self.Dad end
    if not (Dad >= 0 and Dad <= 23) then Dad = self.Dad end

    self.Mum = Mum
    self.Dad = Dad

    self.MumSprite.TxtName = ((self.Mum < 21) and "female_"..self.Mum or "special_female_"..(tonumber(string.sub(Mum, 2, 2)) - 1))
    self.DadSprite.TxtName = ((self.Dad < 21) and "male_"..self.Dad or "special_male_"..(tonumber(string.sub(Dad, 2, 2)) - 1))
end

function UIMenuHeritageWindow:Draw() -- required
    self.Background:Size(431 + self.ParentMenu.WidthOffset, 228)
    self.Background:Draw()
    self.DadSprite:Draw()
    self.MumSprite:Draw()
end

--[[
    UIMenuGridPanel.lua
    Panels
--]]

UIMenuGridPanel = setmetatable({}, UIMenuGridPanel)
UIMenuGridPanel.__index = UIMenuGridPanel
UIMenuGridPanel.__call = function() return "UIMenuPanel", "UIMenuGridPanel" end

function UIMenuGridPanel.New(TopText, LeftText, RightText, BottomText)
    _UIMenuGridPanel = {
        Data = {
            Enabled = true,
        },
        Background = Sprite.New("commonmenu", "gradient_bgd", 0, 0, 431, 275),
        Grid = Sprite.New("pause_menu_pages_char_mom_dad", "nose_grid", 0, 0, 200, 200, 0),
        Circle = Sprite.New("mpinventory","in_world_circle", 0, 0, 20, 20, 0),
        Audio = {Slider = "CONTINUOUS_SLIDER", Library = "HUD_FRONTEND_DEFAULT_SOUNDSET", Id = nil},
        ParentItem = nil,
        Text = {
            Top = UIResText.New(TopText or "Top", 0, 0, 0.35, 255, 255, 255, 255, 0, "Centre"),
            Left = UIResText.New(LeftText or "Left", 0, 0, 0.35, 255, 255, 255, 255, 0, "Centre"),
            Right = UIResText.New(RightText or "Right", 0, 0, 0.35, 255, 255, 255, 255, 0, "Centre"),
            Bottom = UIResText.New(BottomText or "Bottom", 0, 0, 0.35, 255, 255, 255, 255, 0, "Centre"),
        },
    }
    return setmetatable(_UIMenuGridPanel, UIMenuGridPanel)
end

function UIMenuGridPanel:SetParentItem(Item) -- required
    if Item() == "UIMenuItem" then
        self.ParentItem = Item
    else
        return self.ParentItem
    end
end

function UIMenuGridPanel:Enabled(Enabled)
    if type(Enabled) == "boolean" then
        self.Data.Enabled = Enabled
    else
        return self.Data.Enabled
    end
end

function UIMenuGridPanel:CirclePosition(X, Y)
    if tonumber(X) and tonumber(Y) then
        self.Circle.X = (self.Grid.X + 20) + ((self.Grid.Width - 40) * ((X >= 0.0 and X <= 1.0) and X or 0.0)) - (self.Circle.Width/2)
        self.Circle.Y = (self.Grid.Y + 20) + ((self.Grid.Height - 40) * ((Y >= 0.0 and Y <= 1.0) and Y or 0.0)) - (self.Circle.Height/2)
    else
        return math.round((self.Circle.X - (self.Grid.X + 20) + (self.Circle.Width/2))/(self.Grid.Width - 40), 2), math.round((self.Circle.Y - (self.Grid.Y + 20) + (self.Circle.Height/2))/(self.Grid.Height - 40), 2)
    end
end

function UIMenuGridPanel:Position(Y) -- required
    if tonumber(Y) then
        local ParentOffsetX, ParentOffsetWidth = self.ParentItem:Offset().X, self.ParentItem:SetParentMenu().WidthOffset
        
        self.Background:Position(ParentOffsetX, Y)
        self.Grid:Position(ParentOffsetX + 115.5 + (ParentOffsetWidth/2), 37.5 + Y)
        self.Text.Top:Position(ParentOffsetX + 215.5 + (ParentOffsetWidth/2), 5 + Y)
        self.Text.Left:Position(ParentOffsetX + 57.75 + (ParentOffsetWidth/2), 120 + Y)
        self.Text.Right:Position(ParentOffsetX + 373.25 + (ParentOffsetWidth/2), 120 + Y)
        self.Text.Bottom:Position(ParentOffsetX + 215.5 + (ParentOffsetWidth/2), 240 + Y)

        if not self.CircleLocked then
            self.CircleLocked = true
            self:CirclePosition(0.5, 0.5)
        end
    end
end

function UIMenuGridPanel:UpdateParent(X, Y)
    local _, ParentType = self.ParentItem()
    if ParentType == "UIMenuListItem" then
        local PanelItemIndex = self.ParentItem:FindPanelItem()
        if PanelItemIndex then
            self.ParentItem.Items[PanelItemIndex].Value[self.ParentItem:FindPanelIndex(self)] = {X = X, Y = Y}
            self.ParentItem:Index(PanelItemIndex)
            self.ParentItem.Base.ParentMenu.OnListChange(self.ParentItem.Base.ParentMenu, self.ParentItem, self.ParentItem._Index)
            self.ParentItem.OnListChanged(self.ParentItem.Base.ParentMenu, self.ParentItem, self.ParentItem._Index)
        else
            local PanelIndex = self.ParentItem:FindPanelIndex(self)
            for Index = 1, #self.ParentItem.Items do
                if type(self.ParentItem.Items[Index]) == "table" then
                    if not self.ParentItem.Items[Index].Panels then self.ParentItem.Items[Index].Panels = {} end
                    self.ParentItem.Items[Index].Panels[PanelIndex] = {X = X, Y = Y}
                else
                    self.ParentItem.Items[Index] = {Name = tostring(self.ParentItem.Items[Index]), Value = self.ParentItem.Items[Index], Panels = {[PanelIndex] = {X = X, Y = Y}}}
                end
            end
            self.ParentItem.Base.ParentMenu.OnListChange(self.ParentItem.Base.ParentMenu, self.ParentItem, self.ParentItem._Index)
            self.ParentItem.OnListChanged(self.ParentItem.Base.ParentMenu, self.ParentItem, self.ParentItem._Index)     
        end
    elseif ParentType == "UIMenuItem" then
        self.ParentItem.ActivatedPanel(self.ParentItem.ParentMenu, self.ParentItem, self, {X = X, Y = Y})
    end
end

function UIMenuGridPanel:Functions()
    local SafeZone = {X = 0, Y = 0}
    if self.ParentItem:SetParentMenu().Settings.ScaleWithSafezone then
       SafeZone = GetSafeZoneBounds()
    end

    if IsMouseInBounds(self.Grid.X + 20 + SafeZone.X, self.Grid.Y + 20 + SafeZone.Y, self.Grid.Width - 40, self.Grid.Height - 40) then
        if IsDisabledControlJustPressed(0, 24) then
            if not self.Pressed then
                self.Pressed = true
                Citizen.CreateThread(function()
                    self.Audio.Id = GetSoundId()
                    PlaySoundFrontend(self.Audio.Id, self.Audio.Slider, self.Audio.Library, 1)
                    while IsDisabledControlPressed(0, 24) and IsMouseInBounds(self.Grid.X + 20 + SafeZone.X, self.Grid.Y + 20 + SafeZone.Y, self.Grid.Width - 40, self.Grid.Height - 40) do
                        Citizen.Wait(0)
                        local CursorX, CursorY = math.round(GetControlNormal(0, 239) * 1920) - SafeZone.X - (self.Circle.Width/2), math.round(GetControlNormal(0, 240) * 1080) - SafeZone.Y - (self.Circle.Height/2)

                        self.Circle:Position(((CursorX > (self.Grid.X + 10 + self.Grid.Width - 40)) and (self.Grid.X + 10 + self.Grid.Width - 40) or ((CursorX < (self.Grid.X + 20 - (self.Circle.Width/2))) and (self.Grid.X + 20 - (self.Circle.Width/2)) or CursorX)), ((CursorY > (self.Grid.Y + 10 + self.Grid.Height - 40)) and (self.Grid.Y + 10 + self.Grid.Height - 40) or ((CursorY < (self.Grid.Y + 20 - (self.Circle.Height/2))) and (self.Grid.Y + 20 - (self.Circle.Height/2)) or CursorY)))
                    end
                    StopSound(self.Audio.Id)
                    ReleaseSoundId(self.Audio.Id)
                    self.Pressed = false
                end)
                Citizen.CreateThread(function()
                    while IsDisabledControlPressed(0, 24) and IsMouseInBounds(self.Grid.X + 20 + SafeZone.X, self.Grid.Y + 20 + SafeZone.Y, self.Grid.Width - 40, self.Grid.Height - 40) do
                        Citizen.Wait(75)
                        local ResultX, ResultY = math.round((self.Circle.X - (self.Grid.X + 20) + (self.Circle.Width/2))/(self.Grid.Width - 40), 2), math.round((self.Circle.Y - (self.Grid.Y + 20) + (self.Circle.Height/2))/(self.Grid.Height - 40), 2)

                        self:UpdateParent((((ResultX >= 0.0 and ResultX <= 1.0) and ResultX or ((ResultX <= 0) and 0.0) or 1.0) * 2) - 1, (((ResultY >= 0.0 and ResultY <= 1.0) and ResultY or ((ResultY <= 0) and 0.0) or 1.0) * 2) - 1)
                    end
                end)
            end
        end
    end
end

function UIMenuGridPanel:Draw() -- required
    if self.Data.Enabled then
        self.Background:Size(431 + self.ParentItem:SetParentMenu().WidthOffset, 275)

        self.Background:Draw()
        self.Grid:Draw()
        self.Circle:Draw()
        self.Text.Top:Draw()
        self.Text.Left:Draw()
        self.Text.Right:Draw()
        self.Text.Bottom:Draw()
        self:Functions()
    end
end

--[[
    UIMenuColourPanel.lua
    Panels
--]]

UIMenuColourPanel = setmetatable({}, UIMenuColourPanel)
UIMenuColourPanel.__index = UIMenuColourPanel
UIMenuColourPanel.__call = function() return "UIMenuPanel", "UIMenuColourPanel" end

function UIMenuColourPanel.New(Title, Colours)
    _UIMenuColourPanel = {
        Data = {
            Pagination = {
                Min = 1,
                Max = 8,
                Total = 8,
            },
            Index = 1000,
            Items = Colours,
            Title = Title or "Title",
            Enabled = true,
            Value = 1,
        },
        Background = Sprite.New("commonmenu", "gradient_bgd", 0, 0, 431, 112),
        Bar = {},
        LeftArrow = Sprite.New("commonmenu", "arrowleft", 0, 0, 30, 30),
        RightArrow = Sprite.New("commonmenu", "arrowright", 0, 0, 30, 30),
        SelectedRectangle = UIResRectangle.New(0, 0, 44.5, 8),
        Text = UIResText.New(Title.." (1 of "..#Colours..")" or "Title".." (1 of "..#Colours..")", 0, 0, 0.35, 255, 255, 255, 255, 0, "Centre"),
        ParentItem = nil,
    }

    for Index = 1, #Colours do
        if Index < 10 then
            table.insert(_UIMenuColourPanel.Bar, UIResRectangle.New(0, 0, 44.5, 44.5, table.unpack(Colours[Index])))
        else
            break
        end
    end

    if #_UIMenuColourPanel.Data.Items ~= 0 then
        _UIMenuColourPanel.Data.Index = 1000 - (1000 % #_UIMenuColourPanel.Data.Items)
        _UIMenuColourPanel.Data.Pagination.Max = _UIMenuColourPanel.Data.Pagination.Total + 1
        _UIMenuColourPanel.Data.Pagination.Min = 0
    end
    return setmetatable(_UIMenuColourPanel, UIMenuColourPanel)
end

function UIMenuColourPanel:SetParentItem(Item) -- required
    if Item() == "UIMenuItem" then
        self.ParentItem = Item
    else
        return self.ParentItem
    end
end

function UIMenuColourPanel:Enabled(Enabled)
    if type(Enabled) == "boolean" then
        self.Data.Enabled = Enabled
    else
        return self.Data.Enabled
    end
end

function UIMenuColourPanel:Position(Y) -- required
    if tonumber(Y) then
        local ParentOffsetX, ParentOffsetWidth = self.ParentItem:Offset().X, self.ParentItem:SetParentMenu().WidthOffset

        self.Background:Position(ParentOffsetX, Y)
        for Index = 1, #self.Bar do
            self.Bar[Index]:Position(15 + (44.5 * (Index - 1)) + ParentOffsetX + (ParentOffsetWidth/2), 55 + Y)
        end
        self.SelectedRectangle:Position(15 + (44.5 * ((self:CurrentSelection() - self.Data.Pagination.Min) - 1)) + ParentOffsetX + (ParentOffsetWidth/2), 47 + Y)
        self.LeftArrow:Position(7.5 + ParentOffsetX + (ParentOffsetWidth/2), 15 + Y)
        self.RightArrow:Position(393.5 + ParentOffsetX + (ParentOffsetWidth/2), 15 + Y)
        self.Text:Position(215.5 + ParentOffsetX + (ParentOffsetWidth/2), 15 + Y)
    end
end

function UIMenuColourPanel:CurrentSelection(value, PreventUpdate)
    if tonumber(value) then
        if #self.Data.Items == 0 then
            self.Data.Index = 0
        end

        self.Data.Index = 1000000 - (1000000 % #self.Data.Items) + tonumber(value)

        if self:CurrentSelection() > self.Data.Pagination.Max then
            self.Data.Pagination.Min = self:CurrentSelection() - (self.Data.Pagination.Total + 1)
            self.Data.Pagination.Max = self:CurrentSelection()
        elseif self:CurrentSelection() < self.Data.Pagination.Min then
            self.Data.Pagination.Min = self:CurrentSelection() - 1
            self.Data.Pagination.Max = self:CurrentSelection() + (self.Data.Pagination.Total + 1)
        end

        self:UpdateSelection(PreventUpdate)
    else
        if #self.Data.Items == 0 then
            return 1
        else
            if self.Data.Index % #self.Data.Items == 0 then
                return 1
            else
                return self.Data.Index % #self.Data.Items + 1
            end
        end
    end
end

function UIMenuColourPanel:UpdateParent(Colour)
    local _, ParentType = self.ParentItem()
    if ParentType == "UIMenuListItem" then
        local PanelItemIndex = self.ParentItem:FindPanelItem()
        local PanelIndex = self.ParentItem:FindPanelIndex(self)
        if PanelItemIndex then
            self.ParentItem.Items[PanelItemIndex].Value[PanelIndex] = Colour
            self.ParentItem:Index(PanelItemIndex)
            self.ParentItem.Base.ParentMenu.OnListChange(self.ParentItem.Base.ParentMenu, self.ParentItem, self.ParentItem._Index)
            self.ParentItem.OnListChanged(self.ParentItem.Base.ParentMenu, self.ParentItem, self.ParentItem._Index)
        else
            for Index = 1, #self.ParentItem.Items do
                if type(self.ParentItem.Items[Index]) == "table" then
                    if not self.ParentItem.Items[Index].Panels then self.ParentItem.Items[Index].Panels = {} end
                    self.ParentItem.Items[Index].Panels[PanelIndex] = Colour
                else
                    self.ParentItem.Items[Index] = {Name = tostring(self.ParentItem.Items[Index]), Value = self.ParentItem.Items[Index], Panels = {[PanelIndex] = Colour}}
                end
            end
            self.ParentItem.Base.ParentMenu.OnListChange(self.ParentItem.Base.ParentMenu, self.ParentItem, self.ParentItem._Index)
            self.ParentItem.OnListChanged(self.ParentItem.Base.ParentMenu, self.ParentItem, self.ParentItem._Index)     
        end
    elseif ParentType == "UIMenuItem" then
        self.ParentItem.ActivatedPanel(self.ParentItem.ParentMenu, self.ParentItem, self, Colour)
    end
end

function UIMenuColourPanel:UpdateSelection(PreventUpdate)
    local CurrentSelection = self:CurrentSelection()
    if not PreventUpdate then
        self:UpdateParent(CurrentSelection)
    end
    self.SelectedRectangle:Position(15 + (44.5 * ((CurrentSelection - self.Data.Pagination.Min) - 1)) + self.ParentItem:Offset().X, self.SelectedRectangle.Y)
    for Index = 1, 9 do
        self.Bar[Index]:Colour(table.unpack(self.Data.Items[self.Data.Pagination.Min + Index]))
    end
    self.Text:Text(self.Data.Title.." ("..CurrentSelection.." of "..#self.Data.Items..")")
end

function UIMenuColourPanel:Functions()

    local SafeZone = {X = 0, Y = 0}
    if self.ParentItem:SetParentMenu().Settings.ScaleWithSafezone then
       SafeZone = GetSafeZoneBounds()
    end


    if IsMouseInBounds(self.LeftArrow.X + SafeZone.X, self.LeftArrow.Y + SafeZone.Y, self.LeftArrow.Width, self.LeftArrow.Height) then
        if IsDisabledControlJustPressed(0, 24) then
            if #self.Data.Items > self.Data.Pagination.Total + 1 then
                if self:CurrentSelection() <= self.Data.Pagination.Min + 1 then
                    if self:CurrentSelection() == 1 then
                        self.Data.Pagination.Min = #self.Data.Items - (self.Data.Pagination.Total + 1)
                        self.Data.Pagination.Max = #self.Data.Items
                        self.Data.Index = 1000 - (1000 % #self.Data.Items)
                        self.Data.Index = self.Data.Index + (#self.Data.Items - 1)
                        self:UpdateSelection()
                    else
                        self.Data.Pagination.Min = self.Data.Pagination.Min - 1
                        self.Data.Pagination.Max = self.Data.Pagination.Max - 1
                        self.Data.Index = self.Data.Index - 1
                        self:UpdateSelection()
                    end
                else
                    self.Data.Index = self.Data.Index - 1
                    self:UpdateSelection()
                end
            else
                self.Data.Index = self.Data.Index - 1
                self:UpdateSelection()
            end
        end
    end

    if IsMouseInBounds(self.RightArrow.X + SafeZone.X, self.RightArrow.Y + SafeZone.Y, self.RightArrow.Width, self.RightArrow.Height) then
        if IsDisabledControlJustPressed(0, 24) then
            if #self.Data.Items > self.Data.Pagination.Total + 1 then
                if self:CurrentSelection() >= self.Data.Pagination.Max then
                    if self:CurrentSelection() == #self.Data.Items then
                        self.Data.Pagination.Min = 0
                        self.Data.Pagination.Max = self.Data.Pagination.Total + 1
                        self.Data.Index = 1000 - (1000 % #self.Data.Items)
                        self:UpdateSelection()
                    else
                        self.Data.Pagination.Max = self.Data.Pagination.Max + 1
                        self.Data.Pagination.Min = self.Data.Pagination.Max - (self.Data.Pagination.Total + 1)
                        self.Data.Index = self.Data.Index + 1
                        self:UpdateSelection()
                    end
                else
                    self.Data.Index = self.Data.Index + 1
                    self:UpdateSelection()
                end
            else
                self.Data.Index = self.Data.Index + 1
                self:UpdateSelection()
            end
        end
    end

    for Index = 1, #self.Bar do
        if IsMouseInBounds(self.Bar[Index].X + SafeZone.X, self.Bar[Index].Y + SafeZone.Y, self.Bar[Index].Width, self.Bar[Index].Height) then
            if IsDisabledControlJustPressed(0, 24) then
                self:CurrentSelection(self.Data.Pagination.Min + Index - 1)
            end
        end
    end
end

function UIMenuColourPanel:Draw() -- required
    if self.Data.Enabled then
        self.Background:Size(431 + self.ParentItem:SetParentMenu().WidthOffset, 112)

        self.Background:Draw()
        self.LeftArrow:Draw()
        self.RightArrow:Draw()
        self.Text:Draw()
        self.SelectedRectangle:Draw()
        for Index = 1, #self.Bar do
            self.Bar[Index]:Draw()
        end
        self:Functions()
    end
end

--[[
    UIMenuPercentagePanel.lua
    Panels
--]]

UIMenuPercentagePanel = setmetatable({}, UIMenuPercentagePanel)
UIMenuPercentagePanel.__index = UIMenuPercentagePanel
UIMenuPercentagePanel.__call = function() return "UIMenuPanel", "UIMenuPercentagePanel" end

function UIMenuPercentagePanel.New(MinText, MaxText)
    _UIMenuPercentagePanel = {
        Data = {
            Enabled = true,
        },
        Background = Sprite.New("commonmenu", "gradient_bgd", 0, 0, 431, 76),
        ActiveBar = UIResRectangle.New(0, 0, 413, 10, 245, 245, 245, 255),
        BackgroundBar = UIResRectangle.New(0, 0, 413, 10, 87, 87, 87, 255),
        Text = {
            Min = UIResText.New(MinText or "0%", 0, 0, 0.35, 255, 255, 255, 255, 0, "Centre"),
            Max = UIResText.New("100%", 0, 0, 0.35, 255, 255, 255, 255, 0, "Centre"),
            Title = UIResText.New(MaxText or "Opacity", 0, 0, 0.35, 255, 255, 255, 255, 0, "Centre"),
        },
        Audio = {Slider = "CONTINUOUS_SLIDER", Library = "HUD_FRONTEND_DEFAULT_SOUNDSET", Id = nil},
        ParentItem = nil,
    }

    return setmetatable(_UIMenuPercentagePanel, UIMenuPercentagePanel)
end

function UIMenuPercentagePanel:SetParentItem(Item) -- required
    if Item() == "UIMenuItem" then
        self.ParentItem = Item
    else
        return self.ParentItem
    end
end

function UIMenuPercentagePanel:Enabled(Enabled)
    if type(Enabled) == "boolean" then
        self.Data.Enabled = Enabled
    else
        return self.Data.Enabled
    end
end

function UIMenuPercentagePanel:Position(Y) -- required
    if tonumber(Y) then
        local ParentOffsetX, ParentOffsetWidth = self.ParentItem:Offset().X, self.ParentItem:SetParentMenu().WidthOffset
        self.Background:Position(ParentOffsetX, Y)
        self.ActiveBar:Position(ParentOffsetX + (ParentOffsetWidth/2) + 9, 50 + Y)
        self.BackgroundBar:Position(ParentOffsetX + (ParentOffsetWidth/2) + 9, 50 + Y)
        self.Text.Min:Position(ParentOffsetX + (ParentOffsetWidth/2) + 25, 15 + Y)
        self.Text.Max:Position(ParentOffsetX + (ParentOffsetWidth/2) + 398, 15 + Y)
        self.Text.Title:Position(ParentOffsetX + (ParentOffsetWidth/2) + 215.5, 15 + Y)
    end
end

function UIMenuPercentagePanel:Percentage(Value)
    if tonumber(Value) then
        local Percent = ((Value < 0.0) and 0.0) or ((Value > 1.0) and 1.0 or Value)
        self.ActiveBar:Size(self.BackgroundBar.Width * Percent, self.ActiveBar.Height)
    else
        local SafeZone = {X = 0, Y = 0}
        if self.ParentItem:SetParentMenu().Settings.ScaleWithSafezone then
           SafeZone = GetSafeZoneBounds()
        end
        
        local Progress = (math.round(GetControlNormal(0, 239) * 1920) - SafeZone.X) - self.ActiveBar.X
        return math.round(((Progress >= 0 and Progress <= 413) and Progress or ((Progress < 0) and 0 or 413))/self.BackgroundBar.Width, 2)
    end
end

function UIMenuPercentagePanel:UpdateParent(Percentage)
    local _, ParentType = self.ParentItem()
    if ParentType == "UIMenuListItem" then
        local PanelItemIndex = self.ParentItem:FindPanelItem()
        if PanelItemIndex then
            self.ParentItem.Items[PanelItemIndex].Value[self.ParentItem:FindPanelIndex(self)] = Percentage
            self.ParentItem:Index(PanelItemIndex)
            self.ParentItem.Base.ParentMenu.OnListChange(self.ParentItem.Base.ParentMenu, self.ParentItem, self.ParentItem._Index)
            self.ParentItem.OnListChanged(self.ParentItem.Base.ParentMenu, self.ParentItem, self.ParentItem._Index)
        else
            local PanelIndex = self.ParentItem:FindPanelIndex(self)
            for Index = 1, #self.ParentItem.Items do
                if type(self.ParentItem.Items[Index]) == "table" then
                    if not self.ParentItem.Items[Index].Panels then self.ParentItem.Items[Index].Panels = {} end
                    self.ParentItem.Items[Index].Panels[PanelIndex] = Percentage
                else
                    self.ParentItem.Items[Index] = {Name = tostring(self.ParentItem.Items[Index]), Value = self.ParentItem.Items[Index], Panels = {[PanelIndex] = Percentage}}
                end
            end
            self.ParentItem.Base.ParentMenu.OnListChange(self.ParentItem.Base.ParentMenu, self.ParentItem, self.ParentItem._Index)
            self.ParentItem.OnListChanged(self.ParentItem.Base.ParentMenu, self.ParentItem, self.ParentItem._Index)     
        end
    elseif ParentType == "UIMenuItem" then
        self.ParentItem.ActivatedPanel(self.ParentItem.ParentMenu, self.ParentItem, self, Percentage)
    end
end

function UIMenuPercentagePanel:Functions()

    local SafeZone = {X = 0, Y = 0}
    if self.ParentItem:SetParentMenu().Settings.ScaleWithSafezone then
       SafeZone = GetSafeZoneBounds()
    end

    if IsMouseInBounds(self.BackgroundBar.X + SafeZone.X, self.BackgroundBar.Y - 4 + SafeZone.Y, self.BackgroundBar.Width, self.BackgroundBar.Height + 8) then
        if IsDisabledControlJustPressed(0, 24) then
            if not self.Pressed then
                self.Pressed = true
                Citizen.CreateThread(function()
                    self.Audio.Id = GetSoundId()
                    PlaySoundFrontend(self.Audio.Id, self.Audio.Slider, self.Audio.Library, 1)
                    while IsDisabledControlPressed(0, 24) and IsMouseInBounds(self.BackgroundBar.X + SafeZone.X, self.BackgroundBar.Y - 4 + SafeZone.Y, self.BackgroundBar.Width, self.BackgroundBar.Height + 8) do
                        Citizen.Wait(0)
                        local Progress = (math.round(GetControlNormal(0, 239) * 1920) - SafeZone.X) - self.ActiveBar.X
                        self.ActiveBar:Size(((Progress >= 0 and Progress <= 413) and Progress or ((Progress < 0) and 0 or 413)), self.ActiveBar.Height)
                    end
                    StopSound(self.Audio.Id)
                    ReleaseSoundId(self.Audio.Id)
                    self.Pressed = false
                end)
                Citizen.CreateThread(function()
                    while IsDisabledControlPressed(0, 24) and IsMouseInBounds(self.BackgroundBar.X + SafeZone.X, self.BackgroundBar.Y - 4 + SafeZone.Y, self.BackgroundBar.Width, self.BackgroundBar.Height + 8) do
                        Citizen.Wait(75)
                        local Progress = (math.round(GetControlNormal(0, 239) * 1920) - SafeZone.X) - self.ActiveBar.X
                        self:UpdateParent(math.round(((Progress >= 0 and Progress <= 413) and Progress or ((Progress < 0) and 0 or 413))/self.BackgroundBar.Width, 2))
                    end
                end)
            end
        end
    end
end

function UIMenuPercentagePanel:Draw() -- required
    if self.Data.Enabled then
        self.Background:Size(431 + self.ParentItem:SetParentMenu().WidthOffset, 76)
        self.Background:Draw()
        self.BackgroundBar:Draw()
        self.ActiveBar:Draw()
        self.Text.Min:Draw()
        self.Text.Max:Draw()
        self.Text.Title:Draw()
        self:Functions()
    end
end

--[[
    UIMenu.lua
    Menus
--]]

function UIMenu.New(Title, Subtitle, X, Y, TxtDictionary, TxtName)
    local X, Y = tonumber(X) or 0, tonumber(Y) or 0
    if Title ~= nil then Title = tostring(Title) or "" else Title = "" end
    if Subtitle ~= nil then Subtitle = tostring(Subtitle) or "" else Subtitle = "" end
    if TxtDictionary ~= nil then TxtDictionary = tostring(TxtDictionary) or "commonmenu" else TxtDictionary = "commonmenu" end
    if TxtName ~= nil then TxtName = tostring(TxtName) or "interaction_bgd" else TxtName = "interaction_bgd" end
    local _UIMenu = {
        Logo = Sprite.New(TxtDictionary, TxtName, 0 + X, 0 + Y, 431, 107),
        Banner = nil,
        Title = UIResText.New(Title, 215 + X, 20 + Y, 1.15, 255, 255, 255, 255, 1, 1),
        Subtitle = {ExtraY = 0},
        WidthOffset = 0,
        Position = {X = X, Y = Y},
        Pagination = {Min = 0, Max = 9, Total = 9},
        PageCounter = {PreText = ""},
        Extra = {},
        Description = {},
        Items = {},
        Windows = {},
        Children = {},
        Controls = {
            Back = {
                Enabled = true,
            },
            Select = {
                Enabled = true,
            },
            Left = {
                Enabled = true,
            },
            Right = {
                Enabled = true,
            },
            Up = {
                Enabled = true,
            },
            Down = {
                Enabled = true,
            },
        },
        ParentMenu = nil,
        ParentItem = nil,
        _Visible = false,
        ActiveItem = 1000,
        Dirty = false;
        ReDraw = true,
        InstructionalScaleform = RequestScaleformMovie("INSTRUCTIONAL_BUTTONS"),
        InstructionalButtons = {},
        OnIndexChange = function(menu, newindex) end,
        OnListChange = function(menu, list, newindex) end,
        OnSliderChange = function(menu, slider, newindex) end,
        OnProgressChange = function(menu, progress, newindex) end,
        OnCheckboxChange = function(menu, item, checked) end,
        OnListSelect = function(menu, list, index) end,
        OnSliderSelect = function(menu, slider, index) end,
        OnProgressSelect = function(menu, progress, index) end,
        OnItemSelect = function(menu, item, index) end,
        OnMenuChanged = function(menu, newmenu, forward) end,
        OnMenuClosed = function(menu) end,
        Settings = {
            InstructionalButtons = true,
            MultilineFormats = true,
            ScaleWithSafezone = true,
            ResetCursorOnOpen = false,
            MouseControlsEnabled = false,
            MouseEdgeEnabled = false,
            ControlDisablingEnabled = true,
            Audio = {
                Library = "HUD_FRONTEND_DEFAULT_SOUNDSET",
                UpDown = "NAV_UP_DOWN",
                LeftRight = "NAV_LEFT_RIGHT",
                Select = "SELECT",
                Back = "BACK",
                Error = "ERROR",
            },
            EnabledControls = {
                Controller = {
                    {0, 2}, -- Look Up and Down
                    {0, 1}, -- Look Left and Right
                    {0, 25}, -- Aim
                    {0, 24}, -- Attack
                },
                Keyboard = {
                    {0, 0}, -- Camera
                    {0, 1}, -- Look Left and Right
                    {0, 2}, -- Look Up and Down
                    {0, 8}, -- Fly Up and Down
                    {0, 9}, -- Fly Left and Right
                    {0, 21}, -- Sprint
                    {0, 22}, -- Jump
                    {0, 23}, -- Enter
                    {0, 24}, -- Attack
                    {0, 25}, -- Aim
                    {0, 26}, -- C
                    {0, 30}, -- Move Left and Right
                    {0, 31}, -- Move Up and Down
                    {0, 47}, -- G
                    {0, 59}, -- Move Vehicle Left and Right
                    {0, 71}, -- Accelerate Vehicle
                    {0, 72}, -- Vehicle Brake
                    {0, 73}, -- X
                    {0, 75}, -- Exit Vehicle
                    {0, 76}, -- Vehicle Handbrake
                    {0, 89}, -- Fly Yaw Left
                    {0, 90}, -- Fly Yaw Right
                    {0, 108}, -- Num Pad 4
                    {0, 109}, -- Num Pad 6
                    {0, 110}, -- Num Pad 5
                    {0, 111}, -- Num Pad 8
                    {0, 117}, -- Num Pad 7
                    {0, 118}, -- Num Pad 9
                    {0, 171}, -- CAPSLOCK
                    {0, 187}, -- Down
                    {0, 188}, -- Up
                    {0, 189}, -- Left
                    {0, 190}, -- Right
                    {0, 195}, -- X axis
                    {0, 196}, -- Y axis
                    {0, 201}, -- Select
                    {0, 202}, -- Back
                    {0, 203},  -- Spacebar?
                    {0, 217}, -- Select
                    {0, 239}, -- Cursor X
                    {0, 240}, -- Cursor Y
                    {0, 241}, -- Scroll up
                    {0, 242}, -- Scroll down
                    {0, 249}, -- N
                    {0, 305}, -- B
                    {0, 306}, -- N
                },
            }
        }
    }

    if Subtitle ~= "" and Subtitle ~= nil then
        _UIMenu.Subtitle.Rectangle = UIResRectangle.New(0 + _UIMenu.Position.X, 107 + _UIMenu.Position.Y, 431, 37, 0, 0, 0, 255)
        _UIMenu.Subtitle.Text = UIResText.New(Subtitle, 8 + _UIMenu.Position.X, 110 + _UIMenu.Position.Y, 0.35, 245, 245, 245, 255, 0)
        _UIMenu.Subtitle.BackupText = Subtitle
        _UIMenu.Subtitle.Formatted = false
        if string.starts(Subtitle, "~") then
            _UIMenu.PageCounter.PreText = string.sub(Subtitle, 1, 3)
        end
        _UIMenu.PageCounter.Text = UIResText.New("", 425 + _UIMenu.Position.X, 110 + _UIMenu.Position.Y, 0.35, 245, 245, 245, 255, 0, "Right")
        _UIMenu.Subtitle.ExtraY = 37
    end
    
    _UIMenu.ArrowSprite = Sprite.New("commonmenu", "shop_arrows_upanddown", 190 + _UIMenu.Position.X, 147 + 37 * (_UIMenu.Pagination.Total + 1) + _UIMenu.Position.Y - 37 + _UIMenu.Subtitle.ExtraY, 50, 50)
    _UIMenu.Extra.Up = UIResRectangle.New(0 + _UIMenu.Position.X, 144 + 38 * (_UIMenu.Pagination.Total + 1) + _UIMenu.Position.Y - 37 + _UIMenu.Subtitle.ExtraY, 431, 18, 0, 0, 0, 200)
    _UIMenu.Extra.Down = UIResRectangle.New(0 + _UIMenu.Position.X, 144 + 18 + 38 * (_UIMenu.Pagination.Total + 1) + _UIMenu.Position.Y - 37 + _UIMenu.Subtitle.ExtraY, 431, 18, 0, 0, 0, 200)

    _UIMenu.Description.Bar = UIResRectangle.New(_UIMenu.Position.X, 123, 431, 4, 0, 0, 0, 255)
    _UIMenu.Description.Rectangle = Sprite.New("commonmenu", "gradient_bgd", _UIMenu.Position.X, 127, 431, 30)
    _UIMenu.Description.Text = UIResText.New("Description", _UIMenu.Position.X + 5, 125, 0.35)

    _UIMenu.Background = Sprite.New("commonmenu", "gradient_bgd", _UIMenu.Position.X, 144 + _UIMenu.Position.Y - 37 + _UIMenu.Subtitle.ExtraY, 290, 25)

    Citizen.CreateThread(function()
        if not HasScaleformMovieLoaded(_UIMenu.InstructionalScaleform) then
            _UIMenu.InstructionalScaleform = RequestScaleformMovie("INSTRUCTIONAL_BUTTONS")
            while not HasScaleformMovieLoaded(_UIMenu.InstructionalScaleform) do
                Citizen.Wait(0)
            end
        end
    end)
    return setmetatable(_UIMenu, UIMenu)
end

function UIMenu:SetMenuWidthOffset(Offset)
    if tonumber(Offset) then
        self.WidthOffset = math.floor(tonumber(Offset))
        self.Logo:Size(431 + self.WidthOffset, 107)
        self.Title:Position(((self.WidthOffset + 431)/2) + self.Position.X, 20 + self.Position.Y)
        if self.Subtitle.Rectangle ~= nil then
            self.Subtitle.Rectangle:Size(431 + self.WidthOffset + 100, 37)            
            self.PageCounter.Text:Position(425 + self.Position.X + self.WidthOffset, 110 + self.Position.Y)
        end
        if self.Banner ~= nil then
            self.Banner:Size(431 + self.WidthOffset, 107)
        end
    end
end

function UIMenu:DisEnableControls(bool)
    if bool then
        EnableAllControlActions(2)
    else
        DisableAllControlActions(2)
    end

    if bool then
        return
    else
        if Controller() then
            for Index = 1, #self.Settings.EnabledControls.Controller do
                EnableControlAction(self.Settings.EnabledControls.Controller[Index][1], self.Settings.EnabledControls.Controller[Index][2], true)
            end
        else
            for Index = 1, #self.Settings.EnabledControls.Keyboard do
                EnableControlAction(self.Settings.EnabledControls.Keyboard[Index][1], self.Settings.EnabledControls.Keyboard[Index][2], true)
            end
        end
    end
end

function UIMenu:InstructionalButtons(bool)
    if bool ~= nil then
        self.Settings.InstrucitonalButtons = tobool(bool)
    end
end

function UIMenu:SetBannerSprite(Sprite, IncludeChildren)
    if Sprite() == "Sprite" then
        self.Logo = Sprite
        self.Logo:Size(431 + self.WidthOffset, 107)
        self.Logo:Position(self.Position.X, self.Position.Y)
        self.Banner = nil
        if IncludeChildren then
            for Item, Menu in pairs(self.Children) do
                Menu.Logo = Sprite
                Menu.Logo:Size(431 + self.WidthOffset, 107)
                Menu.Logo:Position(self.Position.X, self.Position.Y)
                Menu.Banner = nil
            end
        end
    end
end

function UIMenu:SetBannerRectangle(Rectangle, IncludeChildren)
    if Rectangle() == "Rectangle" then
        self.Banner = Rectangle
        self.Banner:Size(431 + self.WidthOffset, 107)
        self.Banner:Position(self.Position.X, self.Position.Y)
        self.Logo = nil
        if IncludeChildren then
            for Item, Menu in pairs(self.Children) do
                Menu.Banner = Rectangle
                Menu.Banner:Size(431 + self.WidthOffset, 107)
                Menu:Position(self.Position.X, self.Position.Y)
                Menu.Logo = nil
            end
        end
    end
end

function UIMenu:CurrentSelection(value)
    if tonumber(value) then
        if #self.Items == 0 then
            self.ActiveItem = 0
        end

        self.Items[self:CurrentSelection()]:Selected(false)
        self.ActiveItem = 1000000 - (1000000 % #self.Items) + tonumber(value)

        if self:CurrentSelection() > self.Pagination.Max then
            self.Pagination.Min = self:CurrentSelection() - self.Pagination.Total
            self.Pagination.Max = self:CurrentSelection()
        elseif self:CurrentSelection() < self.Pagination.Min then
            self.Pagination.Min = self:CurrentSelection()
            self.Pagination.Max = self:CurrentSelection() + self.Pagination.Total
        end 
    else
        if #self.Items == 0 then
            return 1
        else
            if self.ActiveItem % #self.Items == 0 then
                return 1
            else
                return self.ActiveItem % #self.Items + 1
            end
        end
    end
end

function UIMenu:CalculateWindowHeight()
    local Height = 0
    for i = 1, #self.Windows do
        Height = Height + self.Windows[i].Background:Size().Height
    end
    return Height
end

function UIMenu:CalculateItemHeightOffset(Item)
    if Item.Base then
        return Item.Base.Rectangle.Height
    else
        return Item.Rectangle.Height
    end
end

function UIMenu:CalculateItemHeight()
    local ItemOffset = 0 + self.Subtitle.ExtraY - 37
    for i = self.Pagination.Min + 1, self.Pagination.Max do
        local Item = self.Items[i]
        if Item ~= nil then
            ItemOffset = ItemOffset + self:CalculateItemHeightOffset(Item)
        end
    end
    return ItemOffset
end

function UIMenu:RecalculateDescriptionPosition()
    local WindowHeight = self:CalculateWindowHeight()
    self.Description.Bar:Position(self.Position.X, 149 + self.Position.Y + WindowHeight)
    self.Description.Rectangle:Position(self.Position.X, 149 + self.Position.Y + WindowHeight)
    self.Description.Text:Position(self.Position.X + 8, 155 + self.Position.Y + WindowHeight)

    self.Description.Bar:Size(431 + self.WidthOffset, 4)
    self.Description.Rectangle:Size(431 + self.WidthOffset, 30)

    self.Description.Bar:Position(self.Position.X, self:CalculateItemHeight() + ((#self.Items > (self.Pagination.Total + 1)) and 37 or 0) + self.Description.Bar:Position().Y)
    self.Description.Rectangle:Position(self.Position.X, self:CalculateItemHeight() + ((#self.Items > (self.Pagination.Total + 1)) and 37 or 0) + self.Description.Rectangle:Position().Y)
    self.Description.Text:Position(self.Position.X + 8, self:CalculateItemHeight() + ((#self.Items > (self.Pagination.Total + 1)) and 37 or 0) + self.Description.Text:Position().Y)
end

function UIMenu:CaclulatePanelPosition(HasDescription)
    local Height = self:CalculateWindowHeight() + 149 + self.Position.Y

    if HasDescription then
        Height = Height + self.Description.Rectangle:Size().Height + 5
    end

    return self:CalculateItemHeight() + ((#self.Items > (self.Pagination.Total + 1)) and 37 or 0) + Height
end

function UIMenu:AddWindow(Window)
    if Window() == "UIMenuWindow" then
        Window:SetParentMenu(self)
        Window:Offset(self.Position.X, self.Position.Y)
        table.insert(self.Windows, Window)
        self.ReDraw = true
        self:RecalculateDescriptionPosition()
    end
end

function UIMenu:RemoveWindowAt(Index)
    if tonumber(Index) then
        if self.Windows[Index] then
            table.remove(self.Windows, Index)
            self.ReDraw = true
            self:RecalculateDescriptionPosition()
        end
    end
end

function UIMenu:AddItem(Item)
    if Item() == "UIMenuItem" then
        local SelectedItem = self:CurrentSelection()
        Item:SetParentMenu(self)
        Item:Offset(self.Position.X, self.Position.Y)
        Item:Position((#self.Items * 25) - 37 + self.Subtitle.ExtraY)
        table.insert(self.Items, Item)
        self:RecalculateDescriptionPosition()
        self:CurrentSelection(SelectedItem)
    end
end

function UIMenu:RemoveItemAt(Index)
    if tonumber(Index) then
        if self.Items[Index] then
            local SelectedItem = self:CurrentSelection()
            if #self.Items > self.Pagination.Total and self.Pagination.Max == #self.Items - 1 then
                self.Pagination.Min = self.Pagination.Min - 1
                self.Pagination.Max = self.Pagination.Max + 1
            end
            table.remove(self.Items, tonumber(Index))
            self:RecalculateDescriptionPosition()
            self:CurrentSelection(SelectedItem)
        end
    end
end

function UIMenu:RefreshIndex()
    if #self.Items == 0 then
        self.ActiveItem = 1000
        self.Pagination.Max = self.Pagination.Total + 1
        self.Pagination.Min = 0
        return
    end
    self.Items[self:CurrentSelection()]:Selected(false)
    self.ActiveItem = 1000 - (1000 % #self.Items)
    self.Pagination.Max = self.Pagination.Total + 1
    self.Pagination.Min = 0
    self.ReDraw = true
end

function UIMenu:Clear()
    self.Items = {}
    self.ReDraw = true
    self:RecalculateDescriptionPosition()
end

function UIMenu:MultilineFormat(str)
    if tostring(str) then

        local PixelPerLine = 425 + self.WidthOffset
        local AggregatePixels = 0
        local output = ""
        local words = string.split(tostring(str), " ")

        for i = 1, #words do
            local offset = MeasureStringWidth(words[i], 0, 0.35)
            AggregatePixels = AggregatePixels + offset
            if AggregatePixels > PixelPerLine then
                output = output .. "\n" .. words[i] .. " "
                AggregatePixels = offset + MeasureString(" ")
            else
                output = output .. words[i] .. " "
                AggregatePixels = AggregatePixels + MeasureString(" ")
            end
        end
        return output
    end
end

function UIMenu:DrawCalculations()
    local WindowHeight = self:CalculateWindowHeight()

    if self.Settings.MultilineFormats then
        if self.Subtitle.Rectangle and not self.Subtitle.Formatted then
            self.Subtitle.Formatted = true
            self.Subtitle.Text:Text(self:MultilineFormat(self.Subtitle.Text:Text()))

            local Linecount = #string.split(self.Subtitle.Text:Text(), "\n")
            self.Subtitle.ExtraY = ((Linecount == 1) and 37 or ((Linecount + 1) * 22))
            self.Subtitle.Rectangle:Size(431 + self.WidthOffset, self.Subtitle.ExtraY)
        end
    elseif self.Subtitle.Formatted then
        self.Subtitle.Formatted = false
        self.Subtitle.ExtraY = 37
        self.Subtitle.Rectangle:Size(431 + self.WidthOffset, self.Subtitle.ExtraY)
        self.Subtitle.Text:Text(self.Subtitle.BackupText)
    end

    self.Background:Size(431 + self.WidthOffset, self:CalculateItemHeight() + WindowHeight + ((self.Subtitle.ExtraY > 0) and 0 or 37))

    self.Extra.Up:Size(431 + self.WidthOffset, 18)
    self.Extra.Down:Size(431 + self.WidthOffset, 18)

    self.Extra.Up:Position(self.Position.X, 144 + self:CalculateItemHeight() + self.Position.Y + WindowHeight)
    self.Extra.Down:Position(self.Position.X, 144 + 18 + self:CalculateItemHeight() + self.Position.Y + WindowHeight)

    if self.WidthOffset > 0 then
        self.ArrowSprite:Position(190 + self.Position.X + (self.WidthOffset / 2), 137 + self:CalculateItemHeight() + self.Position.Y + WindowHeight)
    else
        self.ArrowSprite:Position(190 + self.Position.X + self.WidthOffset, 137 + self:CalculateItemHeight() + self.Position.Y + WindowHeight)
    end

    self.ReDraw = false

    if #self.Items ~= 0 and self.Items[self:CurrentSelection()]:Description() ~= "" then
        self:RecalculateDescriptionPosition()

        local description = self.Items[self:CurrentSelection()]:Description()
        if self.Settings.MultilineFormats then
            self.Description.Text:Text(self:MultilineFormat(description))
        else
            self.Description.Text:Text(description)
        end

        local Linecount = #string.split(self.Description.Text:Text(), "\n")
        self.Description.Rectangle:Size(431 + self.WidthOffset, ((Linecount == 1) and 37 or ((Linecount + 1) * 22)))
    end
end

function UIMenu:Visible(bool)
    if bool ~= nil then
        self._Visible = tobool(bool)
        self.JustOpened = tobool(bool)
        self.Dirty = tobool(bool)
        self:UpdateScaleform()
        if self.ParentMenu ~= nil or tobool(bool) == false then
            return
        end
        if self.Settings.ResetCursorOnOpen then
            local W, H = GetScreenResolution()
            SetCursorLocation(W / 2, H / 2)
            SetCursorSprite(1)
        end
    else
        return self._Visible
    end
end

function UIMenu:ProcessControl()
    if not self._Visible then
        return
    end

    if self.JustOpened then
        self.JustOpened = false
        return
    end

    if self.Controls.Back.Enabled and (IsDisabledControlJustReleased(0, 177) or IsDisabledControlJustReleased(1, 177) or IsDisabledControlJustReleased(2, 177) or IsDisabledControlJustReleased(0, 199) or IsDisabledControlJustReleased(1, 199) or IsDisabledControlJustReleased(2, 199)) then
        self:GoBack()
    end
    
    if #self.Items == 0 then
        return
    end

    if not self.UpPressed then
        if self.Controls.Up.Enabled and (IsDisabledControlJustPressed(0, 172) or IsDisabledControlJustPressed(1, 172) or IsDisabledControlJustPressed(2, 172) or IsDisabledControlJustPressed(0, 241) or IsDisabledControlJustPressed(1, 241) or IsDisabledControlJustPressed(2, 241) or IsDisabledControlJustPressed(2, 241)) then
            Citizen.CreateThread(function()
                self.UpPressed = true
                if #self.Items > self.Pagination.Total + 1 then
                    self:GoUpOverflow()
                else
                    self:GoUp()
                end
                self:UpdateScaleform()
                Citizen.Wait(120)
                while self.Controls.Up.Enabled and (IsDisabledControlPressed(0, 172) or IsDisabledControlPressed(1, 172) or IsDisabledControlPressed(2, 172) or IsDisabledControlPressed(0, 241) or IsDisabledControlPressed(1, 241) or IsDisabledControlPressed(2, 241) or IsDisabledControlPressed(2, 241)) do
                    if #self.Items > self.Pagination.Total + 1 then
                        self:GoUpOverflow()
                    else
                        self:GoUp()
                    end
                    self:UpdateScaleform()
                    Citizen.Wait(50)
                end
                self.UpPressed = false
            end)
        end
    end

    if not self.DownPressed then
        if self.Controls.Down.Enabled and (IsDisabledControlJustPressed(0, 173) or IsDisabledControlJustPressed(1, 173) or IsDisabledControlJustPressed(2, 173) or IsDisabledControlJustPressed(0, 242) or IsDisabledControlJustPressed(1, 242) or IsDisabledControlJustPressed(2, 242)) then
            Citizen.CreateThread(function()
                self.DownPressed = true
                if #self.Items > self.Pagination.Total + 1 then
                    self:GoDownOverflow()
                else
                    self:GoDown()
                end
                self:UpdateScaleform()
                Citizen.Wait(120)
                while self.Controls.Down.Enabled and (IsDisabledControlPressed(0, 173) or IsDisabledControlPressed(1, 173) or IsDisabledControlPressed(2, 173) or IsDisabledControlPressed(0, 242) or IsDisabledControlPressed(1, 242) or IsDisabledControlPressed(2, 242)) do
                    if #self.Items > self.Pagination.Total + 1 then
                        self:GoDownOverflow()
                    else
                        self:GoDown()
                    end
                    self:UpdateScaleform()
                    Citizen.Wait(50)
                end
                self.DownPressed = false
            end)
        end
    end

    if not self.LeftPressed then
        if self.Controls.Left.Enabled and (IsDisabledControlPressed(0, 174) or IsDisabledControlPressed(1, 174) or IsDisabledControlPressed(2, 174)) then
            Citizen.CreateThread(function()
                self.LeftPressed = true
                self:GoLeft()
                Citizen.Wait(175)
                while self.Controls.Left.Enabled and (IsDisabledControlPressed(0, 174) or IsDisabledControlPressed(1, 174) or IsDisabledControlPressed(2, 174)) do
                    self:GoLeft()
                    Citizen.Wait(125)
                end
                self.LeftPressed = false
            end)
        end
    end

    if not self.RightPressed then
        if self.Controls.Right.Enabled and (IsDisabledControlPressed(0, 175) or IsDisabledControlPressed(1, 175) or IsDisabledControlPressed(2, 175)) then
            Citizen.CreateThread(function()
                self.RightPressed = true
                self:GoRight()
                Citizen.Wait(175)
                while self.Controls.Right.Enabled and (IsDisabledControlPressed(0, 175) or IsDisabledControlPressed(1, 175) or IsDisabledControlPressed(2, 175)) do
                    self:GoRight()
                    Citizen.Wait(125)
                end
                self.RightPressed = false
            end)
        end
    end

    if self.Controls.Select.Enabled and (IsDisabledControlJustPressed(0, 201) or IsDisabledControlJustPressed(1, 201) or IsDisabledControlJustPressed(2, 201)) then
        self:SelectItem()
    end
end

function UIMenu:GoUpOverflow()
    if #self.Items <= self.Pagination.Total + 1 then
        return
    end

    if self:CurrentSelection() <= self.Pagination.Min + 1 then
        if self:CurrentSelection() == 1 then
            self.Pagination.Min = #self.Items - (self.Pagination.Total + 1)
            self.Pagination.Max = #self.Items
            self.Items[self:CurrentSelection()]:Selected(false)
            self.ActiveItem = 1000 - (1000 % #self.Items)
            self.ActiveItem = self.ActiveItem + (#self.Items - 1)
            self.Items[self:CurrentSelection()]:Selected(true)
        else
            self.Pagination.Min = self.Pagination.Min - 1
            self.Pagination.Max = self.Pagination.Max - 1
            self.Items[self:CurrentSelection()]:Selected(false)
            self.ActiveItem = self.ActiveItem - 1
            self.Items[self:CurrentSelection()]:Selected(true)
        end
    else
        self.Items[self:CurrentSelection()]:Selected(false)
        self.ActiveItem = self.ActiveItem - 1
        self.Items[self:CurrentSelection()]:Selected(true)
    end
    PlaySoundFrontend(-1, self.Settings.Audio.UpDown, self.Settings.Audio.Library, true)
    self.OnIndexChange(self, self:CurrentSelection())
    self.ReDraw = true
end

function UIMenu:GoUp()
    if #self.Items > self.Pagination.Total + 1 then
        return
    end
    self.Items[self:CurrentSelection()]:Selected(false)
    self.ActiveItem = self.ActiveItem - 1
    self.Items[self:CurrentSelection()]:Selected(true)
    PlaySoundFrontend(-1, self.Settings.Audio.UpDown, self.Settings.Audio.Library, true)
    self.OnIndexChange(self, self:CurrentSelection())
    self.ReDraw = true
end

function UIMenu:GoDownOverflow()
    if #self.Items <= self.Pagination.Total + 1 then
        return
    end

    if self:CurrentSelection() >= self.Pagination.Max then
        if self:CurrentSelection() == #self.Items then
            self.Pagination.Min = 0
            self.Pagination.Max = self.Pagination.Total + 1
            self.Items[self:CurrentSelection()]:Selected(false)
            self.ActiveItem = 1000 - (1000 % #self.Items)
            self.Items[self:CurrentSelection()]:Selected(true)
        else
            self.Pagination.Max = self.Pagination.Max + 1
            self.Pagination.Min = self.Pagination.Max - (self.Pagination.Total + 1)
            self.Items[self:CurrentSelection()]:Selected(false)
            self.ActiveItem = self.ActiveItem + 1
            self.Items[self:CurrentSelection()]:Selected(true)            
        end
    else
        self.Items[self:CurrentSelection()]:Selected(false)
        self.ActiveItem = self.ActiveItem + 1
        self.Items[self:CurrentSelection()]:Selected(true)
    end
    PlaySoundFrontend(-1, self.Settings.Audio.UpDown, self.Settings.Audio.Library, true)
    self.OnIndexChange(self, self:CurrentSelection())
    self.ReDraw = true
end

function UIMenu:GoDown()
    if #self.Items > self.Pagination.Total + 1 then
        return
    end

    self.Items[self:CurrentSelection()]:Selected(false)
    self.ActiveItem = self.ActiveItem + 1
    self.Items[self:CurrentSelection()]:Selected(true) 
    PlaySoundFrontend(-1, self.Settings.Audio.UpDown, self.Settings.Audio.Library, true)
    self.OnIndexChange(self, self:CurrentSelection())
    self.ReDraw = true
end

function UIMenu:GoLeft()
    local type, subtype = self.Items[self:CurrentSelection()]()
    if subtype ~= "UIMenuListItem" and subtype ~= "UIMenuSliderItem" and subtype ~= "UIMenuProgressItem" then
        return
    end

    if not self.Items[self:CurrentSelection()]:Enabled() then
        PlaySoundFrontend(-1, self.Settings.Audio.Error, self.Settings.Audio.Library, true)
        return
    end
    
    if subtype == "UIMenuListItem" then
        local Item = self.Items[self:CurrentSelection()]
        Item:Index(Item._Index - 1)
        self.OnListChange(self, Item, Item._Index)
        Item.OnListChanged(self, Item, Item._Index)
        PlaySoundFrontend(-1, self.Settings.Audio.LeftRight, self.Settings.Audio.Library, true)
    elseif subtype == "UIMenuSliderItem" then
        local Item = self.Items[self:CurrentSelection()]
        Item:Index(Item._Index - 1)
        self.OnSliderChange(self, Item, Item:Index())
        Item.OnSliderChanged(self, Item, Item._Index)
        PlaySoundFrontend(-1, self.Settings.Audio.LeftRight, self.Settings.Audio.Library, true)
    elseif subtype == "UIMenuProgressItem" then
        local Item = self.Items[self:CurrentSelection()]
        Item:Index(Item.Data.Index - 1)
        self.OnProgressChange(self, Item, Item.Data.Index)
        Item.OnProgressChanged(self, Item, Item.Data.Index)
        PlaySoundFrontend(-1, self.Settings.Audio.LeftRight, self.Settings.Audio.Library, true)
    end
end

function UIMenu:GoRight()
    local type, subtype = self.Items[self:CurrentSelection()]()
    if subtype ~= "UIMenuListItem" and subtype ~= "UIMenuSliderItem" and subtype ~= "UIMenuProgressItem" then
        return
    end

    if not self.Items[self:CurrentSelection()]:Enabled() then
        PlaySoundFrontend(-1, self.Settings.Audio.Error, self.Settings.Audio.Library, true)
        return
    end

    if subtype == "UIMenuListItem" then
        local Item = self.Items[self:CurrentSelection()]
        Item:Index(Item._Index + 1)
        self.OnListChange(self, Item, Item._Index)
        Item.OnListChanged(self, Item, Item._Index)
        PlaySoundFrontend(-1, self.Settings.Audio.LeftRight, self.Settings.Audio.Library, true)
    elseif subtype == "UIMenuSliderItem" then
        local Item = self.Items[self:CurrentSelection()]
        Item:Index(Item._Index + 1)
        self.OnSliderChange(self, Item, Item:Index())
        Item.OnSliderChanged(self, Item, Item._Index)
        PlaySoundFrontend(-1, self.Settings.Audio.LeftRight, self.Settings.Audio.Library, true)
    elseif subtype == "UIMenuProgressItem" then
        local Item = self.Items[self:CurrentSelection()]
        Item:Index(Item.Data.Index + 1)
        self.OnProgressChange(self, Item, Item.Data.Index)
        Item.OnProgressChanged(self, Item, Item.Data.Index)
        PlaySoundFrontend(-1, self.Settings.Audio.LeftRight, self.Settings.Audio.Library, true)
    end
end

function UIMenu:SelectItem()
    if not self.Items[self:CurrentSelection()]:Enabled() then
        PlaySoundFrontend(-1, self.Settings.Audio.Error, self.Settings.Audio.Library, true)
        return
    end
    local Item = self.Items[self:CurrentSelection()]
    local type, subtype = Item()
    if subtype == "UIMenuCheckboxItem" then
        Item.Checked = not Item.Checked
        PlaySoundFrontend(-1, self.Settings.Audio.Select, self.Settings.Audio.Library, true)
        self.OnCheckboxChange(self, Item, Item.Checked)
        Item.CheckboxEvent(self, Item, Item.Checked)
    elseif subtype == "UIMenuListItem" then
        PlaySoundFrontend(-1, self.Settings.Audio.Select, self.Settings.Audio.Library, true)
        self.OnListSelect(self, Item, Item._Index)
        Item.OnListSelected(self, Item, Item._Index)
    elseif subtype == "UIMenuSliderItem" then
        PlaySoundFrontend(-1, self.Settings.Audio.Select, self.Settings.Audio.Library, true)
        self.OnSliderSelect(self, Item, Item._Index)
        Item.OnSliderSelected(Item._Index)
    elseif subtype == "UIMenuProgressItem" then
        PlaySoundFrontend(-1, self.Settings.Audio.Select, self.Settings.Audio.Library, true)
        self.OnProgressSelect(self, Item, Item.Data.Index)
        Item.OnProgressSelected(Item.Data.Index)        
    else
        PlaySoundFrontend(-1, self.Settings.Audio.Select, self.Settings.Audio.Library, true)
        self.OnItemSelect(self, Item, self:CurrentSelection())
        Item.Activated(self, Item)
        if not self.Children[Item] then
            return
        end
        self:Visible(false)
        self.Children[Item]:Visible(true)
        self.OnMenuChanged(self, self.Children[self.Items[self:CurrentSelection()]], true)
    end
end

function UIMenu:GoBack()
    PlaySoundFrontend(-1, self.Settings.Audio.Back, self.Settings.Audio.Library, true)
    self:Visible(false)
    if self.ParentMenu ~= nil then
        self.ParentMenu:Visible(true)
        self.OnMenuChanged(self, self.ParentMenu, false)
        if self.Settings.ResetCursorOnOpen then
            local W, H = GetActiveScreenResolution()
            SetCursorLocation(W / 2, H / 2)
        end
    end
    self.OnMenuClosed(self)
end

function UIMenu:BindMenuToItem(Menu, Item)
    if Menu() == "UIMenu" and Item() == "UIMenuItem" then
        Menu.ParentMenu = self
        Menu.ParentItem = Item
        self.Children[Item] = Menu
    end
end

function UIMenu:ReleaseMenuFromItem(Item)
    if Item() == "UIMenuItem" then
        if not self.Children[Item] then
            return false
        end
        self.Children[Item].ParentMenu = nil
        self.Children[Item].ParentItem = nil
        self.Children[Item] = nil
        return true
    end
end

function UIMenu:Draw()
    if not self._Visible then
        return
    end

    HideHudComponentThisFrame(19)

    if self.Settings.ControlDisablingEnabled then
        self:DisEnableControls(false)
    end

    if self.Settings.InstructionalButtons then
        DrawScaleformMovieFullscreen(self.InstructionalScaleform, 255, 255, 255, 255, 0)
    end

    if self.Settings.ScaleWithSafezone then
        ScreenDrawPositionBegin(76, 84)
        ScreenDrawPositionRatio(0, 0, 0, 0)
    end

    if self.ReDraw then
        self:DrawCalculations()
    end

    if self.Logo then
        self.Logo:Draw()
    elseif self.Banner then
        self.Banner:Draw()
    end

    self.Title:Draw()

    if self.Subtitle.Rectangle then
        self.Subtitle.Rectangle:Draw()
        self.Subtitle.Text:Draw()
    end

    if #self.Items ~= 0 or #self.Windows ~= 0 then
        self.Background:Draw()
    end

    if #self.Windows ~= 0 then
        local WindowOffset = 0
        for index = 1, #self.Windows do
            if self.Windows[index - 1] then 
                WindowOffset = WindowOffset + self.Windows[index - 1].Background:Size().Height 
            end
            local Window = self.Windows[index]
            Window:Position(WindowOffset + self.Subtitle.ExtraY - 37)
            Window:Draw()
        end
    end

    if #self.Items == 0 then
        if self.Settings.ScaleWithSafezone then
            ScreenDrawPositionEnd()
        end
        return
    end

    local CurrentSelection = self:CurrentSelection()
    self.Items[CurrentSelection]:Selected(true)

    if self.Items[CurrentSelection]:Description() ~= "" then
        self.Description.Bar:Draw()
        self.Description.Rectangle:Draw()
        self.Description.Text:Draw()
    end

    if self.Items[CurrentSelection].Panels ~= nil then
        if #self.Items[CurrentSelection].Panels ~= 0 then
            local PanelOffset = self:CaclulatePanelPosition(self.Items[CurrentSelection]:Description() ~= "")
            for index = 1, #self.Items[CurrentSelection].Panels do
                if self.Items[CurrentSelection].Panels[index - 1] then 
                    PanelOffset = PanelOffset + self.Items[CurrentSelection].Panels[index - 1].Background:Size().Height + 5
                end
                self.Items[CurrentSelection].Panels[index]:Position(PanelOffset)
                self.Items[CurrentSelection].Panels[index]:Draw()
            end
        end
    end

    local WindowHeight = self:CalculateWindowHeight()

    if #self.Items <= self.Pagination.Total + 1 then
        local ItemOffset = self.Subtitle.ExtraY - 37 + WindowHeight
        for index = 1, #self.Items do
            Item = self.Items[index]
            Item:Position(ItemOffset)
            Item:Draw()
            ItemOffset = ItemOffset + self:CalculateItemHeightOffset(Item)
        end
    else
        local ItemOffset = self.Subtitle.ExtraY - 37 + WindowHeight
        for index = self.Pagination.Min + 1, self.Pagination.Max, 1 do
            if self.Items[index] then
                Item = self.Items[index]
                Item:Position(ItemOffset)
                Item:Draw()
                ItemOffset = ItemOffset + self:CalculateItemHeightOffset(Item)
            end
        end

        self.Extra.Up:Draw()
        self.Extra.Down:Draw()
        self.ArrowSprite:Draw()

        if self.PageCounter.Text ~= nil then
            local Caption = self.PageCounter.PreText .. CurrentSelection .. " / " .. #self.Items
            self.PageCounter.Text:Text(Caption)
            self.PageCounter.Text:Draw()
        end
    end

    if self.Settings.ScaleWithSafezone then
        ScreenDrawPositionEnd()
    end
end

function UIMenu:ProcessMouse()
    if not self._Visible or self.JustOpened or #self.Items == 0 or tobool(Controller()) or not self.Settings.MouseControlsEnabled then
        EnableControlAction(0, 2, true)
        EnableControlAction(0, 1, true)
        EnableControlAction(0, 25, true)
        EnableControlAction(0, 24, true)
        if self.Dirty then
            for _, Item in pairs(self.Items) do
                if Item:Hovered() then
                    Item:Hovered(false)
                end
            end
        end
        return
    end

    local SafeZone = {X = 0, Y = 0}
    local WindowHeight = self:CalculateWindowHeight()
    if self.Settings.ScaleWithSafezone then
       SafeZone = GetSafeZoneBounds()
    end

    local Limit = #self.Items
    local ItemOffset = 0

    ShowCursorThisFrame()

    if #self.Items > self.Pagination.Total + 1 then
        Limit = self.Pagination.Max
    end

    if IsMouseInBounds(0, 0, 30, 1080) and self.Settings.MouseEdgeEnabled then
        SetGameplayCamRelativeHeading(GetGameplayCamRelativeHeading() + 5)
        SetCursorSprite(6)
    elseif IsMouseInBounds(1920 - 30, 0, 30, 1080) and self.Settings.MouseEdgeEnabled then
        SetGameplayCamRelativeHeading(GetGameplayCamRelativeHeading() - 5)
        SetCursorSprite(7)  
    elseif self.Settings.MouseEdgeEnabled then
        SetCursorSprite(1)
    end

    for i = self.Pagination.Min + 1, Limit, 1 do
        local X, Y = self.Position.X + SafeZone.X, self.Position.Y + 144 - 37 + self.Subtitle.ExtraY + ItemOffset + SafeZone.Y + WindowHeight
        local Item = self.Items[i]
        local Type, SubType = Item()
        local Width, Height = 431 + self.WidthOffset, self:CalculateItemHeightOffset(Item)

        if IsMouseInBounds(X, Y, Width, Height) then
            Item:Hovered(true)
            if not self.Controls.MousePressed then
                if IsDisabledControlJustPressed(0, 24) then
                    Citizen.CreateThread(function()
                        local _X, _Y, _Width, _Height = X, Y, Width, Height
                        self.Controls.MousePressed = true
                        if Item:Selected() and Item:Enabled() then
                            if SubType == "UIMenuListItem" then
                                if IsMouseInBounds(Item.LeftArrow.X + SafeZone.X, Item.LeftArrow.Y + SafeZone.Y, Item.LeftArrow.Width, Item.LeftArrow.Height) then
                                    self:GoLeft()
                                elseif not IsMouseInBounds(Item.RightArrow.X + SafeZone.X, Item.RightArrow.Y + SafeZone.Y, Item.RightArrow.Width, Item.RightArrow.Height) then
                                    self:SelectItem()
                                end
                                if IsMouseInBounds(Item.RightArrow.X + SafeZone.X, Item.RightArrow.Y + SafeZone.Y, Item.RightArrow.Width, Item.RightArrow.Height) then
                                    self:GoRight()
                                elseif not IsMouseInBounds(Item.LeftArrow.X + SafeZone.X, Item.LeftArrow.Y + SafeZone.Y, Item.LeftArrow.Width, Item.LeftArrow.Height) then
                                    self:SelectItem()
                                end
                            elseif SubType == "UIMenuSliderItem" then
                                if IsMouseInBounds(Item.LeftArrow.X + SafeZone.X, Item.LeftArrow.Y + SafeZone.Y, Item.LeftArrow.Width, Item.LeftArrow.Height) then
                                    self:GoLeft()
                                elseif not IsMouseInBounds(Item.RightArrow.X + SafeZone.X, Item.RightArrow.Y + SafeZone.Y, Item.RightArrow.Width, Item.RightArrow.Height) then
                                    self:SelectItem()
                                end
                                if IsMouseInBounds(Item.RightArrow.X + SafeZone.X, Item.RightArrow.Y + SafeZone.Y, Item.RightArrow.Width, Item.RightArrow.Height) then
                                    self:GoRight()
                                elseif not IsMouseInBounds(Item.LeftArrow.X + SafeZone.X, Item.LeftArrow.Y + SafeZone.Y, Item.LeftArrow.Width, Item.LeftArrow.Height) then
                                    self:SelectItem()
                                end
                            elseif SubType == "UIMenuProgressItem" then
                                if IsMouseInBounds(Item.Bar.X + SafeZone.X, Item.Bar.Y + SafeZone.Y - 12, Item.Data.Max, Item.Bar.Height + 24) then
                                    Item:CalculateProgress(math.round(GetControlNormal(0, 239) * 1920) - SafeZone.X)
                                    self.OnProgressChange(self, Item, Item.Data.Index)
                                    Item.OnProgressChanged(self, Item, Item.Data.Index)
                                else
                                    self:SelectItem()
                                end
                            else
                                self:SelectItem()
                            end
                        elseif not Item:Selected() then
                            self:CurrentSelection(i-1)
                            PlaySoundFrontend(-1, self.Settings.Audio.Error, self.Settings.Audio.Library, true)
                            self.OnIndexChange(self, self:CurrentSelection())
                            self.ReDraw = true
                            self:UpdateScaleform()
                        elseif not Item:Enabled() and Item:Selected() then
                            PlaySoundFrontend(-1, self.Settings.Audio.Error, self.Settings.Audio.Library, true)
                        end
                        Citizen.Wait(175)
                        while IsDisabledControlPressed(0, 24) and IsMouseInBounds(_X, _Y, _Width, _Height) do
                            if Item:Selected() and Item:Enabled() then
                                if SubType == "UIMenuListItem" then
                                    if IsMouseInBounds(Item.LeftArrow.X + SafeZone.X, Item.LeftArrow.Y + SafeZone.Y, Item.LeftArrow.Width, Item.LeftArrow.Height) then
                                        self:GoLeft()
                                    end
                                    if IsMouseInBounds(Item.RightArrow.X + SafeZone.X, Item.RightArrow.Y + SafeZone.Y, Item.RightArrow.Width, Item.RightArrow.Height) then
                                        self:GoRight()
                                    end
                                elseif SubType == "UIMenuSliderItem" then
                                    if IsMouseInBounds(Item.LeftArrow.X + SafeZone.X, Item.LeftArrow.Y + SafeZone.Y, Item.LeftArrow.Width, Item.LeftArrow.Height) then
                                        self:GoLeft()
                                    end
                                    if IsMouseInBounds(Item.RightArrow.X + SafeZone.X, Item.RightArrow.Y + SafeZone.Y, Item.RightArrow.Width, Item.RightArrow.Height) then
                                        self:GoRight()
                                    end
                                elseif SubType == "UIMenuProgressItem" then
                                    if IsMouseInBounds(Item.Bar.X + SafeZone.X, Item.Bar.Y + SafeZone.Y - 12, Item.Data.Max, Item.Bar.Height + 24) then
                                        Item:CalculateProgress(math.round(GetControlNormal(0, 239) * 1920) - SafeZone.X)
                                        self.OnProgressChange(self, Item, Item.Data.Index)
                                        Item.OnProgressChanged(self, Item, Item.Data.Index)
                                    else
                                        self:SelectItem()
                                    end
                                end
                            elseif not Item:Selected() then
                                self:CurrentSelection(i-1)
                                PlaySoundFrontend(-1, self.Settings.Audio.Error, self.Settings.Audio.Library, true)
                                self.OnIndexChange(self, self:CurrentSelection())
                                self.ReDraw = true
                                self:UpdateScaleform()
                            elseif not Item:Enabled() and Item:Selected() then
                                PlaySoundFrontend(-1, self.Settings.Audio.Error, self.Settings.Audio.Library, true)
                            end
                            Citizen.Wait(125)                       
                        end
                        self.Controls.MousePressed = false
                    end)
                end
            end
        else
            Item:Hovered(false)
        end
        ItemOffset = ItemOffset + self:CalculateItemHeightOffset(Item)
    end

    local ExtraX, ExtraY = self.Position.X + SafeZone.X, 144 + self:CalculateItemHeight() + self.Position.Y + SafeZone.Y + WindowHeight

    if #self.Items <= self.Pagination.Total + 1 then return end

    if IsMouseInBounds(ExtraX, ExtraY, 431 + self.WidthOffset, 18) then
        self.Extra.Up:Colour(30, 30, 30, 255)
        if not self.Controls.MousePressed then
            if IsDisabledControlJustPressed(0, 24) then
                Citizen.CreateThread(function()
                    local _ExtraX, _ExtraY = ExtraX, ExtraY
                    self.Controls.MousePressed = true
                    if #self.Items > self.Pagination.Total + 1 then
                        self:GoUpOverflow()
                    else
                        self:GoUp()
                    end
                    Citizen.Wait(175)
                    while IsDisabledControlPressed(0, 24) and IsMouseInBounds(_ExtraX, _ExtraY, 431 + self.WidthOffset, 18) do
                        if #self.Items > self.Pagination.Total + 1 then
                            self:GoUpOverflow()
                        else
                            self:GoUp()
                        end
                        Citizen.Wait(125)
                    end
                    self.Controls.MousePressed = false              
                end)
            end
        end
    else
        self.Extra.Up:Colour(0, 0, 0, 200)
    end

    if IsMouseInBounds(ExtraX, ExtraY + 18, 431 + self.WidthOffset, 18) then
        self.Extra.Down:Colour(30, 30, 30, 255)
        if not self.Controls.MousePressed then
            if IsDisabledControlJustPressed(0, 24) then
                Citizen.CreateThread(function()
                    local _ExtraX, _ExtraY = ExtraX, ExtraY
                    self.Controls.MousePressed = true
                    if #self.Items > self.Pagination.Total + 1 then
                        self:GoDownOverflow()
                    else
                        self:GoDown()
                    end
                    Citizen.Wait(175)
                    while IsDisabledControlPressed(0, 24) and IsMouseInBounds(_ExtraX, _ExtraY + 18, 431 + self.WidthOffset, 18) do
                        if #self.Items > self.Pagination.Total + 1 then
                            self:GoDownOverflow()
                        else
                            self:GoDown()
                        end
                        Citizen.Wait(125)
                    end
                    self.Controls.MousePressed = false              
                end)
            end
        end
    else
        self.Extra.Down:Colour(0, 0, 0, 200)
    end
end

function UIMenu:AddInstructionButton(button)
    if type(button) == "table" and #button == 2 then
        table.insert(self.InstructionalButtons, button)
    end
end

function UIMenu:RemoveInstructionButton(button)
    if type(button) == "table" then
        for i = 1, #self.InstructionalButtons do
            if button == self.InstructionalButtons[i] then
                table.remove(self.InstructionalButtons, i)
                break
            end
        end
    else
        if tonumber(button) then
            if self.InstructionalButtons[tonumber(button)] then
                table.remove(self.InstructionalButtons, tonumber(button))
            end
        end
    end
end

function UIMenu:AddEnabledControl(Inputgroup, Control, Controller)
    if tonumber(Inputgroup) and tonumber(Control) then
        table.insert(self.Settings.EnabledControls[(Controller and "Controller" or "Keyboard")], {Inputgroup, Control})
    end
end

function UIMenu:RemoveEnabledControl(Inputgroup, Control, Controller)
    local Type = (Controller and "Controller" or "Keyboard")
    for Index = 1, #self.Settings.EnabledControls[Type] do
        if Inputgroup == self.Settings.EnabledControls[Type][Index][1] and Control == self.Settings.EnabledControls[Type][Index][2] then
            table.remove(self.Settings.EnabledControls[Type], Index)
            break
        end
    end
end

function UIMenu:UpdateScaleform()
    if not self._Visible or not self.Settings.InstructionalButtons then
        return
    end
    
    PushScaleformMovieFunction(self.InstructionalScaleform, "CLEAR_ALL")
    PopScaleformMovieFunction()

    PushScaleformMovieFunction(self.InstructionalScaleform, "TOGGLE_MOUSE_BUTTONS")
    PushScaleformMovieFunctionParameterInt(0)
    PopScaleformMovieFunction()

    PushScaleformMovieFunction(self.InstructionalScaleform, "CREATE_CONTAINER")
    PopScaleformMovieFunction()

    PushScaleformMovieFunction(self.InstructionalScaleform, "SET_DATA_SLOT")
    PushScaleformMovieFunctionParameterInt(0)
    PushScaleformMovieFunctionParameterString(GetControlInstructionalButton(2, 176, 0))
    PushScaleformMovieFunctionParameterString("Select")
    PopScaleformMovieFunction()

    if self.Controls.Back.Enabled then
        PushScaleformMovieFunction(self.InstructionalScaleform, "SET_DATA_SLOT")
        PushScaleformMovieFunctionParameterInt(1)
        PushScaleformMovieFunctionParameterString(GetControlInstructionalButton(2, 177, 0))
        PushScaleformMovieFunctionParameterString("Back")
        PopScaleformMovieFunction()
    end

    local count = 2

    for i = 1, #self.InstructionalButtons do
        if self.InstructionalButtons[i] then
            if #self.InstructionalButtons[i] == 2 then
                PushScaleformMovieFunction(self.InstructionalScaleform, "SET_DATA_SLOT")
                PushScaleformMovieFunctionParameterInt(count)
                PushScaleformMovieFunctionParameterString(self.InstructionalButtons[i][1])
                PushScaleformMovieFunctionParameterString(self.InstructionalButtons[i][2])
                PopScaleformMovieFunction()
                count = count + 1
            end
        end
    end

    PushScaleformMovieFunction(self.InstructionalScaleform, "DRAW_INSTRUCTIONAL_BUTTONS")
    PushScaleformMovieFunctionParameterInt(-1)
    PopScaleformMovieFunction()
end

--[[
    MenuPool.lua
    Menus
--]]

function MenuPool.New()
    local _MenuPool = {
        Menus = {}
    }
    return setmetatable(_MenuPool, MenuPool)
end

function MenuPool:AddSubMenu(Menu, Text, Description, KeepPosition, KeepBanner)
    if Menu() == "UIMenu" then
        local Item = UIMenuItem.New(tostring(Text), Description or "")
        Menu:AddItem(Item)
        local SubMenu
        if KeepPosition then
            SubMenu = UIMenu.New(Menu.Title:Text(), Text, Menu.Position.X, Menu.Position.Y)
        else
            SubMenu = UIMenu.New(Menu.Title:Text(), Text)
        end
        if KeepBanner then
            if Menu.Logo ~= nil then
                SubMenu.Logo = Menu.Logo
            else
                SubMenu.Logo = nil
                SubMenu.Banner = Menu.Banner
            end
        end
        self:Add(SubMenu)
        Menu:BindMenuToItem(SubMenu, Item)
        return SubMenu
    end
end

function MenuPool:Add(Menu)
    if Menu() == "UIMenu" then
        table.insert(self.Menus, Menu)
    end
end

function MenuPool:Clear()
	self = {
		Menus = {}
	 }
end

function MenuPool:Remove()
	self = nil
end

function MenuPool:MouseEdgeEnabled(bool)
    if bool ~= nil then
        for _, Menu in pairs(self.Menus) do
            Menu.Settings.MouseEdgeEnabled = tobool(bool)
        end
    end
end

function MenuPool:ControlDisablingEnabled(bool)
    if bool ~= nil then
        for _, Menu in pairs(self.Menus) do
            Menu.Settings.ControlDisablingEnabled = tobool(bool)
        end
    end
end

function MenuPool:ResetCursorOnOpen(bool)
    if bool ~= nil then
        for _, Menu in pairs(self.Menus) do
            Menu.Settings.ResetCursorOnOpen = tobool(bool)
        end
    end
end

function MenuPool:MultilineFormats(bool)
    if bool ~= nil then
        for _, Menu in pairs(self.Menus) do
            Menu.Settings.MultilineFormats = tobool(bool)
        end
    end
end

function MenuPool:Audio(Attribute, Setting)
    if Attribute ~= nil and Setting ~= nil then
        for _, Menu in pairs(self.Menus) do
            if Menu.Settings.Audio[Attribute] then
                Menu.Settings.Audio[Attribute] = Setting
            end
        end
    end
end

function MenuPool:WidthOffset(offset)
    if tonumber(offset) then
        for _, Menu in pairs(self.Menus) do
            Menu:SetMenuWidthOffset(tonumber(offset))
        end
    end
end

function MenuPool:CounterPreText(str)
    if str ~= nil then
        for _, Menu in pairs(self.Menus) do
            Menu.PageCounter.PreText = tostring(str)
        end
    end
end

function MenuPool:DisableInstructionalButtons(bool)
    if bool ~= nil then
        for _, Menu in pairs(self.Menus) do
            Menu.Settings.InstructionalButtons = tobool(bool)
        end
    end
end

function MenuPool:MouseControlsEnabled(bool)
    if bool ~= nil then
        for _, Menu in pairs(self.Menus) do
            Menu.Settings.MouseControlsEnabled = tobool(bool)
        end
    end
end

function MenuPool:RefreshIndex()
    for _, Menu in pairs(self.Menus) do
        Menu:RefreshIndex()
    end
end

function MenuPool:ProcessMenus()
    self:ProcessControl()
    self:ProcessMouse()
    self:Draw()
end

function MenuPool:ProcessControl()
    for _, Menu in pairs(self.Menus) do
        if Menu:Visible() then
            Menu:ProcessControl()
        end
    end
end

function MenuPool:ProcessMouse()
    for _, Menu in pairs(self.Menus) do
        if Menu:Visible() then
            Menu:ProcessMouse()
        end
    end
end

function MenuPool:Draw()
    for _, Menu in pairs(self.Menus) do
        if Menu:Visible() then
            Menu:Draw()
        end
    end
end

function MenuPool:IsAnyMenuOpen()
    local open = false
    for _, Menu in pairs(self.Menus) do
        if Menu:Visible() then
            open = true
            break
        end
    end
    return open
end

function MenuPool:CloseAllMenus()
    for _, Menu in pairs(self.Menus) do
        if Menu:Visible() then
            Menu:Visible(false)
            Menu.OnMenuClosed(Menu)
        end
    end
end

function MenuPool:SetBannerSprite(Sprite)
    if Sprite() == "Sprite" then
        for _, Menu in pairs(self.Menus) do
            Menu:SetBannerSprite(Sprite)
        end
    end
end

function MenuPool:SetBannerRectangle(Rectangle)
    if Rectangle() == "Rectangle" then
        for _, Menu in pairs(self.Menus) do
            Menu:SetBannerRectangle(Rectangle)
        end
    end
end

function MenuPool:TotalItemsPerPage(Value)
    if tonumber(Value) then
        for _, Menu in pairs(self.Menus) do
            Menu.Pagination.Total = Value - 1
        end
    end
end
--[[
    Wrappers
--]]

function NativeUI.CreatePool()
    return MenuPool.New()
end

function NativeUI.CreateMenu(Title, Subtitle, X, Y, TxtDictionary, TxtName)
    return UIMenu.New(Title, Subtitle, X, Y, TxtDictionary, TxtName)
end

function NativeUI.CreateItem(Text, Description)
    return UIMenuItem.New(Text, Description)
end

function NativeUI.CreateColouredItem(Text, Description, MainColour, HighlightColour)
    return UIMenuColouredItem.New(Text, Description, MainColour, HighlightColour)
end

function NativeUI.CreateCheckboxItem(Text, Check, Description)
    return UIMenuCheckboxItem.New(Text, Check, Description)
end

function NativeUI.CreateListItem(Text, Items, Index, Description)
    return UIMenuListItem.New(Text, Items, Index, Description)
end

function NativeUI.CreateSliderItem(Text, Items, Index, Description, Divider)
    return UIMenuSliderItem.New(Text, Items, Index, Description, Divider)
end

function NativeUI.CreateProgressItem(Text, Items, Index, Description, Counter)
    return UIMenuProgressItem.New(Text, Items, Index, Description, Counter)
end

function NativeUI.CreateHeritageWindow(Mum, Dad)
    return UIMenuHeritageWindow.New(Mum, Dad)
end

function NativeUI.CreateGridPanel(TopText, LeftText, RightText, BottomText)
    return UIMenuGridPanel.New(TopText, LeftText, RightText, BottomText)
end

function NativeUI.CreateColourPanel(Title, Colours)
    return UIMenuColourPanel.New(Title, Colours)
end

function NativeUI.CreatePercentagePanel(MinText, MaxText)
    return UIMenuPercentagePanel.New(MinText, MaxText)
end

function NativeUI.CreateSprite(TxtDictionary, TxtName, X, Y, Width, Height, Heading, R, G, B, A)
    return Sprite.New(TxtDictionary, TxtName, X, Y, Width, Height, Heading, R, G, B, A)
end

function NativeUI.CreateRectangle(X, Y, Width, Height, R, G, B, A)
    return UIResRectangle.New(X, Y, Width, Height, R, G, B, A)
end

function NativeUI.CreateText(Text, X, Y, Scale, R, G, B, A, Font, Alignment, DropShadow, Outline, WordWrap)
    return UIResText.New(Text, X, Y, Scale, R, G, B, A, Font, Alignment, DropShadow, Outline, WordWrap)
end
