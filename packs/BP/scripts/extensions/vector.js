import { Vector } from "@minecraft/server";

Object.defineProperties(Vector, {
    from:{value({x,y,z}){
        return new this(x,y,z);
    }},
    normalized:{value(loc){
        return this.from(loc).normalized();
    }},
    dot:{value({x:ax,y:ay,z:az},{x:bx,y:by,z:bz}){
        return ax * bx + ay * by + az * bz;
    }},
    equals:{value(l1,l2){return l1.x==l2.x&&l1.y==l2.y&&l1.z==l2.z}}
});