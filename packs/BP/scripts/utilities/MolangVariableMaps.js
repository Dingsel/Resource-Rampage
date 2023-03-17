import { MolangVariableMap, Vector } from "@minecraft/server";
const variableName = "variable.current";

export class AoeMolandVariableMap extends MolangVariableMap{
    //x count;
    //y life;
    //z size scale;
    constructor(){
        super();
        this.#vec = new Vector(50,5,0.2);
        this.#speed = 5;
        this.#udpate();
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
        this.setSpeedAndDirection(variableName,this.#speed,this.#vec);
        return this;
    }
    #vec;
    #speed;
} 