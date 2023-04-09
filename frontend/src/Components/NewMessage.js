import React, { useState } from 'react'
import * as WebRTCHandler from '../utils/WebRTCHandler'

const NewMessage = () => {
  const [message, setMessage] = useState('')

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
      WebRTCHandler.sendMessageUsingDataChannel(message)
      setMessage('')
    }
  }

  return (
    <div className='newMessage-container'>
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

export default NewMessage
