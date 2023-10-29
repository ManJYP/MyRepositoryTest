const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');

let localStream;
let peerConnection;
let socket = io(); // Connect to the signaling server

startButton.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
        localVideo.srcObject = stream;
        localStream = stream;

        peerConnection = new RTCPeerConnection(configuration);
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        // Create an offer and set local description
        peerConnection.createOffer()
        .then((offer) => {
            peerConnection.setLocalDescription(offer);
            socket.emit('offer', offer); // Send the offer to the signaling server
        })
        .catch((error) => {
            console.error('Error creating offer:', error);
        });
    })
    .catch((error) => {
        console.error('Error accessing webcam:', error);
    });
});

stopButton.addEventListener('click', () => {
    // Stop the local stream and close the peer connection
    localStream.getTracks().forEach((track) => {
        track.stop();
    });
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
    if (peerConnection) {
        peerConnection.close();
    }
});

socket.on('answer', (answer) => {
    // Handle received answer from the signaling server
    peerConnection.setRemoteDescription(answer)
    .catch((error) => {
        console.error('Error setting remote description:', error);
    });
});

socket.on('ice-candidate', (candidate) => {
    // Handle received ICE candidates from the signaling server
    peerConnection.addIceCandidate(candidate)
    .catch((error) => {
        console.error('Error adding ICE candidate:', error);
    });
});
