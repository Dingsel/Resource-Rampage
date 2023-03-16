import { ScoreboardIdentityType, ScoreboardObjective } from "@minecraft/server";

export class Castle{
    /** @param {ScoreboardObjective} objective */
    constructor(objective){
        if(!objective instanceof ScoreboardObjective) throw new TypeError("Must be objective class!");
        this.#objective = objective;
        for (const o of objective.getParticipants()) 
            if(o.type == ScoreboardIdentityType.fakePlayer && o.displayName == 'coins') { this.#coins = o; break; }
        if(this.#coins == undefined) throw new TypeError("This objective has no coins on it");
    }
    /** @param {number} numer @returns {number} */
    addCoins(number){this.#coins.setScore(this.#objective,this.getCoins() + number); return number;}
    /** @param {number} numer @returns {number} */
    setCoins(number){this.#coins.setScore(this.#objective, number);return number;}
    /** @returns {number} */
    getCoins(){this.#coins.getScore(this.#objective);}
    /** @returns {ScoreboardObjective} */
    getObjective(){return this.#objective;}
    #objective;
    #coins;
}