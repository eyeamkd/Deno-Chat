import { html, render, useEffect, useState } from 'https://unpkg.com/htm/preact/standalone.module.js'; 

let ws; 

export const Chat=()=>{ 
    const [messages, setMessages] = useState([]); 

    onReceiveMessage=({data})=>{ 
        setMessages( prevMessages => ([...prevMessages, data]))
    }

    onSendMessage=(event)=>{
        const message =  event.target[0].value; 
        event.preventDefault(); 
        ws.send(message); 
        event.target[0].value = ''; 
    } 

    useEffect( ()=> { 
        if(ws)
            ws.close() 
        ws =  new WebSocket(`ws://${window.location.host}/ws`);  
        ws.addEventListener("message",onReceiveMessage); 
        
        return()=>{
            ws.removeEventListener("message",onReceiveMessage); 
        }
    },[]) 

    return html`
            ${messages.map(message => html`
                <div>${message}</div>
            `)}

            <form onSubmit=${onSendMessage}>
            <input type="text" />
            <button>Send</button>
            </form>
        `
} 

render(html`<${Chat} />`, document.getElementById('app')); 
