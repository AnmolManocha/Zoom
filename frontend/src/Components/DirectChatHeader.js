import React from 'react'

const DirectChatHeader = ({ activeConversation }) => {
  return (
    <div className='directChat-header'>
      <span className='directChat-header-title'>
        {activeConversation ? activeConversation.identity : 'Direct Chat'}
      </span>
    </div>
  )
}

export default DirectChatHeader
