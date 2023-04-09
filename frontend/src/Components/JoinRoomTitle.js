import React from 'react'

const JoinRoomTitle = ({ isRoomHost }) => {
  const titleText = isRoomHost ? 'Host Meeting' : 'Join Meeting'
  return <h2 className='joinRoom-title'>{titleText}</h2>
}

export default JoinRoomTitle
