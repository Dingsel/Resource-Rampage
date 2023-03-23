import { Vector } from "@minecraft/server";

Object.defineProperties(Vector, {
    from:{value({x,y,z}){
        return new this(x,y,z);
    }},
    normalized:{value(loc){
        return this.from(loc).normalized();
    }},
    dot:{value(a,b){
        const{x,y,z}=this.multiply(a,b);return x+y+z;
    }},
    equals:{value(l1,l2){return l1.x==l2.x&&l1.y==l2.y&&l1.z==l2.z}}
});