import { MolangVariableMap, Vector } from "@minecraft/server";
const v = "variable.";
const currentVariableId = "variable.current";
const Variables = {
    "sets":"sets",
    "color":"color",
    "sd":"sd",
    "var":"var"
}
const defualtRGBA = {red:1,green:1,blue:1,alpha:1};
export class DestParticleProperties{
    getMolangVariableMap(){
        return new MolangVariableMap();
    }
    get variableMap(){return this.getMolangVariableMap()}
}
export class DestParticlePropertiesBuilder extends DestParticleProperties{
    constructor(){
        super();
        this.speed = 1;
        this.settings = Object.create(defualtRGBA);
        this.color = Object.create(defualtRGBA);
        this.var = Object.create(defualtRGBA);
    }
    get direction(){
        return this.#direction;
    }
    #direction = new Vector(1,1,1);
    getMolangVariableMap(){
        return super.getMolangVariableMap()
            .setSpeedAndDirection(v+Variables.sd,this.speed,this.#direction)
            .setColorRGBA(v+Variables.color,this.color)
            .setColorRGBA(v+Variables.sets,this.settings)
            .setColorRGBA(v+Variables.var,this.var);
    }
}
export class DefaultParticlePropertiesBuilder extends DestParticleProperties{
    constructor(){super();this.#property = new DestParticlePropertiesBuilder();}
    /**@param {number} speed @returns {this}*/
    setSpeed(speed){this.#property.speed = speed;return this;}
    /**@param {import("@minecraft/server").Vector3} direction @returns {this}*/
    setDirection({x,y,z}){
        const p = this.#property.direction;
        p.x = x;
        p.y = y;
        p.z = z;
        return this;
    }
    #property;
    /**@param {import("@minecraft/server").Color} direction @returns {this}*/
    setColor({red=1,green=1,blue=1,alpha=1}){
        Object.assign(this.#property.color,{red,green,blue,alpha});
        return this;
    }
    /**@param {number} amount @returns {this}*/
    setAmount(amount){this.#property.settings.alpha = amount;return this;}
    /**@param {number} time @returns {this}*/
    setLifeTime(time){this.#property.settings.green = time;return this;}
    /**@param {number} scale @returns {this}*/
    setScale(scale){this.#property.settings.blue = scale;return this;}
    /**@param {number} motion @returns {this}*/
    setDynamicMotion(motion){this.#property.settings.red = motion;return this;}
    /**@param {number} value @returns {this}*/
    setVar1(value){this.#property.var.red = value;return this;}
    /**@param {number} value @returns {this}*/
    setVar2(value){this.#property.var.green = value;return this;}
    /**@param {number} value @returns {this}*/
    setVar3(value){this.#property.var.blue = value;return this;}
    /**@param {number} value @returns {this}*/
    setVar4(value){this.#property.var.alpha = value;return this;}

    getMolangVariableMap(){
        return this.#property.getMolangVariableMap();
    }
}
export class ImpulseParticlePropertiesBuilder extends DefaultParticlePropertiesBuilder{
    constructor(radius = 5){
        super();
        this.setScale(0.2);
        this.setRadius(radius);
    }
    /**@param {number} radius @returns {this} */
    setRadius(radius){
        this.setAmount(radius * 15);
        this.setSpeed(radius);
        return this.setLifeTime(5 + radius/5);
    }
}
export class SquareParticlePropertiesBuilder extends DefaultParticlePropertiesBuilder{
    constructor(radius = 5){
        super();
        this.setScale(0.2);
        this.setSpeed(0);
        this.setLifeTime(0.1);
        this.setRadius(radius);
    }
    /**@param {number} radius @returns {this} */
    setRadius(radius){
        this.setAmount(radius * 8);
        this.setVar1(radius);
        return this;
    }
}
Object.assign(DestParticlePropertiesBuilder.prototype,{
    speed:1,
    settings: Object.create(defualtRGBA),
    color: Object.create(defualtRGBA),
    var: Object.create(defualtRGBA)
});