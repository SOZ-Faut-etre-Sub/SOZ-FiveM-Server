QBCore = exports["qb-core"]:GetCoreObject()

ComponentType = {
    Head = 0,
    Mask = 1,
    Hair = 2,
    Arms = 3,
    Pants = 4,
    Bag = 5,
    Shoes = 6,
    Chain = 7,
    Top = 8,
    Bulletproof = 9,
    Decals = 10,
    Torso = 11,
}

PropType = {Head = 0, Glasses = 1, Ear = 2, LeftHand = 6, RightHand = 7, Helmet = "Helmet"}

HeadOverlayType = {
    Blemishes = 0,
    FacialHair = 1,
    Eyebrows = 2,
    Ageing = 3,
    Makeup = 4,
    Blush = 5,
    Complexion = 6,
    SunDamage = 7,
    Lipstick = 8,
    Moles = 9,
    ChestHair = 10,
    BodyBlemishes = 11,
    AddBodyBlemishes = 12,
}

FaceFeatureType = {
    NoseWidth = 0,
    NosePeakHeight = 1,
    NosePeakLength = 2,
    NoseBoneHigh = 3,
    NosePeakLowering = 4,
    NoseBoneTwist = 5,
    EyebrowHigh = 6,
    EyebrowForward = 7,
    CheeksBoneHigh = 8,
    CheeksBoneWidth = 9,
    CheeksWidth = 10,
    EyesOpening = 11,
    LipsThickness = 12,
    JawBoneWidth = 13,
    JawBoneBackLength = 14,
    ChimpBoneLowering = 15,
    ChimpBoneLength = 16,
    ChimpBoneWidth = 17,
    ChimpHole = 18,
    NeckThickness = 19,
}

