import React from 'react'

const RoomLabel = ({ roomId }) => {
  const handleClick = () => {
    navigator.clipboard.writeText(roomId)
  }

  return (
    <div className='roomLabel-container'>
      <span className='roomLabel-context' onClick={handleClick} style={{cursor: 'pointer'}}>ID: {roomId}</span>
    </div>
  )
}

export default RoomLabel
