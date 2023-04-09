import React, { useState } from 'react'
import * as WebRTCHandler from '../utils/WebRTCHandler'

const MicButton = () => {
  const [isMuted, setIsMuted] = useState(false)

  const handleMicButton = () => {
    WebRTCHandler.toggleMic(isMuted)
    setIsMuted(!isMuted)
  }

  return (
    <div className='videoButton-container'>
      <button onClick={handleMicButton}>
        {!isMuted ? (
          <i className='material-symbols-outlined'>Mic</i>
        ) : (
          <i className='material-symbols-outlined'>Mic_Off</i>
        )}
      </button>
    </div>
  )
}

export default MicButton
