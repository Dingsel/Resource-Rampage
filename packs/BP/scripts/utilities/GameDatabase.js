import { ScoreboardObjective } from '@minecraft/server';
import {Database} from './ObjectiveDatabase.js';

const gameKey = "session_id";
const {scoreboard} = world;

export class GameDatabase extends Database{
    static async Start(objective){
        if(typeof objective == 'string') objective = scoreboard.getObjective(objective)??scoreboard.addObjective(objective,objective);
        if(!objective instanceof ScoreboardObjective) throw new TypeError("Is not instanceof of ScoreboardObjective");
        return new GameDatabase(objective).init();
    }
    constructor(objective){
        super(objective);
    }
    /**@private */
    async init(){
        if(!this.has(gameKey)) await this.set(gameKey,Number.createUID());
        const sessionId = this.get(gameKey);
        this.sessionId = sessionId;
        return this;
    }
    /**@returns {string|undefined} */
    getSessionId(){return this.sessionId;}
}