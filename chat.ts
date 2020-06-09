import { WebSocket, isWebSocketCloseEvent } from "https://deno.land/std/ws/mod.ts"; 
import {v4} from "https://deno.land/std/uuid/mod.ts"; 

const users =  new Map<string,WebSocket>();

const broadCast =( message: string, senderId?:string):void =>{ 
    if(!message)
        return; 
    for( let user of users.values()){ 
        user.send( senderId? `${senderId}:${message}` : message); 
    } 
} 

export const chat=async (ws: WebSocket):Promise<void>=>{
        const userId = v4.generate(); 
        users.set(userId,ws); 
        broadCast(`user with the ID ${userId} is here `); 

        for await (const event of ws){ 
            const message = typeof event === 'string' ? event : ''; 
            broadCast(message, userId); 

            if(!message && isWebSocketCloseEvent(event)){ 
                users.delete(userId); 
                broadCast(`user with the ID ${userId} has left the chat `);  
                break;
            }
        }
}