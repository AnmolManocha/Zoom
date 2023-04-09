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

const initialState = {
  identity: '',
  isRoomHost: false,
  isOnlyWithAudio: false,
  roomId: null,
  showOverlay: true,
  participants: [],
  messages: [],
  activeConversation: null,
  directChatHistory: [],
  socketId: null,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_ROOM_HOST:
      return {
        ...state,
        isRoomHost: action.isRoomHost,
      }
    case SET_IS_ONLY_WITH_AUDIO:
      return {
        ...state,
        isOnlyWithAudio: action.isOnlyWithAudio,
      }
    case SET_IS_ROOM_ID:
      return {
        ...state,
        roomId: action.roomId,
      }
    case SET_IDENTITY:
      return {
        ...state,
        identity: action.identity,
      }
    case SET_SHOW_OVERLAY:
      return {
        ...state,
        showOverlay: action.showOverlay,
      }
    case SET_PARTICIPANTS:
      return {
        ...state,
        participants: action.participants,
      }
    case SET_MESSAGES:
      return {
        ...state,
        messages: action.messages,
      }
    case SET_ACTIVE_CONVERSATION:
      return {
        ...state,
        activeConversation: action.activeConversation,
      }
    case SET_DIRECT_CHAT_HISTORY:
      return {
        ...state,
        directChatHistory: action.directChatHistory,
      }
    case SET_SOCKET_ID: {
      return {
        ...state,
        socketId: action.socketId,
      }
    }
    default:
      return state
  }
}

export default reducer
