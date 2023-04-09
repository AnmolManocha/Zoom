import io from 'socket.io-client'
import store from '../app/store'
import { setParticipants, setRoomId, setSocketId } from '../app/actions'
import * as WebRTCHandler from './WebRTCHandler'
import { appendNewMessageToChatHistory } from './DirectMessages'

// const PORT = process.env.PORT || 5000

// const SERVER = `http://localhost:${PORT}`
const SERVER = `/`

let socket = null

export const connectWithSocketIOServer = () => {
  const options = {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  }

  socket = io(SERVER, options)

  socket.on('connect', () => {
    // console.log(socket.id)
    store.dispatch(setSocketId(socket.id))
  })

  socket.on('createRoomId', (data) => {
    const { roomId } = data
    // console.log(roomId)
    store.dispatch(setRoomId(roomId))
  })

  socket.on('roomUpdate', (data) => {
    const { connectedUsers } = data
    store.dispatch(setParticipants(connectedUsers))
  })

  socket.on('connectionPrepare', (data) => {
    const { connUserSocketId } = data
    WebRTCHandler.prepareNewPeerConnection(connUserSocketId, false)

    /* ------------ inform new user about prepared for incoming call ------------ */
    socket.emit('connInit', { connUserSocketId: connUserSocketId })
  })

  socket.on('connSignal', (data) => {
    WebRTCHandler.handleSignalData(data)
  })

  socket.on('connInit', (data) => {
    const { connUserSocketId } = data
    WebRTCHandler.prepareNewPeerConnection(connUserSocketId, true)
  })

  socket.on('directMessage', (data) => {
    appendNewMessageToChatHistory(data)
  })

  socket.on('userDisconnected', (data) => {
    WebRTCHandler.removePeerConnection(data)
  })
}

export const createNewRoom = (identity, onlyAudio) => {
  const data = {
    identity,
    onlyAudio,
  }
  socket.emit('createNewRoom', data)
}

export const joinRoom = (roomId, identity, onlyAudio) => {
  const data = {
    roomId,
    identity,
    onlyAudio,
  }
  socket.emit('joinRoom', data)
}

export const signalPeerData = (data) => {
  socket.emit('connSignal', data)
}

export const sendDirectMessage = (data) => {
  socket.emit('directMessage', data)
}
