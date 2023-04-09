import React from 'react'
import Participants from './Participants'
import ParticipantsLabel from './ParticipantsLabel'
import DirectChat from './DirectChat'

const ParticipantsSection = () => {
  return (
    <div className='participantsSection-container'>
      <ParticipantsLabel />
      <Participants />
      <DirectChat />
    </div>
  )
}

export default ParticipantsSection
