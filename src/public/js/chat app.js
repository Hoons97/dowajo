const socket = io();
//Socket.io 가 자동으로 실행중인 io서버를 찾아서 연결

const welcome = document.getElementById("welcome");
const room = document.getElementById("room");
const form = welcome.querySelector("form");

room.hidden = true;

let roomname;

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room : ${roomname}`;
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function addMessage(message){
    const ul = room.querySelector('ul');
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}
function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    socket.emit("new_message", input.value, roomname, ()=>{
        addMessage(`You: ${input.value}`);
        input.value = '';
    });
}


function handleRoomSubmit(event){
    event.preventDefault();
    const nickname = form.querySelector("#nickname");
    const room = form.querySelector('#roomname');
    socket.emit("enter_room", room.value, nickname.value, showRoom);
    //Socket.io로 room 이벤트를 전달, 내용을 원하는 숫자만큼 type 상관없이 전달, 
    //마지막 argument 로 서버에서 실행시킬 수 있는 프론트 함수를 전달 할 수 있음
    roomname=room.value;
}



socket.on("welcome", (nickname, pCount)=>{
    addMessage(`${nickname} joined the Room!`);
    setpCount(pCount);
})

socket.on("bye", (nickname, pCount)=>{
    addMessage(`${nickname} left the Room!`);
    setpCount(pCount);
})

socket.on("new_message", addMessage);
form.addEventListener("submit", handleRoomSubmit);

socket.on("room_change", (rooms)=>{
    console.log(rooms);
    const roomList= welcome.querySelector("ul");
    roomList.innerText='';
    rooms.forEach((room)=>{
        const li =document.createElement("li");
        li.innerText = room;
        roomList.appendChild(li);
    })
});

function setpCount(count){
    const h5 = room.querySelector("h5");
    h5.innerText=`현재 접속 수 : ${count}명`;
}