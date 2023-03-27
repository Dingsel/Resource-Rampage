export class SafeAreas extends Set{
    add(area){if(!area instanceof Area) throw new TypeError('Is not type of area'); super.add(area);}
    remove(area){return this.delete(area);}
    inArea(loc){
        for (const o of this) if(o.inArea(loc)) return false;
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
        const {x,y,z} = this.center, r = this.radius;
        return {x:x-r,y:y-r,z:z-r};
    }
    get location2(){
        const {x,y,z} = this.center, r = this.radius;
        return {x:x+r,y:y+r,z:z+r};
    }
    inArea({x,y,z}){
        const loc1=this.location1,loc2=this.location2;
        return (x >= loc1.x && x < loc2.x) && (y >= loc1.y && y < loc2.y) && (z >= loc1.z && z < loc2.z);
    }
}
export class RadiusArea extends Area{
    constructor(center,radius){
        super(center);
        this.radius = radius**2;
    }
    get pR(){return this.radius**2;}
    inArea(loc1){
        const x = loc1.x - this.center.x, y = loc1.y - this.center.y, z = loc1.z - this.center.z;
        return (x**2 <= this.pR) && (y**2 <= this.pR) && (z**2 <= this.pR);
    }
}
export class FromToArea extends Area{
    constructor(from, to){
        super(from);
        this.location2 = to;
    }
    get location1(){return this.center};
    inArea({x,y,z}){
        const loc1=this.location1,loc2=this.location2;
        return (x >= loc1.x && x < loc2.x) && (y >= loc1.y && y < loc2.y) && (z >= loc1.z && z < loc2.z);
    }
}