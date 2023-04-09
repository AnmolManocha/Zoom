import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'

// const messages = [
//   { content: 'Hey', identity: 'Andy', messageCreatedByMe: true },
//   { content: 'Hello', identity: 'Andy', messageCreatedByMe: true },
//   { content: 'Namaste', identity: 'Rhea', messageCreatedByMe: false },
//   { content: 'Howdy', identity: 'Kohi', messageCreatedByMe: false },
// ]

const Message = ({ author, content, sameAuthor, messageCreatedByMe }) => {
  const alignClass = messageCreatedByMe
    ? 'messageAlign-right'
    : 'messageAlign-left'
  const authorText = messageCreatedByMe ? 'You' : author
  const contentAdditionalStyle = messageCreatedByMe
    ? 'message-right-style'
    : 'message-left-style'
  return (
    <div className={`message-container ${alignClass}`}>
      {!sameAuthor && <p className='message-text'>{authorText}</p>}
      <p className={`message-content ${contentAdditionalStyle}`}>{content}</p>
    </div>
  )
}

const Messages = ({ reducer }) => {
  const { messages } = reducer
  // console.log('message', messages);
  const scrollRef = useRef()
  useEffect(() => {
    if (scrollRef) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    return () => {}
  }, [messages])
  return (
    <div className='messages-container'>
      {messages.map((message, index) => {
        const sameAuthor =
          index > 0 && message.identity === messages[index - 1].identity
        return (
          <Message
            key={`${message.content}${index}`}
            author={message.identity}
            content={message.content}
            sameAuthor={sameAuthor}
            messageCreatedByMe={message.messageCreatedByMe}
          />
        )
      })}
      <div ref={scrollRef}></div>
    </div>
  )
}

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  }
}

export default connect(mapStoreStateToProps)(Messages)
