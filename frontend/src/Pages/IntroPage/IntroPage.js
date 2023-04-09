import React, { useEffect } from 'react'
import './IntroPage.css'
import logo from '../../Images/Zoom_logo.svg'
import IntroButton from '../../Components/IntroButton'
import { useNavigate } from 'react-router-dom'
import { setIsRoomHost } from '../../app/actions'
import { connect } from 'react-redux'

const IntroPage = ({ setIsRoomHostAction }) => {
  const navigate = useNavigate()

  // const code = Array.from({ length: 10 }, () => {
  //   const charCode = Math.floor(Math.random() * 26) + 97 // generates a random number between 97 and 122 (ASCII codes for lowercase letters)
  //   return String.fromCharCode(charCode) // converts the ASCII code to a character
  // }).join('')

  // const formattedCode = `${code.slice(0, 3)}-${code.slice(3, 7)}-${code.slice(
  //   7,
  //   10
  // )}`

  const submitJoinRoom = () => {
    navigate(`/join-room`)
  }

  const submitCreateRoom = () => {
    navigate('/join-room?host=true')
  }

  useEffect(() => {
    setIsRoomHostAction(false)
  }, [setIsRoomHostAction])

  return (
    <div className='introPage-container'>
      <div className='introCard-container'>
        <img src={logo} alt='Zoom' className='introCard-logo' />
        <div className='introButton-container'>
          <IntroButton
            buttonText='Join a meeting'
            onClickHandler={submitJoinRoom}
          />
          <IntroButton
            createRoom
            buttonText='Host a meeting'
            onClickHandler={submitCreateRoom}
          />
        </div>
      </div>
    </div>
  )
}

const mapActionsToProps = (dispatch) => {
  return {
    setIsRoomHostAction: (isRoomHost) => dispatch(setIsRoomHost(isRoomHost)),
  }
}

export default connect(null, mapActionsToProps)(IntroPage)
