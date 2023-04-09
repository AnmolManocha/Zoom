import {
  SET_ACTIVE_CONVERSATION,
  SET_DIRECT_CHAT_HISTORY,
  SET_IDENTITY,
  SET_IS_ONLY_WITH_AUDIO,
  SET_IS_ROOM_HOST,
  SET_IS_ROOM_ID,
  SET_MESSAGES,
  SET_PARTICIPANTS,
  SET_SHOW_OVERLAY,
  SET_SOCKET_ID,
} from './constants'

export const setIsRoomHost = (isRoomHost) => {
  return {
    type: SET_IS_ROOM_HOST,
    isRoomHost,
  }
}

export const setIsOnlyWithAudio = (isOnlyWithAudio) => {
  return {
    type: SET_IS_ONLY_WITH_AUDIO,
    isOnlyWithAudio,
  }
}

export const setIdentity = (identity) => {
  return {
    type: SET_IDENTITY,
    identity,
  }
}

export const setRoomId = (roomId) => {
  return {
    type: SET_IS_ROOM_ID,
    roomId,
  }
}

export const setShowOverlay = (showOverlay) => {
  return {
    type: SET_SHOW_OVERLAY,
    showOverlay,
  }
}

export const setParticipants = (participants) => {
  return {
    type: SET_PARTICIPANTS,
    participants,
  }
}

export const setMessages = (messages) => {
  return {
    type: SET_MESSAGES,
    messages,
  }
}

export const setActiveConversation = (activeConversation) => {
  return {
    type: SET_ACTIVE_CONVERSATION,
    activeConversation,
  }
}

export const setDirectChatHistory = (directChatHistory) => {
  return {
    type: SET_DIRECT_CHAT_HISTORY,
    directChatHistory,
  }
}

export const setSocketId = (socketId) => {
  return {
    type: SET_SOCKET_ID,
    socketId,
  }
}
