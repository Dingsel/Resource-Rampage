import { Vector } from "@minecraft/server";

Object.defineProperties(Vector, {
    from:{value({x,y,z}){
        return new this(x,y,z);
    }},
    normalized:{value(loc){
        return this.from(loc).normalized();
    }}
});