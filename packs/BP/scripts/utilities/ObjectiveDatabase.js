import { CommandResult, ScoreboardIdentityType, ScoreboardObjective } from "@minecraft/server";

const sets = new Map();
const splitKey = '.\n$_';
const matchRegex = /\.\n\$\_/g;
const {scoreboard} = world;
/**
 * Database
 */
export class Database extends Map{
    /**@param {string} objective @returns {Database} */
    static createDatabase(name){
        return this.getDatabase(scoreboard.getObjective(name)??scoreboard.addObjective(name,name));
    }
    /**@param {ScoreboardObjective} objective @returns {Database} */
    static getDatabase(objective){
        if(!objective instanceof ScoreboardObjective) throw new TypeError("First Argument must be type of ScoreboardObjective");
        if(sets.has(objective.id)) return sets.get(objective.id);
        const n = new Database(objective);
        sets.set(objective.id,n);
        return n;
    }
    /**@param {Database} databse */
    static deleteDatabase(databse){
        if(sets.has(databse.id)) sets.delete(databse.id);
        world.scoreboard.removeObjective(databse.objective);
        return true;
    }
    /**
     * Create a new database!
     * @protected
     * @param {ScoreboardObjective} objective
     */
    constructor(objective) {
        super();
        this.#objective = objective;
        this.#id = objective.id;
        this.#participants = new Map();
        for (const p of objective.getParticipants()) {
            if(p.type == ScoreboardIdentityType.fakePlayer){
                const [key,value] = p.displayName.split(splitKey);
                const v = JSON.parse(value.replaceAll("\\\"","\""));
                super.set(key,v);
                this.#participants.set(key,p);
            }
        }
    }
    /**
     * Set a value from a key
     * @param {string} key Key to set
     * @param {any} value The value
     */
    async set(key, value) {
        if (value==undefined) throw new TypeError("Value must be defined");
        if (key.match(matchRegex)) throw new TypeError(`Database keys can't include "${splitKey}"`);
        const build = key + splitKey + JSON.stringify(value).replaceAll(/"/g, '\\"');
        if ((build.length + 1) > 32000) throw new Error(`Database setter to long... somehow`);
        if (this.has(key)) this.#objective.removeParticipant(this.#participants.get(key));
        await runCommand(`scoreboard players set "${build}" "${this.#id}" 0`);
        const p = this.#objective.getParticipants().find(pa=>pa.displayName.startsWith(key + splitKey));
        if(p == undefined) throw new Error("Value could be settet");
        this.#participants.set(key,p);
        super.set(key, value);
    }
    /**
     * Delete a key from the database 
     * @param {string} key Key to delete from the database
     */
    delete(key) {
        if (key.match(matchRegex))
            throw new TypeError(`Database keys can't include "${splitKey}"`);
        if (!this.has(key)) return false;
        this.#objective.removeParticipant(this.#participants.get(key));
        this.#participants.delete(key);
        return super.delete(key);
    }
    clear() {
        scoreboard.removeObjective(this.#objective);
        this.#objective = scoreboard.addObjective(this.#id,this.#id);
        this.#participants.clear();
        return super.clear();
    }
    #id;
    #objective;
    #participants;
    /**@returns {string} */
    getId(){return this.#id;}
    /**@returns {ScoreboardObjective} */
    getScoreboardObjective(){return this.#objective;}
}
/**
 * Run a command!
 * @param {string} cmd Command to run
 * @returns {Promise<CommandResult>} Whether or not the command errors, and command data
 * @example runCommand(`give @a diamond`)
 */
function runCommand(cmd) {
    return overworld.runCommandAsync(cmd);
}