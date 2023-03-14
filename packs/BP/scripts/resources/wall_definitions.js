import { MinecraftBlockTypes } from "@minecraft/server";


export const level_1 = {
    step_overloads:[
        {
            top:{
                right:[MinecraftBlockTypes.spruceLog],
                middle:MinecraftBlockTypes.stonebrick,
                left:[MinecraftBlockTypes.spruceLog]
            },
            body:{
                right:[],
                middle:MinecraftBlockTypes.basalt,
                left:[]
            },
            bottom:{
                right:[MinecraftBlockTypes.bedrock],
                middle:MinecraftBlockTypes.stonebrick,
                left:[MinecraftBlockTypes.bedrock]
            }
        }
    ]
};

export const definitions = {
    level_1
};