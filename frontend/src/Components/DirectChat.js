import React, { useEffect, useState } from 'react'
import DirectChatHeader from './DirectChatHeader'
import DirectChatMessages from './DirectChatMessages'
import DirectChatNewMessage from './DirectChatNewMessage'
import DirectChatConvoNotChosen from './DirectChatConvoNotChosen'
import { connect } from 'react-redux'

const getDirectChatHistory = (directChatHistory, socketId = null) => {
  if (!socketId || !directChatHistory) {
    return []
  }
  const history = directChatHistory.find((h) => h.socketId === socketId)
  return history ? history.chatHistory : []
}

const DirectChat = (props) => {
  const { activeConversation, directChatHistory } = props.reducer
  const [messages, setMessages] = useState([])

  useEffect(() => {
    setMessages(
      getDirectChatHistory(
        directChatHistory,
        activeConversation ? activeConversation.socketId : null
      )
    )

    return () => {}
  }, [activeConversation, directChatHistory])

  return (
    <div className='directChat-container'>
      <DirectChatHeader activeConversation={activeConversation} />
      <DirectChatMessages messages={messages} />
      <DirectChatNewMessage />
      {!activeConversation && <DirectChatConvoNotChosen />}
    </div>
  )
}

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  }
}

export default connect(mapStoreStateToProps)(DirectChat)
