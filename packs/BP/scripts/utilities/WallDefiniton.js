import { Block, BlockPermutation, BlockType, MinecraftBlockTypes } from "@minecraft/server";

export class WallDefiniton{
    constructor(){}
    /**@returns {this} @param {LayerDefinition} layer */
    setBody(layer){
        this.bodyLayer = layer;
        return this;
    }
    /**@returns {this} @param {LayersDefinition} upLayers */
    setUpLayers(upLayers){
        if(!Array.isArray(upLayers)) upLayers = [upLayers]
        this.upLayers = upLayers;
        return this;
    }
    /**@returns {this} @param {LayersDefinition} downLayers */
    setDownLayers(downLayers){
        if(!Array.isArray(downLayers)) downLayers = [downLayers];
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
    /** @param {LayerDefinition} layerDefinition @returns {this} */
    addLayer(layerDefinition){
        this.layers.push(layerDefinition);
        return this;
    }
}
export class LayersOverloadDefinition extends LayersDefinition{
    constructor(){ super([]); }
    /**@param {LayersDefinition} overload @returns {this} */
    addLayerOverload(overload){
        this.layers.push(overload);
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
    /**@param {LayerDefinition} layerDefinition @returns {this} */
    addOverloads(layerDefinition){
        this.overloads.push(layerDefinition);
        return this;
    }
    /**@param {number} index @returns {ReturnType<LayerDefinition['getLayer']>} */
    getLayer(index){
        this.overloads[index%this.overloads.length].getLayer(index);
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
    /**@param {(BlockDefinition | BlockType | BlockPermutation)[]} sides @returns {this} */
    setSide(sides){
        if(!Array.isArray(sides)) sides = [sides];
        this.rights = [...from(sides)];
        this.lefts = this.sides;
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
        if(type instanceof BlockType) this.permutation = BlockPermutation.resolve(...[type.id, permutation]);
        else if (type instanceof BlockPermutation) this.permutation = type;
        else if (typeof type == 'string' || type instanceof String) this.permutation =  BlockPermutation.resolve(...["" + type, permutation]);
        else throw new TypeError("Is not a block " + type);
    }
    /** @param {boolean} rotation @param {boolean} mirror @returns {BlockPermutation} */
    getBlock(rotation, mirror){
        return this.permutation;
    }
}
export class BlockDirectionBindingDefinition extends BlockDefinition{
    /** @param {string | BlockType | BlockPermutation} type @param {Record<string,string | number | boolean>} permutation @param {string} direction_property_name */
    constructor(type, permutation, direction_property_name){
        super(type,permutation);
        this.direction_property_name = direction_property_name;
    }
    /** @param {boolean} rotation @param {boolean} mirror @returns {BlockPermutation} */
    getPermutation(rotation, mirror){
        return super.getBlock(rotation,mirror);
    }
}

function* from(anys){
    for (const n of anys) {
        if(n instanceof BlockDefinition) yield n;
        else yield new BlockDefinition(n);
    }
}