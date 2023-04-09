import React, { useState } from 'react'
import * as WebRTCHandler from '../utils/WebRTCHandler'

const CameraButton = () => {
  const [isCameraOff, setIsCameraOff] = useState(false)

  const handleCameraButton = () => {
    WebRTCHandler.toggleCamera(isCameraOff)

    setIsCameraOff(!isCameraOff)
  }

  return (
    <div className='videoButton-container'>
      <button onClick={handleCameraButton}>
        {!isCameraOff ? (
          <i className='material-symbols-outlined'>Videocam</i>
        ) : (
          <i className='material-symbols-outlined'>Videocam_Off</i>
        )}
      </button>
    </div>
  )
}

export default CameraButton
