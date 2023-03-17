import { MolangVariableMap, Vector } from "@minecraft/server";
const currentVariableId = "variable.current";
const colorVariableId = "variable.color";

export class ImpulseMolangVariableMap extends MolangVariableMap{
    //x count;
    //y life;
    //z size scale;
    constructor(radius = 5){
        super();
        this.#vec = new Vector(10,5,0.2);
        this.setRadius(radius);
    }
    setRadius(radius){
        this.#vec.x = radius * 15;
        this.#vec.y = 5 + radius/5;
        this.#speed = radius;
        return this.#udpate();
    }
    /**@param {number} speed @returns {this}*/
    setSpeed(speed){
        this.#speed = speed;
        return this.#udpate();
    }
    /**@param {number} speed @returns {this}*/
    setLifeTime(time){
        this.#vec.y = time;
        return this.#udpate();
    }
    /**@param {number} speed @returns {this}*/
    setCount(count){
        this.#vec.x = count;
        return this.#udpate();
    }
    /**@param {number} speed @returns {this}*/
    setScale(scale){
        this.#vec.z = scale;
        return this.#udpate();
    }
    #udpate(){
        this.setSpeedAndDirection(currentVariableId,this.#speed,this.#vec);
        return this;
    }
    #vec;
    #speed;
}
export class CrossImpulseMolangVariableMap extends ImpulseMolangVariableMap{
    /**@param {number} radius @param {import("@minecraft/server").Color} color */
    constructor(radius = 5, color = {red:1,green:1,blue:1,alpha:1}){
        super(radius);
        this.setColorRGBA(colorVariableId,color);
    }
    /** @param {import("@minecraft/server").Color} color @returns {this} */
    setColor(color){
        this.setColorRGBA(colorVariableId, color);
        return this;
    }
}