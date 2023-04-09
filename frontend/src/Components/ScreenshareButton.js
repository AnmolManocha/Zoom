import React, { useState } from 'react'
import LocalScreenSharingPreview from './LocalScreenSharingPreview'
import * as WebRTCHandler from '../utils/WebRTCHandler'

const constraints = {
  audio: false,
  video: true,
}

const ScreenshareButton = () => {
  const [isScreeshare, setIsScreenshare] = useState(false)
  const [screenShareStream, setScreenShareStream] = useState(null)

  const handleCameraButton = async () => {
    if (!isScreeshare) {
      let stream = null
      try {
        stream = await navigator.mediaDevices.getDisplayMedia(constraints)
        console.log(stream)
      } catch (error) {
        console.log('error ', error)
      }
      if (stream) {
        setScreenShareStream(stream)
        WebRTCHandler.toggleScreenshare(isScreeshare, stream)
        setIsScreenshare(true)
        //
      }
    } else {
      WebRTCHandler.toggleScreenshare(isScreeshare)
      setIsScreenshare(false)
      screenShareStream.getTracks().forEach((t) => t.stop())
      setScreenShareStream(null)
    }
    setIsScreenshare(!isScreeshare)
  }

  return (
    <>
      <div className='videoButton-container'>
        <button onClick={handleCameraButton}>
          {!isScreeshare ? (
            <i className='material-symbols-outlined'>Present_To_All</i>
          ) : (
            <i className='material-symbols-outlined'>Cancel_Presentation</i>
          )}
        </button>
      </div>
      {isScreeshare && <LocalScreenSharingPreview stream={screenShareStream} />}
    </>
  )
}

export default ScreenshareButton