-- Labels for listing options
Labels = {
    Eye = {
        {value = -1, label = GetLabelText("NONE")},
        {value = 0, label = GetLabelText("FACE_E_C_0")},
        {value = 1, label = GetLabelText("FACE_E_C_1")},
        {value = 2, label = GetLabelText("FACE_E_C_2")},
        {value = 3, label = GetLabelText("FACE_E_C_3")},
        {value = 4, label = GetLabelText("FACE_E_C_4")},
        {value = 5, label = GetLabelText("FACE_E_C_5")},
        {value = 6, label = GetLabelText("FACE_E_C_6")},
        {value = 7, label = GetLabelText("FACE_E_C_7")},
        {value = 8, label = GetLabelText("FACE_E_C_8")},
        {value = 9, label = GetLabelText("FACE_E_C_9")},
        {value = 10, label = GetLabelText("FACE_E_C_10")},
        {value = 11, label = GetLabelText("FACE_E_C_11")},
        {value = 12, label = GetLabelText("FACE_E_C_12")},
        {value = 13, label = GetLabelText("FACE_E_C_13")},
        {value = 14, label = GetLabelText("FACE_E_C_14")},
        {value = 15, label = GetLabelText("FACE_E_C_15")},
        {value = 16, label = GetLabelText("FACE_E_C_16")},
        {value = 17, label = GetLabelText("FACE_E_C_17")},
        {value = 18, label = GetLabelText("FACE_E_C_18")},
        {value = 19, label = GetLabelText("FACE_E_C_19")},
        {value = 20, label = GetLabelText("FACE_E_C_20")},
        {value = 21, label = GetLabelText("FACE_E_C_21")},
        {value = 22, label = GetLabelText("FACE_E_C_22")},
        {value = 23, label = GetLabelText("FACE_E_C_23")},
        {value = 24, label = GetLabelText("FACE_E_C_24")},
        {value = 25, label = GetLabelText("FACE_E_C_25")},
        {value = 26, label = GetLabelText("FACE_E_C_26")},
        {value = 27, label = GetLabelText("FACE_E_C_27")},
        {value = 28, label = GetLabelText("FACE_E_C_28")},
        {value = 29, label = GetLabelText("FACE_E_C_29")},
        {value = 30, label = GetLabelText("FACE_E_C_30")},
        {value = 31, label = GetLabelText("FACE_E_C_31")},
    },
    Blemish = {
        {value = -1, label = GetLabelText("NONE")},
        {value = 0, label = "0"},
        {value = 1, label = "1"},
        {value = 2, label = "2"},
        {value = 3, label = "3"},
        {value = 4, label = "4"},
        {value = 5, label = "5"},
        {value = 6, label = "6"},
        {value = 7, label = "7"},
        {value = 8, label = "8"},
        {value = 9, label = "9"},
        {value = 10, label = "10"},
        {value = 11, label = "11"},
        {value = 12, label = "12"},
        {value = 13, label = "13"},
        {value = 14, label = "14"},
        {value = 15, label = "15"},
        {value = 16, label = "16"},
        {value = 17, label = "17"},
        {value = 18, label = "18"},
        {value = 19, label = "19"},
        {value = 20, label = "20"},
        {value = 21, label = "21"},
        {value = 22, label = "22"},
        {value = 23, label = "23"},
    },
    Ageing = {
        {value = -1, label = GetLabelText("NONE")},
        {value = 0, label = "0"},
        {value = 1, label = "1"},
        {value = 2, label = "2"},
        {value = 3, label = "3"},
        {value = 4, label = "4"},
        {value = 5, label = "5"},
        {value = 6, label = "6"},
        {value = 7, label = "7"},
        {value = 8, label = "8"},
        {value = 9, label = "9"},
        {value = 10, label = "10"},
        {value = 11, label = "11"},
        {value = 12, label = "12"},
        {value = 13, label = "13"},
        {value = 14, label = "14"},
        {value = 15, label = "15"},
    },
    Complexion = {
        {value = -1, label = GetLabelText("NONE")},
        {value = 0, label = "0"},
        {value = 1, label = "1"},
        {value = 2, label = "2"},
        {value = 3, label = "3"},
        {value = 4, label = "4"},
        {value = 5, label = "5"},
        {value = 6, label = "6"},
        {value = 7, label = "7"},
        {value = 8, label = "8"},
        {value = 9, label = "9"},
        {value = 10, label = "10"},
        {value = 11, label = "11"},
    },
    Moles = {
        {value = -1, label = GetLabelText("NONE")},
        {value = 0, label = "0"},
        {value = 1, label = "1"},
        {value = 2, label = "2"},
        {value = 3, label = "3"},
        {value = 4, label = "4"},
        {value = 5, label = "5"},
        {value = 6, label = "6"},
        {value = 7, label = "7"},
        {value = 8, label = "8"},
        {value = 9, label = "9"},
        {value = 10, label = "10"},
        {value = 11, label = "11"},
        {value = 12, label = "12"},
        {value = 13, label = "13"},
        {value = 14, label = "14"},
        {value = 15, label = "15"},
        {value = 16, label = "16"},
        {value = 17, label = "17"},
    },
    BodyBlemishes = {
        {value = -1, label = GetLabelText("NONE")},
        {value = 0, label = "0"},
        {value = 1, label = "1"},
        {value = 2, label = "2"},
        {value = 3, label = "3"},
        {value = 4, label = "4"},
        {value = 5, label = "5"},
        {value = 6, label = "6"},
        {value = 7, label = "7"},
        {value = 8, label = "8"},
        {value = 9, label = "9"},
        {value = 10, label = "10"},
        {value = 11, label = "11"},
    },
    AddBodyBlemishes = {{value = -1, label = GetLabelText("NONE")}, {value = 0, label = "0"}, {value = 1, label = "1"}},
    HairMale = {
        {value = 0, label = GetLabelText("CC_M_HS_0")},
        {value = 1, label = GetLabelText("CC_M_HS_1")},
        {value = 2, label = GetLabelText("CC_M_HS_2")},
        {value = 3, label = GetLabelText("CC_M_HS_3")},
        {value = 4, label = GetLabelText("CC_M_HS_4")},
        {value = 5, label = GetLabelText("CC_M_HS_5")},
        {value = 6, label = GetLabelText("CC_M_HS_6")},
        {value = 7, label = GetLabelText("CC_M_HS_7")},
        {value = 8, label = GetLabelText("CC_M_HS_8")},
        {value = 9, label = GetLabelText("CC_M_HS_9")},
        {value = 10, label = GetLabelText("CC_M_HS_10")},
        {value = 11, label = GetLabelText("CC_M_HS_11")},
        {value = 12, label = GetLabelText("CC_M_HS_12")},
        {value = 13, label = GetLabelText("CC_M_HS_13")},
        {value = 14, label = GetLabelText("CC_M_HS_14")},
        {value = 15, label = GetLabelText("CC_M_HS_15")},
        {value = 16, label = GetLabelText("CC_M_HS_16")},
        {value = 17, label = GetLabelText("CC_M_HS_17")},
        {value = 18, label = GetLabelText("CC_M_HS_18")},
        {value = 19, label = GetLabelText("CC_M_HS_19")},
        {value = 20, label = GetLabelText("CC_M_HS_20")},
        {value = 21, label = GetLabelText("CC_M_HS_21")},
        {value = 22, label = GetLabelText("CLO_IND_H_0_0")},
        {value = 24, label = GetLabelText("CLO_S1M_H_0_0")},
        {value = 25, label = GetLabelText("CLO_S1M_H_1_0")},
        {value = 26, label = GetLabelText("CLO_S1M_H_2_0")},
        {value = 27, label = GetLabelText("CLO_S1M_H_3_0")},
        {value = 28, label = GetLabelText("CLO_S2M_H_0_0")},
        {value = 29, label = GetLabelText("CLO_S2M_H_1_0")},
        {value = 30, label = GetLabelText("CLO_S2M_H_2_0")},
        {value = 31, label = GetLabelText("CLO_BIM_H_0_0")},
        {value = 32, label = GetLabelText("CLO_BIM_H_1_0")},
        {value = 33, label = GetLabelText("CLO_BIM_H_2_0")},
        {value = 34, label = GetLabelText("CLO_BIM_H_3_0")},
        {value = 35, label = GetLabelText("CLO_BIM_H_4_0")},
        {value = 36, label = GetLabelText("CLO_BIM_H_5_0")},
        {value = 72, label = GetLabelText("CLO_GRM_H_0_0")},
        {value = 73, label = GetLabelText("CLO_GRM_H_1_0")},
        {value = 74, label = GetLabelText("CLO_VWM_H_0_0")},
        {value = 75, label = GetLabelText("CLO_TRM_H_0_0")},
        {value = 76, label = GetLabelText("CLO_FXM_H_0_0")},
        {value = 77, label = GetLabelText("CLO_SBM_H_0_0")},
        {value = 78, label = GetLabelText("CLO_SBM_H_1_0")},
        {value = 79, label = GetLabelText("CLO_SCM_H_0_0")},
        {value = 80, label = GetLabelText("CLO_SCM_H_1_0")},
        {value = 81, label = GetLabelText("CLO_X7M_H_0_0")},
        {value = 82, label = GetLabelText("CLO_X8M_H_0_0")},

        -- Customs Hairs
        {value = 2, label = "Chignon haut", Collection = "soz_custom"},
        {value = 4, label = "Crinière libérée", Collection = "soz_custom"},
        {value = 5, label = "Cheveux ondulés", Collection = "soz_custom"},
        {value = 6, label = "Cheveux duveteux", Collection = "soz_custom"},
        {value = 8, label = "Dreadlocks de coté", Collection = "soz_custom"},
        {value = 9, label = "Dreadlocks coloré", Collection = "soz_custom"},
    },
    HairFemale = {
        {value = 0, label = GetLabelText("CC_F_HS_0")},
        {value = 1, label = GetLabelText("CC_F_HS_1")},
        {value = 2, label = GetLabelText("CC_F_HS_2")},
        {value = 3, label = GetLabelText("CC_F_HS_3")},
        {value = 4, label = GetLabelText("CC_F_HS_4")},
        {value = 5, label = GetLabelText("CC_F_HS_5")},
        {value = 6, label = GetLabelText("CC_F_HS_6")},
        {value = 7, label = GetLabelText("CC_F_HS_7")},
        {value = 8, label = GetLabelText("CC_F_HS_8")},
        {value = 9, label = GetLabelText("CC_F_HS_9")},
        {value = 10, label = GetLabelText("CC_F_HS_10")},
        {value = 11, label = GetLabelText("CC_F_HS_11")},
        {value = 12, label = GetLabelText("CC_F_HS_12")},
        {value = 13, label = GetLabelText("CC_F_HS_13")},
        {value = 14, label = GetLabelText("CC_F_HS_14")},
        {value = 15, label = GetLabelText("CC_F_HS_15")},
        {value = 16, label = GetLabelText("CC_F_HS_16")},
        {value = 17, label = GetLabelText("CC_F_HS_17")},
        {value = 18, label = GetLabelText("CC_F_HS_23")},
        {value = 19, label = GetLabelText("CC_F_HS_18")},
        {value = 20, label = GetLabelText("CC_F_HS_19")},
        {value = 21, label = GetLabelText("CC_F_HS_20")},
        {value = 22, label = GetLabelText("CC_F_HS_21")},
        {value = 23, label = GetLabelText("CC_F_HS_22")},
        {value = 25, label = GetLabelText("CLO_S1F_H_0_0")},
        {value = 26, label = GetLabelText("CLO_S1F_H_1_0")},
        {value = 27, label = GetLabelText("CLO_S1F_H_2_0")},
        {value = 28, label = GetLabelText("CLO_S1F_H_3_0")},
        {value = 29, label = GetLabelText("CLO_S2F_H_0_0")},
        {value = 30, label = GetLabelText("CLO_S2F_H_1_0")},
        {value = 31, label = GetLabelText("CLO_S2F_H_2_0")},
        {value = 32, label = GetLabelText("CLO_BIF_H_0_0")},
        {value = 33, label = GetLabelText("CLO_BIF_H_1_0")},
        {value = 34, label = GetLabelText("CLO_BIF_H_2_0")},
        {value = 35, label = GetLabelText("CLO_BIF_H_3_0")},
        {value = 36, label = GetLabelText("CLO_BIF_H_4_0")},
        {value = 37, label = GetLabelText("CLO_BIF_H_6_0")},
        {value = 38, label = GetLabelText("CLO_BIF_H_5_0")},
        {value = 76, label = GetLabelText("CLO_GRF_H_0_0")},
        {value = 77, label = GetLabelText("CLO_GRF_H_1_0")},
        {value = 78, label = GetLabelText("CLO_VWF_H_0_0")},
        {value = 79, label = GetLabelText("CLO_TRF_H_0_0")},
        {value = 80, label = GetLabelText("CLO_FXF_H_0_0")},
        {value = 81, label = GetLabelText("CLO_SBF_H_0_0")},
        {value = 82, label = GetLabelText("CLO_SBF_H_1_0")},
        {value = 83, label = GetLabelText("CLO_X6F_H_0_0")},
        {value = 84, label = GetLabelText("CLO_SCF_H_0_0")},
        {value = 85, label = GetLabelText("CLO_X7F_H_0_0")},
        {value = 86, label = GetLabelText("CLO_X8F_H_0_0")},

        -- Customs Hairs
        {value = 0, label = "Couronne de tresses", Collection = "soz_custom"},
        {value = 1, label = "Tresses longues", Collection = "soz_custom"},
        {value = 2, label = "Triple chignon", Collection = "soz_custom"},
        {value = 3, label = "Coupe au carré", Collection = "soz_custom"},
        {value = 4, label = "Double chignon", Collection = "soz_custom"},
        {value = 5, label = "Queue de cheval", Collection = "soz_custom"},
        {value = 6, label = "Tresses doubles mi-long", Collection = "soz_custom"},
        {value = 11, label = "Longue tresse", Collection = "soz_custom"},
        {value = 22, label = "Cheveux longs", Collection = "soz_custom"},
        {value = 26, label = "Couettes hautes", Collection = "soz_custom"},
        {value = 27, label = "Chignon haut", Collection = "soz_custom"},
        {value = 28, label = "Longs raides avec une raie sur le côté", Collection = "soz_custom"},
        {value = 32, label = "Queue de cheval basse", Collection = "soz_custom"},
        {value = 35, label = "Cheveux longs 2", Collection = "soz_custom"},
        {value = 38, label = "Carré court", Collection = "soz_custom"},
        {value = 40, label = "Queue bouclée romantique", Collection = "soz_custom"},
        {value = 43, label = "Space Buns mi-longs", Collection = "soz_custom"},
        {value = 44, label = "Carré soufflé volume", Collection = "soz_custom"},
        {value = 45, label = "Carré glamour ondulé", Collection = "soz_custom"},
        {value = 46, label = "Carré droit headband", Collection = "soz_custom"},
        {value = 47, label = "Noué rétro avec mèches", Collection = "soz_custom"},
    },
    BeardMale = {
        {value = -1, label = GetLabelText("BERD_P0_0_0")},
        {value = 0, label = GetLabelText("BERD_P0_1_0")},
        {value = 1, label = GetLabelText("BERD_P0_2_0")},
        {value = 2, label = GetLabelText("BERD_P0_3_0")},
        {value = 3, label = GetLabelText("BERD_P0_4_0")},
        {value = 4, label = GetLabelText("BERD_P1_1_0")},
        {value = 5, label = GetLabelText("BERD_P1_2_0")},
        {value = 6, label = GetLabelText("BERD_P1_3_0")},
        {value = 7, label = GetLabelText("BERD_P1_4_0")},
        {value = 8, label = GetLabelText("BERD_P2_1_0")},
        {value = 9, label = GetLabelText("BERD_P2_2_0")},
        {value = 10, label = GetLabelText("BERD_P2_3_0")},
        {value = 11, label = GetLabelText("BERD_P2_4_0")},
        {value = 12, label = "Contour taillé"},
        {value = 13, label = "Taillé très court"},
        {value = 14, label = "Propre et carré"},
        {value = 15, label = "Moustache mince"},
        {value = 16, label = "Moustache naissante"},
        {value = 17, label = "Rouflaquettes taillées"},
        {value = 18, label = "Barbe épaisse"},
        {value = 19, label = GetLabelText("BRD_HP_0")},
        {value = 20, label = GetLabelText("BRD_HP_1")},
        {value = 21, label = GetLabelText("BRD_HP_2")},
        {value = 23, label = GetLabelText("BRD_HP_3")},
        {value = 24, label = GetLabelText("BRD_HP_4")},
        {value = 25, label = GetLabelText("BRD_HP_5")},
        {value = 26, label = GetLabelText("BRD_HP_6")},
        {value = 27, label = GetLabelText("BRD_HP_7")},
        {value = 28, label = GetLabelText("BRD_HP_8")},
        {value = 29, label = GetLabelText("BRD_HP_9")},
    },
    Eyebrow = {
        {value = -1, label = GetLabelText("NONE")},
        {value = 0, label = GetLabelText("CC_EYEBRW_0")},
        {value = 1, label = GetLabelText("CC_EYEBRW_1")},
        {value = 2, label = GetLabelText("CC_EYEBRW_2")},
        {value = 3, label = GetLabelText("CC_EYEBRW_3")},
        {value = 4, label = GetLabelText("CC_EYEBRW_4")},
        {value = 5, label = GetLabelText("CC_EYEBRW_5")},
        {value = 6, label = GetLabelText("CC_EYEBRW_6")},
        {value = 7, label = GetLabelText("CC_EYEBRW_7")},
        {value = 8, label = GetLabelText("CC_EYEBRW_8")},
        {value = 9, label = GetLabelText("CC_EYEBRW_9")},
        {value = 10, label = GetLabelText("CC_EYEBRW_10")},
        {value = 11, label = GetLabelText("CC_EYEBRW_11")},
        {value = 12, label = GetLabelText("CC_EYEBRW_12")},
        {value = 13, label = GetLabelText("CC_EYEBRW_13")},
        {value = 14, label = GetLabelText("CC_EYEBRW_14")},
        {value = 15, label = GetLabelText("CC_EYEBRW_15")},
        {value = 16, label = GetLabelText("CC_EYEBRW_16")},
        {value = 17, label = GetLabelText("CC_EYEBRW_17")},
        {value = 18, label = GetLabelText("CC_EYEBRW_18")},
        {value = 19, label = GetLabelText("CC_EYEBRW_19")},
        {value = 20, label = GetLabelText("CC_EYEBRW_20")},
        {value = 21, label = GetLabelText("CC_EYEBRW_21")},
        {value = 22, label = GetLabelText("CC_EYEBRW_22")},
        {value = 23, label = GetLabelText("CC_EYEBRW_23")},
        {value = 24, label = GetLabelText("CC_EYEBRW_24")},
        {value = 25, label = GetLabelText("CC_EYEBRW_25")},
        {value = 26, label = GetLabelText("CC_EYEBRW_26")},
        {value = 27, label = GetLabelText("CC_EYEBRW_27")},
        {value = 28, label = GetLabelText("CC_EYEBRW_28")},
        {value = 29, label = GetLabelText("CC_EYEBRW_29")},
        {value = 30, label = GetLabelText("CC_EYEBRW_30")},
        {value = 31, label = GetLabelText("CC_EYEBRW_31")},
        {value = 32, label = GetLabelText("CC_EYEBRW_32")},
        {value = 33, label = GetLabelText("CC_EYEBRW_33")},
    },
    ChestHair = {
        {value = -1, label = GetLabelText("CC_BODY_1_0")},
        {value = 0, label = GetLabelText("CC_BODY_1_1")},
        {value = 1, label = GetLabelText("CC_BODY_1_2")},
        {value = 2, label = GetLabelText("CC_BODY_1_3")},
        {value = 3, label = GetLabelText("CC_BODY_1_4")},
        {value = 4, label = GetLabelText("CC_BODY_1_5")},
        {value = 5, label = GetLabelText("CC_BODY_1_6")},
        {value = 6, label = GetLabelText("CC_BODY_1_7")},
        {value = 7, label = GetLabelText("CC_BODY_1_8")},
        {value = 8, label = GetLabelText("CC_BODY_1_9")},
        {value = 9, label = GetLabelText("CC_BODY_1_10")},
        {value = 10, label = GetLabelText("CC_BODY_1_11")},
        {value = 11, label = GetLabelText("CC_BODY_1_12")},
        {value = 12, label = GetLabelText("CC_BODY_1_13")},
        {value = 13, label = GetLabelText("CC_BODY_1_14")},
        {value = 14, label = GetLabelText("CC_BODY_1_15")},
        {value = 15, label = GetLabelText("CC_BODY_1_16")},
        {value = 16, label = GetLabelText("CC_BODY_1_17")},
    },
    Blush = {
        {value = -1, label = GetLabelText("NONE")},
        {value = 0, label = GetLabelText("CC_BLUSH_0")},
        {value = 1, label = GetLabelText("CC_BLUSH_1")},
        {value = 2, label = GetLabelText("CC_BLUSH_2")},
        {value = 3, label = GetLabelText("CC_BLUSH_3")},
        {value = 4, label = GetLabelText("CC_BLUSH_4")},
        {value = 5, label = GetLabelText("CC_BLUSH_5")},
        {value = 6, label = GetLabelText("CC_BLUSH_6")},
        {value = 7, label = GetLabelText("CC_BLUSH_7")},
        {value = 8, label = GetLabelText("CC_BLUSH_8")},
        {value = 9, label = GetLabelText("CC_BLUSH_9")},
        {value = 10, label = GetLabelText("CC_BLUSH_10")},
        {value = 11, label = GetLabelText("CC_BLUSH_11")},
        {value = 12, label = GetLabelText("CC_BLUSH_12")},
        {value = 13, label = GetLabelText("CC_BLUSH_13")},
        {value = 14, label = GetLabelText("CC_BLUSH_14")},
        {value = 15, label = GetLabelText("CC_BLUSH_15")},
        {value = 16, label = GetLabelText("CC_BLUSH_16")},
        {value = 17, label = GetLabelText("CC_BLUSH_17")},
        {value = 18, label = GetLabelText("CC_BLUSH_18")},
        {value = 19, label = GetLabelText("CC_BLUSH_19")},
        {value = 20, label = GetLabelText("CC_BLUSH_20")},
        {value = 21, label = GetLabelText("CC_BLUSH_21")},
        {value = 22, label = GetLabelText("CC_BLUSH_22")},
        {value = 23, label = GetLabelText("CC_BLUSH_23")},
        {value = 24, label = GetLabelText("CC_BLUSH_24")},
        {value = 25, label = GetLabelText("CC_BLUSH_25")},
        {value = 26, label = GetLabelText("CC_BLUSH_26")},
        {value = 27, label = GetLabelText("CC_BLUSH_27")},
        {value = 28, label = GetLabelText("CC_BLUSH_28")},
        {value = 29, label = GetLabelText("CC_BLUSH_29")},
        {value = 30, label = GetLabelText("CC_BLUSH_30")},
        {value = 31, label = GetLabelText("CC_BLUSH_31")},
        {value = 32, label = GetLabelText("CC_BLUSH_32")},
    },
    Lipstick = {
        {value = -1, label = GetLabelText("NONE")},
        {value = 0, label = GetLabelText("CC_LIPSTICK_0")},
        {value = 1, label = GetLabelText("CC_LIPSTICK_1")},
        {value = 2, label = GetLabelText("CC_LIPSTICK_2")},
        {value = 3, label = GetLabelText("CC_LIPSTICK_3")},
        {value = 4, label = GetLabelText("CC_LIPSTICK_4")},
        {value = 5, label = GetLabelText("CC_LIPSTICK_5")},
        {value = 6, label = GetLabelText("CC_LIPSTICK_6")},
        {value = 7, label = GetLabelText("CC_LIPSTICK_7")},
        {value = 8, label = GetLabelText("CC_LIPSTICK_8")},
        {value = 9, label = GetLabelText("CC_LIPSTICK_9")},
    },
    Makeup = {
        {value = -1, label = GetLabelText("NONE")},
        {value = 0, label = GetLabelText("CC_MKUP_0")},
        {value = 1, label = GetLabelText("CC_MKUP_1")},
        {value = 2, label = GetLabelText("CC_MKUP_2")},
        {value = 3, label = GetLabelText("CC_MKUP_3")},
        {value = 4, label = GetLabelText("CC_MKUP_4")},
        {value = 5, label = GetLabelText("CC_MKUP_5")},
        {value = 6, label = GetLabelText("CC_MKUP_6")},
        {value = 7, label = GetLabelText("CC_MKUP_7")},
        {value = 8, label = GetLabelText("CC_MKUP_8")},
        {value = 9, label = GetLabelText("CC_MKUP_9")},
        {value = 10, label = GetLabelText("CC_MKUP_10")},
        {value = 11, label = GetLabelText("CC_MKUP_11")},
        {value = 12, label = GetLabelText("CC_MKUP_12")},
        {value = 13, label = GetLabelText("CC_MKUP_13")},
        {value = 14, label = GetLabelText("CC_MKUP_14")},
        {value = 15, label = GetLabelText("CC_MKUP_15")},
        {value = 16, label = GetLabelText("CC_MKUP_16")},
        {value = 17, label = GetLabelText("CC_MKUP_17")},
        {value = 18, label = GetLabelText("CC_MKUP_18")},
        {value = 19, label = GetLabelText("CC_MKUP_19")},
        {value = 20, label = GetLabelText("CC_MKUP_20")},
        {value = 21, label = GetLabelText("CC_MKUP_21")},
        -- { value = 22, label = GetLabelText("CC_MKUP_22") },
        -- { value = 23, label = GetLabelText("CC_MKUP_23") },
        -- { value = 24, label = GetLabelText("CC_MKUP_24") },
        -- { value = 25, label = GetLabelText("CC_MKUP_25") },
        {value = 26, label = GetLabelText("CC_MKUP_26")},
        {value = 27, label = GetLabelText("CC_MKUP_27")},
        {value = 28, label = GetLabelText("CC_MKUP_28")},
        {value = 29, label = GetLabelText("CC_MKUP_29")},
        {value = 30, label = GetLabelText("CC_MKUP_30")},
        {value = 31, label = GetLabelText("CC_MKUP_31")},
        {value = 32, label = GetLabelText("CC_MKUP_32")},
        {value = 33, label = GetLabelText("CC_MKUP_33")},
        {value = 34, label = GetLabelText("CC_MKUP_34")},
        {value = 35, label = GetLabelText("CC_MKUP_35")},
        {value = 36, label = GetLabelText("CC_MKUP_36")},
        {value = 37, label = GetLabelText("CC_MKUP_37")},
        {value = 38, label = GetLabelText("CC_MKUP_38")},
        {value = 39, label = GetLabelText("CC_MKUP_39")},
        {value = 40, label = GetLabelText("CC_MKUP_40")},
        {value = 41, label = GetLabelText("CC_MKUP_41")},
        {value = 42, label = GetLabelText("CC_MKUP_42")},
        {value = 43, label = GetLabelText("CC_MKUP_43")},
        {value = 44, label = GetLabelText("CC_MKUP_44")},
        {value = 45, label = GetLabelText("CC_MKUP_45")},
        {value = 46, label = GetLabelText("CC_MKUP_46")},
        {value = 47, label = GetLabelText("CC_MKUP_47")},
        {value = 48, label = GetLabelText("CC_MKUP_48")},
        {value = 49, label = GetLabelText("CC_MKUP_49")},
        {value = 50, label = GetLabelText("CC_MKUP_50")},
        {value = 51, label = GetLabelText("CC_MKUP_51")},
        {value = 52, label = GetLabelText("CC_MKUP_52")},
        {value = 53, label = GetLabelText("CC_MKUP_53")},
        {value = 54, label = GetLabelText("CC_MKUP_54")},
        {value = 55, label = GetLabelText("CC_MKUP_55")},
        {value = 56, label = GetLabelText("CC_MKUP_56")},
        {value = 57, label = GetLabelText("CC_MKUP_57")},
        {value = 58, label = GetLabelText("CC_MKUP_58")},
        {value = 59, label = GetLabelText("CC_MKUP_59")},
        {value = 60, label = GetLabelText("CC_MKUP_60")},
        {value = 61, label = GetLabelText("CC_MKUP_61")},
        {value = 62, label = GetLabelText("CC_MKUP_62")},
        {value = 63, label = GetLabelText("CC_MKUP_63")},
        {value = 64, label = GetLabelText("CC_MKUP_64")},
        {value = 65, label = GetLabelText("CC_MKUP_65")},
        {value = 66, label = GetLabelText("CC_MKUP_66")},
        {value = 67, label = GetLabelText("CC_MKUP_67")},
        {value = 68, label = GetLabelText("CC_MKUP_68")},
        {value = 69, label = GetLabelText("CC_MKUP_69")},
        {value = 70, label = GetLabelText("CC_MKUP_70")},
        {value = 71, label = GetLabelText("CC_MKUP_71")},
    },
}

