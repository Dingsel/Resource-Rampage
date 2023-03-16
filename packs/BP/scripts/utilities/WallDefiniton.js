import { Block, BlockPermutation, BlockType, MinecraftBlockTypes } from "@minecraft/server";

export const Direction = {
    forward: "forward",
    backward: "backward",
    left: "left",
    right: "right"
}
export const MirrorDirection = {
    forward:"backward",
    backward:"forward",
    left:"right",
    right:"left"
}
export class WallDefiniton{
    constructor(){}
    /**@returns {this} @param {LayerDefinition} layer */
    setBody(layer){
        this.bodyLayer = layer;
        return this;
    }
    /**@returns {this} @param {LayersDefinition} upLayers */
    setUpLayers(upLayers){
        this.upLayers = upLayers;
        return this;
    }
    /**@returns {this} @param {LayersDefinition} downLayers */
    setDownLayers(downLayers){
        this.downLayers = downLayers;
        return this;
    }
}
export class LayersDefinition{
    /** @param {LayerDefinition[]} layers */
    constructor(layers = []){
        this.layers = layers??[];
    }
    /**@returns {LayerDefinition[]} @param {number} index */
    getLayers(index){
        return this.layers;
    }
}
export class LayersDefinitionBuilder extends LayersDefinition{
    /** @param {LayerDefinition} layerDefinition @param {?number} repeat @returns {this} */
    addLayer(layerDefinition,repeat = 1){
        for (let index = 0; index < repeat; index++) this.layers.push(layerDefinition);
        return this;
    }
}
export class LayersOverloadDefinition extends LayersDefinition{
    constructor(){ super([]); }
    /**@param {LayersDefinition} overload @param {?number} repeat @returns {this} */
    addLayerOverload(overload,repeat = 1){
        for (let index = 0; index < repeat; index++) this.layers.push(overload);
        return this;
    }
    /** @returns {LayersDefinition} @param {number} index */
    getLayers(index){
        return this.layers.at(index%this.layers.length);
    }
}
export class LayerDefinition{
    /** @param {?BlockDefinition} middle @param {?BlockDefinition[]} rights @param {?BlockDefinition[]} lefts */
    constructor(middle,rights,lefts){
        this.rights = rights??[];
        this.lefts = lefts??[];
        this.middle = middle?? new BlockDefinition("air");
    }
    /**@param {number} index @returns {this} */
    getLayer(index){
        return this;
    }
}
export class LayerOverloadDefinitionBuilder extends LayerDefinition{
    constructor(){
        super();
        this.overloads = [];
    }
    /**@param {LayerDefinition} layerDefinition @param {?number} repeat @returns {this} */
    addOverload(layerDefinition, repeat = 1){
        for (let index = 0; index < repeat; index++) this.overloads.push(layerDefinition);
        return this;
    }
    /**@param {number} index @returns {ReturnType<LayerDefinition['getLayer']>} */
    getLayer(index){
        return this.overloads[(index%this.overloads.length)]
    }
}
export class LayerDefinitionBuilder extends LayerDefinition{
    /**@param {(BlockDefinition | BlockType | BlockPermutation)[]} rights @returns {this} */
    setRights(rights){
        if(!Array.isArray(rights)) rights = [rights];
        this.rights = [...from(rights)];
        return this;
    }
    /**@param {(BlockDefinition | BlockType | BlockPermutation)} one @returns {this} */
    setMiddle(one){
        this.middle = from([one]).next().value;
        return this;
    }
    /**@param {(BlockDefinition | BlockType | BlockPermutation)[]} lefts @returns {this} */
    setLefts(lefts){
        if(!Array.isArray(lefts)) lefts = [lefts];
        this.lefts = [...from(lefts)];
        return this;
    }
}
export class LayerMirrorDefinitonBuiler extends LayerDefinition{
    constructor(){super();}
    /**@param {(BlockDefinition | BlockType | BlockPermutation)[]} sides @returns {this} */
    setSide(sides){
        if(!Array.isArray(sides)) sides = [sides];
        this.lefts = [...from(sides)];
        this.rights = this.lefts.map(n => new MirroredBlockDefinition(n));
        return this;
    }
    /**@param {(BlockDefinition | BlockType | BlockPermutation)} one @returns {this} */
    setMiddle(one){
        this.middle = from([one]).next().value;
        return this;
    }
}
export class BlockDefinition{
    /** @param {string | BlockType | BlockPermutation} type @param {?Record<string,string | number | boolean>} permutation */
    constructor(type, permutation)
    {
        if(type == BlockDefinition.private) return
        if(type instanceof BlockType) this.permutation = BlockPermutation.resolve(...[type.id, permutation]);
        else if (type instanceof BlockPermutation) this.permutation = type;
        else if (typeof type == 'string' || type instanceof String) this.permutation =  BlockPermutation.resolve(...["" + type, permutation]);
        else throw new TypeError("Is not a block " + type);
    }
    /** @param {keyof Direction} direction @returns {BlockPermutation} */
    getBlock(direction){
        return directionTransaction(this.permutation, direction);
    }
    static private = Symbol("Private constructor");
}
export class MirroredBlockDefinition extends BlockDefinition{
    /** @param {BlockDefinition} blockDefinition */
    constructor(blockDefinition){
        super(BlockDefinition.private);
        this.blockDefintion = blockDefinition;
    }
    /** @param {keyof Direction} direction @returns {BlockPermutation} */
    getBlock(direction){
        return this.blockDefintion.getBlock(MirrorDirection[direction]);
    }
}
export class DirectionOffsetBlockDefinition extends BlockDefinition{
    /** @param {BlockDefinition} blockDefinition @param {keyof Direction} direction */
    constructor(blockDefinition, direction){
        super(BlockDefinition.private);
        this.blockDefintion = blockDefinition;
    }
    /** @param {keyof Direction} direction @returns {BlockPermutation} */
    getBlock(direction){
        return this.blockDefintion.getBlock(MirrorDirection[direction]);
    }
}
const PropertyNames = {
    weirdo_direction:"weirdo_direction", //mirro + 1 to transform
    direction:"direction", //mirror + 2
}
const PropertyTransactions = {
    [PropertyNames.weirdo_direction]:{
        0:0,
        1:3,
        2:1,
        3:2
    }
}
const baseTransaction = {
    "forward": 0,
    "left": 1,
    "backward":2,
    "right":3
}
/**@param {BlockPermutation} permutation @param {keyof Direction} direction  @returns {BlockPermutation} */
function directionTransaction(permutation, direction){
    let perm = permutation;
    let baseFix = baseTransaction[direction];
    for (const n of Object.getOwnPropertyNames(PropertyTransactions)) {
        let property = perm.getProperty(n);
        if(property!=undefined){
            let transaction = PropertyTransactions[n][property] + baseFix;
            let fix = PropertyTransactions[n][transaction%4];
            perm = perm.withProperty(n,fix);
        }
    }
    return perm;
}
function* from(anys){
    for (const n of anys) {
        if(n instanceof BlockDefinition) yield n;
        else yield new BlockDefinition(n);
    }
}