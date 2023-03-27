export const Textures = {
    IconTowers:"textures/icons/mageTower_1.png",
    IconWall:"textures/icons/walls.png",
    ColorPicker: "textures/ui/color_picker",
    PaintBrush: "textures/ui/mashup_PaintBrush",
    ColorBrush: "textures/ui/text_color_paintbrush",
    Reset: "textures/ui/recap_glyph_desaturated",
    Back: "textures/ui/back_button_hover",
}


export const EntityIds = {
    coin: "dest:coin",
    database: "dest:database"
}
export const ItemIds = {

}
export const BlockIds = {

}
export const StructureIds = {
    Enchantments: "x_enchantments",
    Mage1:"mage_1",
    Mage2:"mage_2",
    Mage3:"mage_3",
    Archer1:"archer_1",
    Archer2:"archer_2",
    Archer3:"archer_3",
    Castle1:"castle_1",
    House1:"house_1"
}
export const StructureSizes = {
    [StructureIds.Archer1]: [5,7,5],
    [StructureIds.Archer2]: [5,9,5],
    [StructureIds.Archer3]: [5,9,5],
    [StructureIds.Castle1]: [11,13,11],
    [StructureIds.Enchantments]: [1,1,1],
    [StructureIds.House1]:[20,12,20],
    [StructureIds.Mage1]:[5,5,5],
    [StructureIds.Mage2]:[5,10,5],
    [StructureIds.Mage3]:[11,12,11]
}
export const MageTowerLevelStructure = [StructureIds.Mage1,StructureIds.Mage2,StructureIds.Mage3];
export const ArcherTowerLevelStructure = [StructureIds.Archer1,StructureIds.Archer2,StructureIds.Archer3];

export const towers = [
    {
        alias: "Mage Tower",
        description: "Burns Enemies!",
        structureId: "mage_1",
        type: "mage",
        tier: 1,
        icon: "textures/icons/mageTower_1.png",
        size: [5, 5]
    },
    {
        alias: "Archer Tower",
        description: "Single Target, High DPS",
        structureId: "archer_1",
        type: "archer",
        tier: 1,
        icon: "textures/items/arrow.png",
        size: [5, 5]
    }
]

export const towerUpgrades = [
    {
        alias: "Mage Tower",
        description: "Burns Enemies!",
        structureId: "mage_2",
        type: "mage",
        tier: 2,
        icon: "textures/icons/mageTower_2.png",
        size: [5, 5]
    },
    {
        alias: "Mage Tower",
        description: "Burns Enemies!",
        structureId: "mage_3",
        type: "mage",
        tier: 3,
        icon: "textures/icons/mageTower_3.png",
        size: [11, 11]
    },
    {
        alias: "Archer Tower",
        description: "Single Target, High DPS",
        structureId: "archer_1",
        type: "archer",
        tier: 2,
        icon: "textures/items/arrow.png",
        size: [5, 5]
    }
]
