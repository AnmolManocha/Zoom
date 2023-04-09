import React from 'react'

const IntroButton = ({
  createRoom = false,
  buttonText,
  onClickHandler,
}) => {
  const buttonClass = createRoom ? 'createRoom-button' : 'joinRoom-button'
  return (
    <button className={buttonClass} onClick={onClickHandler}>
      {buttonText}
    </button>
  )
}

export default IntroButton