ClothMenuLabel = {
    [ComponentType.Pants] = "Pantalons",
    [ComponentType.Shoes] = "Chaussures",
    [ComponentType.Torso] = "Hauts",
}

Colors = {Hair = {}, Makeup = {}}

function CreateItemsWithTextures(componentType, drawableId, textures)
    local items = {}
    for _, texture in pairs(textures) do
        local item = {
            Name = texture.Name,
            ApplyComponents = {[componentType] = {Drawable = drawableId, Texture = texture.Id, Palette = 0}},
        }

        table.insert(items, item)
    end
    return items
end

CreateClothShopConfigSouth = {
    [GetHashKey("mp_m_freemode_01")] = {
        {
            Collections = {
                {
                    Name = "Haut",
                    Items = {
                        {
                            Name = GetLabelText("CLO_H4M_U_3_0"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 0, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_1"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 1, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_2"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 2, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_3"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 3, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_4"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 4, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_5"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 5, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_6"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 6, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_7"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 7, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_8"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 8, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_9"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 9, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_10"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 10, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_11"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 11, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_12"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 12, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_13"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 13, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_14"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 14, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_15"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 15, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_16"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 16, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_17"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 17, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_18"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 18, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_19"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 19, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_20"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 20, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_21"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 21, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_22"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 22, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_23"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 23, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_24"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 24, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4M_U_3_25"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 0, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 354, Texture = 25, Palette = 0},
                            },
                        },
                    },
                },
            },
        },
        {
            Collections = {
                {
                    Name = "Pantalon",
                    Items = CreateItemsWithTextures(ComponentType.Pants, 103, {
                        {Name = GetLabelText("CLO_AWM_L_1_0"), Id = 0},
                        {Name = GetLabelText("CLO_AWM_L_1_1"), Id = 1},
                        {Name = GetLabelText("CLO_AWM_L_1_2"), Id = 2},
                        {Name = GetLabelText("CLO_AWM_L_1_3"), Id = 3},
                        {Name = GetLabelText("CLO_AWM_L_1_4"), Id = 4},
                        {Name = GetLabelText("CLO_AWM_L_1_5"), Id = 5},
                        {Name = GetLabelText("CLO_AWM_L_1_6"), Id = 6},
                        {Name = GetLabelText("CLO_AWM_L_1_7"), Id = 7},
                        {Name = GetLabelText("CLO_AWM_L_1_8"), Id = 8},
                        {Name = GetLabelText("CLO_AWM_L_1_9"), Id = 9},
                        {Name = GetLabelText("CLO_AWM_L_1_10"), Id = 10},
                        {Name = GetLabelText("CLO_AWM_L_1_11"), Id = 11},
                        {Name = GetLabelText("CLO_AWM_L_1_12"), Id = 12},
                        {Name = GetLabelText("CLO_AWM_L_1_13"), Id = 13},
                    }),
                },
            },
        },
        {
            Collections = {
                {
                    Name = "Chaussure",
                    Items = CreateItemsWithTextures(ComponentType.Shoes, 1, {
                        {Name = GetLabelText("F_FMM_1_0"), Id = 0},
                        {Name = GetLabelText("F_FMM_1_1"), Id = 1},
                        {Name = GetLabelText("F_FMM_1_2"), Id = 2},
                        {Name = GetLabelText("F_FMM_1_3"), Id = 3},
                        {Name = GetLabelText("F_FMM_1_4"), Id = 4},
                        {Name = GetLabelText("F_FMM_1_5"), Id = 5},
                        {Name = GetLabelText("F_FMM_1_6"), Id = 6},
                        {Name = GetLabelText("F_FMM_1_7"), Id = 7},
                        {Name = GetLabelText("F_FMM_1_8"), Id = 8},
                        {Name = GetLabelText("F_FMM_1_9"), Id = 9},
                        {Name = GetLabelText("F_FMM_1_10"), Id = 10},
                        {Name = GetLabelText("F_FMM_1_11"), Id = 11},
                        {Name = GetLabelText("F_FMM_1_12"), Id = 12},
                        {Name = GetLabelText("F_FMM_1_13"), Id = 13},
                        {Name = GetLabelText("F_FMM_1_13"), Id = 14},
                        {Name = GetLabelText("F_FMM_1_13"), Id = 15},
                    }),
                },
            },
        },
    },
    [GetHashKey("mp_f_freemode_01")] = {
        {
            Collections = {
                {
                    Name = "Haut",
                    Items = {
                        {
                            Name = GetLabelText("CLO_H4F_U_2_0"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 0, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_1"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 1, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_2"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 2, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_3"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 3, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_4"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 4, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_5"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 5, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_6"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 6, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_7"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 7, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_8"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 8, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_9"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 9, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_10"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 10, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_11"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 11, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_12"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 12, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_13"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 13, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_14"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 14, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_15"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 15, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_16"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 16, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_17"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 17, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_BHM_F_1_18"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 18, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_19"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 19, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_20"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 20, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_21"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 21, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_22"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 22, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_23"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 23, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_24"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 24, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_H4F_U_2_25"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 14, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 372, Texture = 25, Palette = 0},
                            },
                        },
                    },
                },
            },
        },
        {
            Collections = {
                {
                    Name = "Pantalon",
                    Items = CreateItemsWithTextures(ComponentType.Pants, 4, {
                        {Name = GetLabelText("L_FMF_4_0"), Id = 0},
                        {Name = GetLabelText("L_FMF_4_1"), Id = 1},
                        {Name = GetLabelText("L_FMF_4_2"), Id = 2},
                        {Name = GetLabelText("L_FMF_4_3"), Id = 3},
                        {Name = GetLabelText("L_FMF_4_4"), Id = 4},
                        {Name = GetLabelText("L_FMF_4_5"), Id = 5},
                        {Name = GetLabelText("L_FMF_4_6"), Id = 6},
                        {Name = GetLabelText("L_FMF_4_7"), Id = 7},
                        {Name = GetLabelText("L_FMF_4_8"), Id = 8},
                        {Name = GetLabelText("L_FMF_4_9"), Id = 9},
                        {Name = GetLabelText("L_FMF_4_10"), Id = 10},
                        {Name = GetLabelText("L_FMF_4_11"), Id = 11},
                        {Name = GetLabelText("L_FMF_4_12"), Id = 12},
                        {Name = GetLabelText("L_FMF_4_13"), Id = 13},
                        {Name = GetLabelText("L_FMF_4_14"), Id = 14},
                        {Name = GetLabelText("L_FMF_4_15"), Id = 15},
                    }),
                },
            },
        },
        {
            Collections = {
                {
                    Name = "Chaussure",
                    Items = CreateItemsWithTextures(ComponentType.Shoes, 1, {
                        {Name = GetLabelText("F_FMF_1_0"), Id = 0},
                        {Name = GetLabelText("F_FMF_1_1"), Id = 1},
                        {Name = GetLabelText("F_FMF_1_2"), Id = 2},
                        {Name = GetLabelText("F_FMF_1_3"), Id = 3},
                        {Name = GetLabelText("F_FMF_1_4"), Id = 4},
                        {Name = GetLabelText("F_FMF_1_5"), Id = 5},
                        {Name = GetLabelText("F_FMF_1_6"), Id = 6},
                        {Name = GetLabelText("F_FMF_1_7"), Id = 7},
                        {Name = GetLabelText("F_FMF_1_8"), Id = 8},
                        {Name = GetLabelText("F_FMF_1_9"), Id = 9},
                        {Name = GetLabelText("F_FMF_1_10"), Id = 10},
                        {Name = GetLabelText("F_FMF_1_11"), Id = 11},
                        {Name = GetLabelText("F_FMF_1_12"), Id = 12},
                        {Name = GetLabelText("F_FMF_1_13"), Id = 13},
                        {Name = GetLabelText("F_FMF_1_14"), Id = 14},
                        {Name = GetLabelText("F_FMF_1_15"), Id = 15},
                    }),
                },
            },
        },
    },
}

