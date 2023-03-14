import { BlockType } from "@minecraft/server";
import { level_1 } from "resources/wall_definitions";

export async function buildWall(from, to, wallDefinition = level_1, dimension = overworld) {
    const gen = path(from, to);
    const defGen = fromDefinitionOverloads(level_1);
    for (const { x: x, y: y, z: z, rotated } of gen) {
        let block = dimension.getBlock({x,y,z}), def = defGen.get();
        await placeLayer(def.top,dimension,{x,y,z},rotated);
        for (let i = 1; true; i++) {
            block = dimension.getBlock({x,y:y - i - 1,z});
            if(block.isSolid()){
                await placeLayer(def.bottom,dimension,{x,y:y-i,z},rotated);
                break;
            }else{
                await placeLayer(def.body,dimension,{x,y:y-i,z},rotated);
            }
        }
    }
}
async function placeLayer(layerDefinition, dimension, base, rotated){
    let block = dimension.getBlock(base), def = layerDefinition, offSet = 1;
    block.setType(def.middle);
    for (const d of def.left) {
        dimension.setBlock(offSetRotated(base,offSet++,rotated), d);
        await null;
    }
    offSet=-1;
    for (const d of def.right) {
        dimension.setBlock(offSetRotated(base,offSet--,rotated), d);
        await null;
    }
}
/**@param {WallDefinition} wall_definitions @returns {Generator<WallOverload> & {get(): WallOverload}} */
function* fromDefinitionOverloads(wall_definitions = level_1){
    while(true){
        for (const n of level_1.step_overloads) {
            yield n;
        }
    }
}
fromDefinitionOverloads.prototype.get=function(){return this.next().value;}
function offSetRotated({x,y,z},offSet, rotated){
    return rotated?{x,y,z:z + offSet}:{x:x+offSet,y,z};
}
export function* path({ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }) {
    const x = x2 - x1, y = y2 - y1, z = z2 - z1;
    const maxs = { x: Math.abs(x), y: Math.abs(y), z: Math.abs(z) };
    const rotated = maxs.x > maxs.y;
    const key = maxs.x > maxs.z ? (maxs.x > maxs.y ? "x" : "y") : (maxs.z > maxs.y ? "z" : "y"), n = maxs[key];
    const xd = x / n, yd = y / n, zd = z / n;
    let xc = xd, yc = yd, zc = zd;
    for (let i = 0; i < n; i++) {
        yield { x: x1 + xc, y: y1 + yc, z: z1 + zc, rotated };
        xc += xd, yc += yd, zc += zd;
    }
    yield { x: x1, y: y1, z: z1, rotated };
}
/**@typedef {{right: BlockType[], middle: BlockType, left:BlockType[]}} LayerDefinition */
/**@typedef {{top:LayerDefinition,body:LayerDefinition,bottom:LayerDefinition}} WallOverload */
/**@typedef {{step_overloads:WallOverload[]}} WallDefinition*/