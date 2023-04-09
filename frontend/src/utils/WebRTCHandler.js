import { setMessages, setShowOverlay } from '../app/actions'
import store from '../app/store'
import { fetchTURNCredentials, getTURNIceServers } from './TURN'
import * as wss from './wss'
import Peer from 'simple-peer'

const defaultConstraints = {
  audio: true,
  // video: { width: 1280, height: 720 },
  video: { width: 480, height: 360 },
}

const onlyAudioConstraints = {
  audio: true,
  video: false,
}

let localStream

export const getLocalPreviewAndInitRoomConnection = async (
  isRoomHost,
  identity,
  roomId = null,
  onlyAudio
) => {
  await fetchTURNCredentials()

  const constraints = onlyAudio ? onlyAudioConstraints : defaultConstraints

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      // console.log('success local stream')
      // console.log(stream.getTracks())
      localStream = stream
      showLocalVideoPreview(localStream)

      //dispatch action to hide overlay
      store.dispatch(setShowOverlay(false))

      isRoomHost
        ? wss.createNewRoom(identity, onlyAudio)
        : wss.joinRoom(roomId, identity, onlyAudio)
    })
    .catch((error) => {
      console.error('getting error', error)
    })
}

let peers = {}
let streams = []

const getConfiguration = () => {
  const TURNIceServer = getTURNIceServers()
  if (TURNIceServer) {
    return {
      iceServers: [
        {
          urls: 'stun:stun.l.google:19302',
        },
        ...TURNIceServer,
      ],
    }
  } else {
    console.warn('Using only STUN Server')
    return {
      iceServers: [
        {
          urls: 'stun:stun.l.google:19302',
        },
      ],
    }
  }
}

const messengerChannel = 'messenger'

export const prepareNewPeerConnection = (connUserSocketId, isInitiator) => {
  const configuration = getConfiguration()

  peers[connUserSocketId] = new Peer({
    initiator: isInitiator,
    config: configuration,
    stream: localStream,
    channelName: messengerChannel,
  })

  peers[connUserSocketId].on('signal', (data) => {
    /* --------- webRTC Offer, webRTC Answer (SDP Info), Ice Candidates --------- */
    const signalData = {
      signal: data,
      connUserSocketId: connUserSocketId,
    }
    wss.signalPeerData(signalData)
  })

  peers[connUserSocketId].on('stream', (stream) => {
    addStream(stream, connUserSocketId)
    streams = [...streams, stream]
  })

  peers[connUserSocketId].on('data', (data) => {
    const messageData = JSON.parse(data)
    appendNewMessage(messageData)
  })
}

export const handleSignalData = (data) => {
  /* ------------------ add signaling data to peer connection ----------------- */
  peers[data.connUserSocketId].signal(data.signal)
}

export const removePeerConnection = (data) => {
  const { socketId } = data
  const videoContainer = document.getElementById(socketId)
  const videoEl = document.getElementById(`${socketId}-video`)
  if (videoContainer && videoEl) {
    const tracks = videoEl.srcObject.getTracks()
    tracks.forEach((t) => t.stop())
    videoEl.srcObject = null
    videoContainer.removeChild(videoEl)
    videoContainer.parentNode.removeChild(videoContainer)
    if (peers[socketId]) {
      peers[socketId].destroy()
    }
    delete peers[socketId]
  }
}

/* ----------------------------- Stream Frame UI ---------------------------- */
const showLocalVideoPreview = (stream) => {
  //show local preview
  const videosContainer = document.getElementById('videos-portal')
  videosContainer.classList.add('video-portal-styles')
  const videoContainer = document.createElement('div')
  videoContainer.classList.add('video-track-container')
  const videoElement = document.createElement('video')
  videoElement.autoplay = true
  videoElement.muted = true
  videoElement.srcObject = stream
  videoElement.onloadedmetadata = () => {
    videoElement.play()
  }
  videoContainer.appendChild(videoElement)
  /* -------------------------------------------------------------------------- */
  if (store.getState().reducer.isOnlyWithAudio) {
    videoContainer.appendChild(getOnlyAudioLabel())
  }
  /* -------------------------------------------------------------------------- */
  videosContainer.appendChild(videoContainer)
}