CreateClothShopConfigNorth = {
    [GetHashKey("mp_m_freemode_01")] = {
        {
            Collections = {
                {
                    Name = "Haut",
                    Items = {
                        {
                            Name = GetLabelText("U_FMM_5_0"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 5, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 5, Texture = 0, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("U_FMM_5_1"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 5, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 5, Texture = 1, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("U_FMM_5_2"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 5, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 5, Texture = 2, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("U_FMM_5_3"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 5, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 5, Texture = 3, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("U_FMM_5_4"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 5, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 5, Texture = 4, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("U_FMM_5_5"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 5, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 5, Texture = 5, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("U_FMM_5_6"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 5, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 5, Texture = 6, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("U_FMM_5_7"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 5, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 5, Texture = 7, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("U_FMM_5_8"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 5, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 5, Texture = 8, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("U_FMM_5_9"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 5, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 5, Texture = 9, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("U_FMM_5_10"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 5, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 5, Texture = 10, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("U_FMM_5_11"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 5, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 5, Texture = 11, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("U_FMM_5_12"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 5, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 5, Texture = 12, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("U_FMM_5_13"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 5, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 5, Texture = 13, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("U_FMM_5_14"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 5, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 5, Texture = 14, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("U_FMM_5_15"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 5, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 5, Texture = 15, Palette = 0},
                            },
                        },
                    },
                },
            },
        },
        {
            Collections = {
                {
                    Name = "Pantalon",
                    Items = CreateItemsWithTextures(ComponentType.Pants, 103, {
                        {Name = GetLabelText("CLO_AWM_L_1_0"), Id = 0},
                        {Name = GetLabelText("CLO_AWM_L_1_1"), Id = 1},
                        {Name = GetLabelText("CLO_AWM_L_1_2"), Id = 2},
                        {Name = GetLabelText("CLO_AWM_L_1_3"), Id = 3},
                        {Name = GetLabelText("CLO_AWM_L_1_4"), Id = 4},
                        {Name = GetLabelText("CLO_AWM_L_1_5"), Id = 5},
                        {Name = GetLabelText("CLO_AWM_L_1_6"), Id = 6},
                        {Name = GetLabelText("CLO_AWM_L_1_7"), Id = 7},
                        {Name = GetLabelText("CLO_AWM_L_1_8"), Id = 8},
                        {Name = GetLabelText("CLO_AWM_L_1_9"), Id = 9},
                        {Name = GetLabelText("CLO_AWM_L_1_10"), Id = 10},
                        {Name = GetLabelText("CLO_AWM_L_1_11"), Id = 11},
                        {Name = GetLabelText("CLO_AWM_L_1_12"), Id = 12},
                        {Name = GetLabelText("CLO_AWM_L_1_13"), Id = 13},
                    }),
                },
            },
        },
        {
            Collections = {
                {
                    Name = "Chaussure",
                    Items = CreateItemsWithTextures(ComponentType.Shoes, 16, {
                        {Name = GetLabelText("CLO_BBM_F_0_0"), Id = 0},
                        {Name = GetLabelText("CLO_BBM_F_0_1"), Id = 1},
                        {Name = GetLabelText("CLO_BBM_F_0_2"), Id = 2},
                        {Name = GetLabelText("CLO_BBM_F_0_3"), Id = 3},
                        {Name = GetLabelText("CLO_BBM_F_0_4"), Id = 4},
                        {Name = GetLabelText("CLO_BBM_F_0_5"), Id = 5},
                        {Name = GetLabelText("CLO_BBM_F_0_6"), Id = 6},
                        {Name = GetLabelText("CLO_BBM_F_0_7"), Id = 7},
                        {Name = GetLabelText("CLO_BBM_F_0_8"), Id = 8},
                        {Name = GetLabelText("CLO_BBM_F_0_9"), Id = 9},
                        {Name = GetLabelText("CLO_BBM_F_0_10"), Id = 10},
                        {Name = GetLabelText("CLO_BBM_F_0_11"), Id = 11},
                    }),
                },
            },
        },
    },
    [GetHashKey("mp_f_freemode_01")] = {
        {
            Collections = {
                {
                    Name = "Haut",
                    Items = {
                        {
                            Name = GetLabelText("CLO_BIF_U_15_0"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 4, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 169, Texture = 0, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_BIF_U_15_1"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 4, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 169, Texture = 1, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_BIF_U_15_2"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 4, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 169, Texture = 2, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_BIF_U_15_3"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 4, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 169, Texture = 3, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_BIF_U_15_4"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 4, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 169, Texture = 4, Palette = 0},
                            },
                        },
                        {
                            Name = GetLabelText("CLO_BIF_U_15_5"),
                            ApplyComponents = {
                                [ComponentType.Arms] = {Drawable = 4, Texture = 0, Palette = 0},
                                [ComponentType.Torso] = {Drawable = 169, Texture = 5, Palette = 0},
                            },
                        },
                    },
                },
            },
        },
        {
            Collections = {
                {
                    Name = "Pantalon",
                    Items = CreateItemsWithTextures(ComponentType.Pants, 137, {
                        {Name = GetLabelText("CLO_SUF_L_5_0"), Id = 0},
                        {Name = GetLabelText("CLO_SUF_L_5_1"), Id = 1},
                        {Name = GetLabelText("CLO_SUF_L_5_2"), Id = 2},
                        {Name = GetLabelText("CLO_SUF_L_5_3"), Id = 3},
                        {Name = GetLabelText("CLO_SUF_L_5_4"), Id = 4},
                        {Name = GetLabelText("CLO_SUF_L_5_5"), Id = 5},
                        {Name = GetLabelText("CLO_SUF_L_5_6"), Id = 6},
                        {Name = GetLabelText("CLO_SUF_L_5_7"), Id = 7},
                        {Name = GetLabelText("CLO_SUF_L_5_8"), Id = 8},
                        {Name = GetLabelText("CLO_SUF_L_5_9"), Id = 9},
                        {Name = GetLabelText("CLO_SUF_L_5_10"), Id = 10},
                        {Name = GetLabelText("CLO_SUF_L_5_11"), Id = 11},
                        {Name = GetLabelText("CLO_SUF_L_5_12"), Id = 12},
                        {Name = GetLabelText("CLO_SUF_L_5_13"), Id = 13},
                        {Name = GetLabelText("CLO_SUF_L_5_14"), Id = 14},
                        {Name = GetLabelText("CLO_SUF_L_5_15"), Id = 15},
                    }),
                },
            },
        },
        {
            Collections = {
                {
                    Name = "Chaussure",
                    Items = CreateItemsWithTextures(ComponentType.Shoes, 5, {
                        {Name = GetLabelText("F_FMF_5_0"), Id = 0},
                        {Name = GetLabelText("F_FMF_5_1"), Id = 1},
                        {Name = GetLabelText("F_FMF_5_10"), Id = 10},
                        {Name = GetLabelText("F_FMF_5_13"), Id = 13},
                    }),
                },
            },
        },
    },
}

MaskResetFace = {
    [""] = {
        [28] = true,
        [35] = true,
        [37] = true,
        [47] = true,
        [48] = true,
        [51] = true,
        [52] = true,
        [53] = true,
        [55] = true,
        [56] = true,
        [57] = true,
        [58] = true,
        [77] = true,
        [78] = true,
        [85] = true,
        [89] = true,
        [99] = true,
        [102] = true,
        [104] = true,
        [106] = true,
        [111] = true,
        [112] = true,
        [113] = true,
        [117] = true,
        [122] = true,
        [123] = true,
        [126] = true,
        [130] = true,
        [132] = true,
        [134] = true,
        [141] = true,
        [142] = true,
        [146] = true,
        [153] = true,
        [154] = true,
        [155] = true,
        [169] = true,
        [170] = true,
        [174] = true,
        [178] = true,
        [180] = true,
        [185] = true,
        [187] = true,
        [189] = true,
        [194] = true,
        [211] = true,
        [212] = true,
        [230] = true,
        [233] = true,
        [234] = true,
        [235] = true,
        [237] = true,
    },
    ["Male_freemode_mpLTS"] = {[0] = true},
    ["Female_freemode_mpLTS"] = {[0] = true},
    ["Male_Heist"] = {
        [0] = true,
        [2] = true,
        [12] = true,
        [13] = true,
        [16] = true,
        [17] = true,
        [18] = true,
        [20] = true,
        [21] = true,
        [22] = true,
        [23] = true,
    },
    ["Female_Heist"] = {
        [0] = true,
        [2] = true,
        [12] = true,
        [13] = true,
        [16] = true,
        [17] = true,
        [18] = true,
        [20] = true,
        [21] = true,
        [22] = true,
        [23] = true,
    },
    ["mp_m_xmas_03"] = {[3] = true, [4] = true, [11] = true},
    ["mp_f_xmas_03"] = {[3] = true, [4] = true, [11] = true},
    ["mp_m_stunt_01"] = {[0] = true},
    ["mp_f_stunt_01"] = {[0] = true},
    ["mp_m_importexport_01"] = {[8] = true, [11] = true},
    ["mp_f_importexport_01"] = {[8] = true, [11] = true},
    ["mp_m_gunrunning_01"] = {[1] = true, [3] = true},
    ["mp_f_gunrunning_01"] = {[1] = true, [3] = true},
    ["mp_m_smuggler_01"] = {[1] = true, [2] = true, [3] = true, [7] = true},
    ["mp_f_smuggler_01"] = {[1] = true, [2] = true, [3] = true, [7] = true},
    ["mp_m_christmas2017"] = {[1] = true, [2] = true, [5] = true, [9] = true, [11] = true},
    ["mp_f_christmas2017"] = {[1] = true, [2] = true, [5] = true, [9] = true, [11] = true},
    ["mp_m_christmas2018"] = {[0] = true, [7] = true, [8] = true, [12] = true},
    ["mp_f_christmas2018"] = {[0] = true, [7] = true, [8] = true, [12] = true},
    ["mp_m_vinewood"] = {[5] = true, [6] = true, [7] = true},
    ["mp_f_vinewood"] = {[5] = true, [6] = true, [7] = true},
    ["mp_m_heist3"] = {[9] = true, [10] = true, [14] = true, [18] = true},
    ["mp_f_heist3"] = {[9] = true, [10] = true, [14] = true, [18] = true},
    ["mp_m_sum"] = {[0] = true},
    ["mp_f_sum"] = {[0] = true},
    ["mp_m_heist4"] = {[0] = true, [2] = true, [4] = true},
    ["mp_f_heist4"] = {[0] = true, [2] = true, [4] = true},
    ["mp_m_tuner"] = {[4] = true},
    ["mp_f_tuner"] = {[4] = true},
    ["mp_m_christmas3"] = {[2] = true, [3] = true},
    ["mp_f_christmas3"] = {[2] = true, [3] = true},
    ["mp_m_2023_02"] = {[4] = true, [7] = true, [8] = true, [9] = true},
    ["mp_f_2023_02"] = {[4] = true, [7] = true, [8] = true, [9] = true},
    ["mp_m_2024_01"] = {[0] = true},
    ["mp_f_2024_01"] = {[0] = true},
    ["soz_bcso"] = {[1] = true, [2] = true, [3] = true},
}

Citizen.CreateThread(function()
    local numHairColors = GetNumHairColors();
    local numMakeupColors = GetNumMakeupColors();

    for i = 0, numHairColors - 1 do
        local r, g, b = GetHairRgbColor(i);

        table.insert(Colors.Hair, {value = i, label = "HAIR_COLOR_" .. i, r = r, g = g, b = b});
    end

    for i = 0, numMakeupColors - 1 do
        local r, g, b = GetMakeupRgbColor(i);

        table.insert(Colors.Makeup, {value = i, label = "MAKEUP_COLOR_" .. i, r = r, g = g, b = b});
    end
end)

function Clone(obj)
    if type(obj) ~= "table" then
        return obj
    end

    local res = {}

    for k, v in pairs(obj) do
        res[Clone(k)] = Clone(v)
    end

    return res
end

--- Exports
exports("GetLabels", function()
    return Labels
end)

exports("GetColors", function()
    return Colors
end)
