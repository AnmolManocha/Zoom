import React, { useEffect } from 'react'
import ChatSection from '../../Components/ChatSection'
import RoomLabel from '../../Components/RoomLabel'
import ParticipantsSection from '../../Components/ParticipantSection'
import VideoSection from '../../Components/VideoSection'
import { connect } from 'react-redux'
import * as WebRTCHandler from '../../utils/WebRTCHandler'
import './RoomPage.css'
import Overlay from '../../Components/Overlay'

const RoomPage = (props) => {
  const { isRoomHost, identity, roomId, showOverlay, isOnlyWithAudio } =
    props.reducer

  useEffect(() => {
    if (!isRoomHost && !roomId) {
      const siteUrl = window.location.origin
      window.location.href = siteUrl
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      WebRTCHandler.getLocalPreviewAndInitRoomConnection(
        isRoomHost,
        identity,
        roomId,
        isOnlyWithAudio
      )
    }

    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='room-container'>
      <ParticipantsSection />
      <VideoSection />
      <ChatSection />
      <RoomLabel roomId={roomId} />
      {showOverlay && <Overlay />}
    </div>
  )
}

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  }
}

export default connect(mapStoreStateToProps)(RoomPage)