const addStream = (stream, connUserSocketId) => {
  /* ------------------------- display incoming stream ------------------------ */
  const videosContainer = document.getElementById('videos-portal')
  const videoContainer = document.createElement('div')
  videoContainer.id = connUserSocketId
  videoContainer.classList.add('video-track-container')
  const videoElement = document.createElement('video')
  videoElement.autoplay = true
  videoElement.srcObject = stream
  videoElement.id = `${connUserSocketId}-video`

  videoElement.onloadedmetadata = () => {
    videoElement.play()
  }

  let clickedOnce = false

  videoElement.addEventListener('click', () => {
    if (!clickedOnce) {
      clickedOnce = true
      setTimeout(() => (clickedOnce = false), 300)
    } else {
      if (videoElement.classList.contains('full-screen')) {
        videoElement.classList.remove('full-screen')
      } else {
        videoElement.classList.add('full-screen')
      }
      clickedOnce = false
    }
  })

  videoContainer.appendChild(videoElement)
  /* ------------------ check other user connected with audio ----------------- */
  const participants = store.getState().reducer.participants
  const participant = participants.find((p) => p.socketId === connUserSocketId)
  if (participant?.onlyAudio) {
    videoContainer.appendChild(getOnlyAudioLabel(participant.identity))
  }
  /* -------------------------------------------------------------------------- */
  videosContainer.appendChild(videoContainer)
}

const getOnlyAudioLabel = (identity = '') => {
  const labelContainer = document.createElement('div')
  labelContainer.classList.add('onlyAudio-label-container')
  const label = document.createElement('p')
  label.classList.add('onlyAudio-label-text')
  label.innerHTML = `${identity} (Only Audio)`
  labelContainer.appendChild(label)
  return labelContainer
}

/* ------------------------------ Buttons Logic ----------------------------- */

export const toggleMic = (isMuted) => {
  localStream.getAudioTracks()[0].enabled = isMuted ? true : false
}

export const toggleCamera = (isDisabled) => {
  localStream.getVideoTracks()[0].enabled = isDisabled ? true : false
}

export const toggleScreenshare = (isScreeshare, screenShareStream = null) => {
  if (isScreeshare) {
    switchVideoTracks(localStream)
  } else {
    switchVideoTracks(screenShareStream)
  }
}

const switchVideoTracks = (stream) => {
  for (let socket_id in peers) {
    for (let index in peers[socket_id].streams[0].getTracks()) {
      for (let index2 in stream.getTracks()) {
        if (
          peers[socket_id].streams[0].getTracks()[index].kind ===
          stream.getTracks()[index2].kind
        ) {
          peers[socket_id].replaceTrack(
            peers[socket_id].streams[0].getTracks()[index],
            stream.getTracks()[index2],
            peers[socket_id].streams[0]
          )
          break
        }
      }
    }
  }
}

/* -------------------------------- Messages -------------------------------- */

const appendNewMessage = (messageData) => {
  const messages = store.getState().reducer.messages
  store.dispatch(setMessages([...messages, messageData]))
}

export const sendMessageUsingDataChannel = (messageContent) => {
  /* ----------------------- append this message locally ---------------------- */
  const identity = store.getState().reducer.identity
  const localMessageData = {
    content: messageContent,
    identity,
    messageCreatedByMe: true,
  }

  appendNewMessage(localMessageData)

  const messageData = {
    content: messageContent,
    identity,
  }
  const stringifiedMessage = JSON.stringify(messageData)
  for (let socketId in peers) {
    peers[socketId].send(stringifiedMessage)
    // console.log(peers[socketId])
  }
}
