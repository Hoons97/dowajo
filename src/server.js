import http from "http";
import express from "express";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui"
const app = express();

app.set("view engine", "pug");
//프론트 엔진을 pug 로 설정
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
//메인페이지 접속시 home.pug를 렌더링
app.get("/*", (req, res) => res.redirect("/"));
//다른 하위페이지 접속시 메인페이지로 리디렉션



const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true
    }
});

instrument(wsServer, {
    auth: false,
    mode: "development",
})
//socket io admin UI 설정

wsServer.on("connection", socket=>{
    console.log("connection started");
    socket.on("join_room", (roomName)=>{
        socket.join(roomName);
        socket.to(roomName).emit("welcome");
    })

    socket.on("offer", (offer, roomName)=>{
        socket.to(roomName).emit("offer", offer);
    });

    socket.on("answer", (answer, roomName)=>{
        socket.to(roomName).emit("answer", answer);
    });

    socket.on("ice", (ice, roomName)=>{
        socket.to(roomName).emit("ice", ice);
    });

    socket.on("hi",()=>{
        console.log("someone said hi");
        socket.emit("hi");
    })
})

const handleListen = () => console.log(`Listening on http://localhost:3000`);
//express에서 http 프로토콜을 이용한 서버를 다룸
httpServer.listen(3000, handleListen);
































/* Socket.io 채팅 코드
const {
    sockets: {
        adapter: { sids, rooms },
    },
} = wsServer;
//아래 코드와 같음
//const sids = wsServer.sockets.adapter.sids;
//const rooms = wsServer.sockets.adapter.rooms;
//wsServer.sockets.adapter 안에 소켓 id 값을 갖는 map 인 sid,
//룸 id 값을 갖는 map 인 rooms 가 존재


function publicRooms() {

    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined)
            publicRooms.push(key);
    })
    //만약 rooms의 key가 sids에 존재하지 않는다면 해당 키는 public room

    return publicRooms;

}

function countRoom(roomName) {
    return rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
    //Socket.IO 통신
    //console.log(socket);

    socket.emit("room_change", publicRooms());
    //소켓에게 room_change 이벤트 전달

    console.log(sids);
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    })

    socket.on("enter_room", (roomName, nickname, done) => {
        console.log(roomName);
        socket.join(roomName);
        //room 에 참가
        socket["nickname"] = nickname;

        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        //자신을 제외하고 roomName 의 방에게 welcome 이벤트 전달
        socket.emit("welcome", "you", countRoom(roomName));
        wsServer.sockets.emit("room_change", publicRooms());
        //연결된 모든 소켓에게 room_change 이벤트 전달
        done();
    });
    //socket IO 로 받은 'enter_room' 이벤트에 대한 코드 작성

    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1));
        //나갈때 해당 유저가 참여중이었던 모든 룸에 이벤트 전달
    });

    socket.on("disconnect", () => {
        //나간 후 이벤트
        wsServer.sockets.emit("room_change", publicRooms());
        //연결된 모든 소켓에게 room_change 이벤트 전달
    });

    socket.on("nickname", (nickname) => { socket["nickname"] = nickname; });
    socket.on("new_message", (msg, roomname, done) => {
        socket.to(roomname).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    })
})

*/




/* ws 활용 코드
const wss = new WebSocket.Server({ server });
//같은 express서버에서 http 서버와 webSocket 서버를 같이 작동
//localhost 의 같은 포트에서 webSocket과 http를 동시에 다룰 수 있음

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anonymous";
    //기본 닉네임은 Anonymous
    console.log("Connected to browser");
    socket.on("close", () => {
        console.log("Disconnected from the Browser");
    });

    //소켓 서버로 메시지를 받았을 때
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        console.log(message);
        //string으로 받은 메시지를 object로 변환
        switch (message.type) {
            case "message":
                //받은 메시지가 'msg'라면 모든 유저에게 전달
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
                break;

            case "nickname":
                //받은 메시지가 'nickname'일 경우
                socket["nickname"]=message.payload;
                //소켓 객체에 닉네임 프로퍼티 추가
                break;
        }
    });
    socket.send("hello");
    console.log(sockets.length);
});
*/

