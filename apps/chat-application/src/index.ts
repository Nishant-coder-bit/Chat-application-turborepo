import {WebSocket, WebSocketServer} from 'ws';

const wss = new WebSocketServer({port:8080});
interface User{
     socket:WebSocket,
     room: string
}
let allSocket:User[] = [];

wss.on("connection",(socket)=>{



     socket.on("message",(message:any)=>{
          const parsedMessage = JSON.parse(message);

          if(parsedMessage.type == 'Join'){
              allSocket.push({
                 socket:socket,
                 room:parsedMessage.payload.roomId
              })
          }
          else if(parsedMessage.type == 'Chat'){
            let findSocket = allSocket.find((x) => x.socket == socket);
           let roomId = findSocket?.room;
            let socketNew=allSocket.filter((x)=>x.room==roomId);
            socketNew.forEach((x)=>{
                x.socket.send(parsedMessage.payload.message);
            })
              
          }
       
     })
})