import React from 'react'
import { useNavigate } from 'react-router-dom'

const Button = ({ buttonText, cancelButton = false, onClickHandler }) => {
  const buttonClass = cancelButton
    ? 'joinRoom-cancel-button'
    : 'joinRoom-success-button'

  return (
    <button onClick={onClickHandler} className={buttonClass}>
      {buttonText}
    </button>
  )
}

const JoinRoomButton = ({ handleJoinRoom, isRoomHost }) => {
  const navigate = useNavigate()
  const successButtonText = isRoomHost ? 'Host' : 'Join'

  const pushToIntroPage = () => {
    navigate('/')
  }

  return (
    <div className='joinRoom-button-container'>
      <Button buttonText={successButtonText} onClickHandler={handleJoinRoom} />
      <Button
        buttonText='Cancel'
        cancelButton
        onClickHandler={pushToIntroPage}
      />
    </div>
  )
}

export default JoinRoomButton
