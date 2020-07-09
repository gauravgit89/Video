const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

let clients = 0;
console.log("335");
io.on("connection", function(socket){
    console.log("336");
    socket.on("NewClient", function(){
        if(clients < 3){
            console.log("CreatePeer 1");
            console.log(clients);
            // this.emit("CreatePeer");
            // clients++;
            if(clients == 0){
                console.log("CreatePeer");
                this.emit("CreatePeer");
            }
        }
        else
        {
            console.log("CreatePeer335");
            this.emit("SessionActive");
            clients++;
        }
    })

    socket.on("Offer", SendOffer);
    socket.on("Answer", SendAnswer);
    socket.on("disconnect", Disconnect);
})

function Disconnect(){
    console.log("CreatePeer6654");
    if(clients > 0){
        clients--;
    }
}

function SendOffer(offer){
    console.log("CreatePeer2462");
    console.log("337");
    this.broadcast.emit("BackOffer", offer);
}

function SendAnswer(data){
    console.log("CreatePee4676r");
    console.log("338");
    this.broadcast.emit("BackAnswer", data);
}

http.listen(port, () => console.log('active on ${port}'));






