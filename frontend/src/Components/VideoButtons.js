import React from 'react'
import CameraButton from './CameraButton'
import LeaveButton from './LeaveButton'
import MicButton from './MicButton'
import ScreenshareButton from './ScreenshareButton'
import { connect } from 'react-redux'

const VideoButtons = (props) => {
  const { isOnlyWithAudio } = props.reducer
  return (
    <div className='videoButtons-container'>
      <MicButton />
      {!isOnlyWithAudio && (
        <>
          <CameraButton />
          <ScreenshareButton />
        </>
      )}
      <LeaveButton />
    </div>
  )
}

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  }
}

export default connect(mapStoreStateToProps)(VideoButtons)
