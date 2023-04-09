const express = require('express')
const path = require('path')
const http = require('http')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
const twilio = require('twilio')
const dotenv = require('dotenv')

dotenv.config()

const PORT = process.env.PORT || 5000

const app = express()

const server = http.createServer(app)

app.use(cors())

let connectedUsers = []
let rooms = []

// Check route if room exists
app.get('/api/room-exists/:roomId', (req, res) => {
  const { roomId } = req.params
  const room = rooms.find((room) => room.id === roomId)
  if (room) {
    // send response if room exists
    if (room.connectedUsers.length > 3) {
      return res.send({ roomExists: true, full: true })
    } else {
      return res.send({ roomExists: true, full: false })
    }
  } else {
    // send response if room doesn't exists
    return res.send({ roomExists: false })
  }
})

app.get('/api/get-turn-credentials', (req, res) => {
  const accountSID = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN

  const client = twilio(accountSID, authToken)

  try {
    client.tokens.create().then((token) => {
      res.send({ token })
    })
  } catch (error) {
    console.error('Error while fetching Twilio TURN Server credentials ', error)
    res.send({ token: null })
  }
})

app.get('/api/get-port', (req, res) => {
  res.send({ port: process.env.PORT || 5000 });
});


const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log(`user connected ${socket.id}`)

  socket.on('createNewRoom', (data) => {
    createNewRoomHandler(data, socket)
  })

  socket.on('joinRoom', (data) => {
    joinRoomHandler(data, socket)
  })

  socket.on('connSignal', (data) => {
    signalingHandler(data, socket)
  })

  socket.on('connInit', (data) => {
    initializeConnectionHandler(data, socket)
  })

  socket.on('directMessage', (data) => {
    directMessageHandler(data, socket)
  })

  socket.on('disconnect', () => {
    console.log(`user disconnected ${socket.id}`)
    disconnectHandler(socket)
  })
})

/* --------------------------- socket.io handlers --------------------------- */

const createNewRoomHandler = (data, socket) => {
  // console.log('create', data)
  const { identity, onlyAudio } = data

  /* ------------------------ google meet like room id ------------------------ */
  const code = Array.from({ length: 10 }, () => {
    const charCode = Math.floor(Math.random() * 26) + 97 // generates a random number between 97 and 122 (ASCII codes for lowercase letters)
    return String.fromCharCode(charCode) // converts the ASCII code to a character
  }).join('')

  const roomId = `${code.slice(0, 3)}-${code.slice(3, 7)}-${code.slice(7, 10)}`
  // const roomId = uuidv4()
  /* ----------------------------- create new user ---------------------------- */
  const newUser = {
    identity,
    id: uuidv4(),
    socketId: socket.id,
    roomId,
    onlyAudio,
  }
  /* -------------------- push that user to connected users ------------------- */
  connectedUsers = [...connectedUsers, newUser]

  /* ----------------------------- create new room ---------------------------- */
  const newRoom = {
    id: roomId,
    connectedUsers: [newUser],
  }

  /* --------------------------- join socket.io room -------------------------- */
  socket.join(roomId)

  rooms = [...rooms, newRoom]

  /* ----------------------- emit roomId to the creator ----------------------- */
  socket.emit('createRoomId', { roomId })

  /* ----------------- emit updates to all users in that room ----------------- */
  socket.emit('roomUpdate', { connectedUsers: newRoom.connectedUsers })
}

const joinRoomHandler = (data, socket) => {
  const { roomId, identity, onlyAudio } = data

  /* ----------------------------- create new user ---------------------------- */
  const newUser = {
    identity,
    id: uuidv4(),
    socketId: socket.id,
    roomId,
    onlyAudio,
  }

  /* ----------------- Try to join existing room by finding it ---------------- */
  const room = rooms.find((room) => room.id === roomId)
  // console.log('roomId:', roomId)
  // console.log('rooms:', rooms)
  // console.log('room:', room)
  /* -------------------- join to room connected users ------------------- */
  room.connectedUsers = [...room.connectedUsers, newUser]

  /* --------------------------- join socket.io room -------------------------- */
  socket.join(roomId)

  /* -------------------- push that user to all connected users ------------------- */
  connectedUsers = [...connectedUsers, newUser]

  /* ------------------- prepare peer connection within room ------------------ */
  room.connectedUsers.forEach((user) => {
    if (user.socketId !== socket.id) {
      const data = {
        connUserSocketId: socket.id,
      }
      io.to(user.socketId).emit('connectionPrepare', data)
    }
  })

  io.to(roomId).emit('roomUpdate', { connectedUsers: room.connectedUsers })
}

const disconnectHandler = (socket) => {
  /* ------------ find and remove user from room and connectedUsers ----------- */
  const user = connectedUsers.find((user) => user.socketId === socket.id)
  if (user) {
    /* ---------------------------- remove from room ---------------------------- */
    const room = rooms.find((room) => room.id === user.roomId)
    room.connectedUsers = room.connectedUsers.filter(
      (user) => user.socketId !== socket.id
    )

    /* -------------------------- leave socket.io room -------------------------- */
    socket.leave(user.roomId)

    /* ---------------------- close room if everyone is out --------------------- */
    if (room.connectedUsers.length > 0) {
      /* ---------------------- emit to all in still in room ---------------------- */
      io.to(room.id).emit('userDisconnected', { socketId: socket.id })

      /* ------------------------ update to others in room ------------------------ */
      io.to(room.id).emit('roomUpdate', { connectedUsers: room.connectedUsers })
    } else {
      rooms = rooms.filter((r) => r.id !== room.id)
    }
  }
}

const signalingHandler = (data, socket) => {
  const { connUserSocketId, signal } = data
  const signalingData = { signal, connUserSocketId: socket.id }
  io.to(connUserSocketId).emit('connSignal', signalingData)
}

const initializeConnectionHandler = (data, socket) => {
  const { connUserSocketId } = data
  const initData = { connUserSocketId: socket.id }
  io.to(connUserSocketId).emit('connInit', initData)
}

const directMessageHandler = (data, socket) => {
  if (
    connectedUsers.find(
      (connUser) => connUser.socketId === data.receiverSocketId
    )
  ) {
    const receiverData = {
      authorSocketId: socket.id,
      messageContent: data.messageContent,
      isAuthor: false,
      identity: data.indentity,
    }
    socket.to(data.receiverSocketId).emit('directMessage', receiverData)

    const authorData = {
      receiverSocketId: data.receiverSocketId,
      messageContent: data.messageContent,
      isAuthor: true,
      identity: data.indentity,
    }
    socket.emit('directMessage', authorData)
  }
}

/* -------------------------------------------------------------------------- */

app.use(express.static(path.join(__dirname, '/frontend/build')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'))
})

server.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`)
})
