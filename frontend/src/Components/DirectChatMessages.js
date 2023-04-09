import React, { useEffect, useRef } from 'react'

const SingleMessage = ({ isAuthor, messageContent }) => {
  const messageStyling = isAuthor ? 'DM-author' : 'DM-receiver'
  const containerStyling = isAuthor
    ? 'DM-container-author'
    : 'DM-container-receiver'
  return (
    <div className={containerStyling}>
      <p className={messageStyling}>{messageContent}</p>
    </div>
  )
}

const DirectChatMessages = ({ messages }) => {
  const scrollRef = useRef()
  useEffect(() => {
    if (scrollRef) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    return () => {}
  }, [messages])

  return (
    <div className='directChat-messages-container'>
      {messages.map((message) => {
        return (
          <SingleMessage
            messageContent={message.messageContent}
            isAuthor={message.isAuthor}
            key={`${message.messageContent}-${message.identity}`}
          />
        )
      })}
      <div ref={scrollRef}></div>
    </div>
  )
}

export default DirectChatMessages
