import * as api from './api'

let TURNIceServer = null

export const fetchTURNCredentials = async () => {
  const responseData = await api.getTURNCredentials()

  if (responseData.token?.iceServers) {
    TURNIceServer = responseData.token.iceServers
  }

  return TURNIceServer
}

export const getTURNIceServers = () => {
  return TURNIceServer
}
