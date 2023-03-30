import { Vector } from "@minecraft/server";

export function* deathScreen(center,r=175,angle = 15){
    angle *= 1 + Math.random()*3;
    while(true) for (let loc of MovingPath(r * (Math.random()+0.5),angle * 15,angle,Math.random()*360,(Math.random()-0.5)/20,(Math.random()>=0.5)?1:-1).offSet(Vector.add(center,{x:0,y:Math.random()*20 + 10,z:0}))) yield loc;
}

export function* MovingPath(radius = 30, steps = 1,angle = 360, offset=0, motion=0, direction = 1){
    const max = angle*Math.PI / 180;
    const ofset = offset*Math.PI/180;
    for (let x = radius, y = 0, z = 0, i = 0, m = 1; i < max; i+= max/steps*(Math.abs(m)), x = Math.cos((i+ofset)*direction) * radius, z = Math.sin((i+ofset)*direction) * radius, m+=motion) 
    { 
        yield {x,y,z};
    }
}
MovingPath.prototype.offSet = function*({x:x1,y:y1,z:z1}){ for (const {x,y,z} of this) yield {x:x+x1,y:y+y1,z:z+z1}; }