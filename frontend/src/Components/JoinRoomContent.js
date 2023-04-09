import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setIdentity, setIsOnlyWithAudio, setRoomId } from '../app/actions'
import { getRoomExists } from '../utils/api'
import ErrorMessage from './ErrorMessage'
import JoinAudioOnly from './JoinAudioOnly'
import JoinRoomButton from './JoinRoomButton'
import JoinRoomInputs from './JoinRoomInputs'

const JoinRoomContent = (props) => {
  const { reducer, setIsOnlyWithAudio, setIdentityAction, setRoomIdAction } =
    props

  const [roomId, setRoomId] = useState('')
  const [name, setName] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const navigate = useNavigate()

  const handleJoinRoom = async () => {
    setIdentityAction(name)
    if (reducer.isRoomHost) {
      createRoom()
    } else {
      await joinRoom()
    }
  }

  const joinRoom = async () => {
    const responseMessage = await getRoomExists(roomId)
    const { roomExists, full } = responseMessage
    if (roomExists) {
      if (full) {
        setErrorMessage('Meeting is full. Please try again later!')
      } else {
        //join room
        setRoomIdAction(roomId)
        navigate('/room')
      }
    } else {
      setErrorMessage('Meeting not found! Check your meeting id.')
    }
  }

  const createRoom = () => {
    navigate('/room')
  }

  return (
    <>
      <JoinRoomInputs
        roomId={roomId}
        setRoomId={setRoomId}
        name={name}
        setName={setName}
        isRoomHost={reducer.isRoomHost}
      />
      <JoinAudioOnly
        setIsOnlyWithAudio={setIsOnlyWithAudio}
        isOnlyWithAudio={reducer.isOnlyWithAudio}
      />
      <ErrorMessage errorMessage={errorMessage} />
      <JoinRoomButton
        isRoomHost={reducer.isRoomHost}
        handleJoinRoom={handleJoinRoom}
      />
    </>
  )
}

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    setIsOnlyWithAudio: (onlyWithAudio) =>
      dispatch(setIsOnlyWithAudio(onlyWithAudio)),
    setIdentityAction: (identity) => dispatch(setIdentity(identity)),
    setRoomIdAction: (roomId) => dispatch(setRoomId(roomId)),
  }
}

export default connect(mapStoreStateToProps, mapActionsToProps)(JoinRoomContent)
