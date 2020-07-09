let Peer = require('simple-peer');
let socket = io();
const video1 = document.querySelector("video");
let client = {};

console.log("1");
navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
    socket.emit('NewClient');
    console.log("test");
    video1.srcObject  = stream;
    video1.play();

    function InitPeer(type) {
        console.log("InitPeer");
        console.log(type);
        
        let peer = new Peer({initiator: (type == 'init') ? true : false, stream: stream, trickle: false })
        console.log(Peer);
        peer.on("stream", function(stream){
            CreateVideo(stream);
        })

        peer.on("close", function(){
            document.getElementById("peerVideo").remove();
            peer.destroy();
        })

        return peer;
    }

    function MakePeer(){
        console.log("MakePeer");
        client.gotAnswer = false;
        let peer = InitPeer('init');
        console.log(peer);
        peer.on("signal", function(data){
            if(!client.gotAnswer)
            {
                socket.emit("Offer", data);
            }
        })
        client.peer = peer;
    }

    function FrontAnswer(offer){
        console.log("FrontAnswer");
        let peer = InitPeer('notInit');

        peer.on('signal', (data) => {
            socket.emit("Answer", data);
        })
        peer.signal(offer);
    }

    function SignalAnswer(answer){
        console.log("SignalAnswer");
        client.gotAnswer = true;
        let peer = client.peer;
        peer.signal(answer);
    }

    function CreateVideo(stream){
        console.log("CreateVideo");
        let video = document.createElement("video");
        video.id = "peerVideo";
        video.srcObject = stream;
        video.class = "embed-responsive-item";
        document.querySelector("#peerDiv").appendChild(video);
        video.play();
    }

    function SessionActive(){
        console.log("SessionActive");
        document.write("Session active. Please come back later.")
    }

    socket.on("BackOffer", FrontAnswer);
    socket.on("BackAnswer", SignalAnswer);
    socket.on("SessionActive", SessionActive);
    socket.on("CreatePeer", MakePeer);

})
.catch(err => {
    console.log("hi");
    document.write(err)
} )