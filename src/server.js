import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
//프론트 엔진을 pug 로 설정
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
//메인페이지 접속시 home.pug를 렌더링
app.get("/*", (req, res)=>res.redirect("/"));
//다른 하위페이지 접속시 메인페이지로 리디렉션


const handleListen = () => console.log(`Listening on http://localhost:3000`);
//express에서 http 프로토콜을 이용한 서버를 다룸

const server = http.createServer(app);
const wss = new WebSocket.Server({server});
//같은 express서버에서 http 서버와 webSocket 서버를 같이 작동
//localhost 의 같은 포트에서 webSocket과 http를 동시에 다룰 수 있음

const sockets = [];

wss.on("connection", (socket)=>{
    sockets.push(socket);
    console.log("Connected to browser");
    socket.on("close", ()=>{
        console.log("Disconnected from the Browser");
    });

    socket.on("message", (message)=>{
        console.log(message.toString('utf8'));
        sockets.forEach((aSocket)=> aSocket.send(message.toString('utf-8')));
    });
    socket.send("hello");
    console.log(sockets.length);
});

server.listen(3000, handleListen);