import { MinecraftBlockTypes } from "@minecraft/server";
import { InfoMapProperties } from "resources";

events.blockBreak.subscribe(async ({brokenBlockPermutation,player,block})=>{
    if(brokenBlockPermutation.hasTag('stone')) global.infoMap.relative(InfoMapProperties.stones,1);
    else if (brokenBlockPermutation.hasTag('wood')) global.infoMap.relative(InfoMapProperties.woods,1);
    else return;
    block.setType(MinecraftBlockTypes.invisibleBedrock);
    await sleep(180);
    block.setPermutation(brokenBlockPermutation);
})