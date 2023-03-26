import { BlockType, world, Vector } from "@minecraft/server";
import { level_1 } from "resources/wall_definitions";

export async function buildWall(from, to, wallDefinition = level_1, dimension = world.overworld) {
    const gen = path(from, to);
    const direction = getDirection(from,to);
    let i = 0;
    for (const loc of gen) {
        await place(wallDefinition,loc,dimension,direction,i++);
    }
}
async function place(definition = level_1, base, d = world.overworld, direction,index){
    const {x,y:yb,z} = base;
    let block = getMostDown(d,base);
    let difference = block.y - yb;
    let y = block.y;
    for (const layer of definition.downLayers.getLayers(index)) {
        placeLayer({x,y,z},direction,d,layer.getLayer(index));
        difference++;
        y++;
        await null;
    }
    for(let a = difference, layer = definition.bodyLayer.getLayer(index); a <= 0; a++, y++){
        placeLayer({x,y,z},direction,d,layer);
        await null;
    }
    for (const layer of definition.upLayers.getLayers(index)) {
        placeLayer({x,y,z},direction,d,layer.getLayer(index));
        y++;
        await null;
    }
}


function placeLayer(loc, direction, dimension, layer){
    dimension.setBlock(loc, layer.middle.getBlock(direction));
    const {x,y,z} = loc;
    let n = {x,y,z};
    const key = (direction == "forward" || direction == "backward")?"x":"z";
    const changer = (direction == "forward" || direction == "right")?1:-1;
    for (const block of layer.lefts) {
        n[key] += changer;
        dimension.setBlock(n,block.getBlock(direction));
    }
    n = {x,y,z};
    for (const block of layer.rights) {
        n[key] -= changer;
        dimension.setBlock(n,block.getBlock(direction));
    }
}




function getDirection({x:x1,y:y1,z:z1}, {x:x2,y:y2,z:z2}){
    const {x,z} = new Vector(x2-x1, y2-y1, z2-z1).normalized();
    return Math.abs(z) > Math.abs(x)?(z > 0 ? "forward":"backward"):(x > 0?"left":"right");
}
function getMostDown(dimension, {x,y,z}){
    let i = 0;
    while(true){
        try {
            let block = dimension.getBlock({x,y:y - i,z});
            if(block.isSolid()) return block;
            i++;
        } catch (error) {
            return {x,y,z};
        }
    }
}
export function* path({ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }) {
    const x = x2 - x1, y = y2 - y1, z = z2 - z1;
    const maxs = { x: Math.abs(x), y: Math.abs(y), z: Math.abs(z) };
    const key = maxs.x > maxs.z ? (maxs.x > maxs.y ? "x" : "y") : (maxs.z > maxs.y ? "z" : "y"), n = maxs[key];
    const xd = x / n, yd = y / n, zd = z / n;
    let xc = xd, yc = yd, zc = zd;
    yield { x: x1, y: y1, z: z1 };
    for (let i = 0; i < n; i++) {
        yield { x: x1 + xc, y: y1 + yc, z: z1 + zc };
        xc += xd, yc += yd, zc += zd;
    }
}