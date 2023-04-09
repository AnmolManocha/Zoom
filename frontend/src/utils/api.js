import axios from 'axios'

// const PORT = process.env.PORT || 5000

// const serverApi = `http://localhost:${PORT}/api`
const serverApi = `/api`

export const getRoomExists = async (roomId) => {
  // console.log('id', roomId)
  const response = await axios.get(`${serverApi}/room-exists/${roomId}`)
  return response.data
}

export const getTURNCredentials = async () => {
  const response = await axios.get(`${serverApi}/get-turn-credentials`)
  return response.data
}
