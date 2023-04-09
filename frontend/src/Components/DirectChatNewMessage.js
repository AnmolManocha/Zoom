import React, { useState } from 'react'
import * as wss from '../utils/wss'
import { connect } from 'react-redux'

const DirectChatNewMessage = ({ reducer }) => {
  const [message, setMessage] = useState('')
    const { activeConversation, identity } = reducer
  const handleInputText = (event) => {
    setMessage(event.target.value)
  }
  const handleKeyPressed = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      // console.log('pressed enter')
      sendMessage()
    }
  }
  const sendMessage = (event) => {
    if (message.length > 0) {
      // console.log('sendmessage')
      // console.log(message)
      wss.sendDirectMessage({
        receiverSocketId: activeConversation.socketId,
        identity: identity,
        messageContent: message,
      })
      setMessage('')
    }
  }
  return (
    <div className='newMessage-container newMessage-direct-border'>
      <input
        type='text'
        className='newMessage-input'
        value={message}
        onChange={handleInputText}
        placeholder='Type your message...'
        onKeyDown={handleKeyPressed}
      />
      <button onClick={sendMessage} className='newMessage-button'>
        <i className='material-symbols-outlined'>Send</i>
      </button>
    </div>
  )
}

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  }
}

export default connect(mapStoreStateToProps)(DirectChatNewMessage)
