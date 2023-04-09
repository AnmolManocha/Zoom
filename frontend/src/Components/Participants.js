import React from 'react'
import { connect } from 'react-redux'
import { setActiveConversation } from '../app/actions'

// const dummyData = [
//   {
//     identity: 'Andy',
//   },
//   {
//     identity: 'Sandy',
//   },
//   {
//     identity: 'Tandy',
//   },
//   {
//     identity: 'Mandy',
//   },
// ]

const Participant = (props) => {
  const {
    identity,
    lastItem,
    participant,
    setActiveConversationAction,
    socketId,
  } = props
  const handleOpenActiveChatBox = () => {
    if (participant.socketId !== socketId) {
      setActiveConversationAction(participant)
    }
  }
  return (
    <>
      <span className='participant-context' onClick={handleOpenActiveChatBox}>
        {identity}
      </span>
      {!lastItem && <span className='participants-separator-line'></span>}
    </>
  )
}

const Participants = (props) => {
  const { setActiveConversationAction } = props
  const { participants, socketId } = props.reducer
  return (
    <div className='participants-container'>
      {participants.map((participant, index) => {
        return (
          <Participant
            key={participant.identity}
            identity={participant.identity}
            lastItem={participants.length === index + 1}
            participant={participant}
            setActiveConversationAction={setActiveConversationAction}
            socketId={socketId}
          />
        )
      })}
    </div>
  )
}

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  }
}

const mapActionToProps = (dispatch) => {
  return {
    setActiveConversationAction: (activeConversation) => {
      dispatch(setActiveConversation(activeConversation))
    },
  }
}

export default connect(mapStoreStateToProps, mapActionToProps)(Participants)
