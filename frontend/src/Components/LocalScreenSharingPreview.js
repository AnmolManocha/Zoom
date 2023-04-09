import React, { useEffect, useRef } from 'react'

const LocalScreenSharingPreview = ({ stream }) => {
  const localPreviewRef = useRef()
  console.log(stream)
  useEffect(() => {
    const video = localPreviewRef.current
    video.srcObject = stream
    video.onloadedmetadata = () => {
      video.play()
    }
    return () => {}
  }, [stream])

  return (
    <div className='local-screenshare-preview'>
      <video muted autoPlay ref={localPreviewRef}></video>
    </div>
  )
}

export default LocalScreenSharingPreview
