import React from 'react'

const JoinAudioOnly = ({ setIsOnlyWithAudio, isOnlyWithAudio }) => {
  const handleConnectionType = () => {
    setIsOnlyWithAudio(!isOnlyWithAudio)
  }

  return (
    <div className='joinAudio-checkbox-container'>
      <div className='joinAudio-checkbox' onClick={handleConnectionType}>
        {isOnlyWithAudio && <i className='material-symbols-outlined'>check</i>}
      </div>
      <span>Only Audio</span>
    </div>
  )
}

export default JoinAudioOnly
