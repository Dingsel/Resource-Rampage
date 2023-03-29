import { Vector } from "@minecraft/server";

const {subtract} = Vector
export class SafeAreas extends Set{
    add(area){
        if(!(area instanceof Area)) throw new TypeError('Is not type of area');
        super.add(area);
    }
    remove(area){return this.delete(area);}
    isValid(loc){
        for (const o of this) {
            if(o.inArea(loc)) return false;
        }
        return true;
    }
}

export class Area{
    constructor(centerArea){
        this.center = centerArea;
    }
    inArea(){return false};
}
export class CubeRadiusArea extends Area{
    constructor(center,radius){
        super(center);
        this.radius = radius;
    }
    get location1(){
        const {center:{x,y,z},radius:r} = this;
        return {x:x-r,y:y-r,z:z-r};
    }
    get location2(){
        const {center:{x,y,z},radius:r} = this;
        return {x:x+r,y:y+r,z:z+r};
    }
    inArea({x: ax,y: ay,z: az}){
        const {location1:{x:bx,y:by,z:bz},location2:{x:cx,y:cy,z:cz}} = this;
        return (ax >= bx && ax < cx) && (ay >= by && ay < cy) && (az >= bz && az < cz);
    }
}
export class RadiusArea extends Area{
    constructor(center,radius){
        super(center);
        this.radius = radius;
    }
    get pR(){return this.radius**2;}
    inArea(loc1){
        const {pR,center}=this;
        const {x,y,z} = subtract(loc1,center);
        return (x**2 <= pR) && (y**2 <= pR) && (z**2 <= pR);
    }
}
export class FromToArea extends Area{
    constructor(from, to){
        super(from);
        this.location2 = to;
    }
    get location1(){return this.center};
    inArea({x: ax,y: ay,z: az}){
        const {location1:{x:bx,y:by,z:bz},location2:{x:cx,y:cy,z:cz}} = this;
        return (ax >= bx && ax < cx) && (ay >= by && ay < cy) && (az >= bz && az < cz);
    }
}