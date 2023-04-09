import React, { useEffect } from 'react'
import './JoinPage.css'
import logo from '../../Images/Zoom_logo.svg'
import { useSearchParams } from 'react-router-dom'
import { setIsRoomHost } from '../../app/actions'
import { connect } from 'react-redux'
import JoinRoomTitle from '../../Components/JoinRoomTitle'
import JoinRoomContent from '../../Components/JoinRoomContent'

const JoinPage = (props) => {
  const { setIsRoomHostAction, reducer } = props
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const isRoomHost = searchParams.get('host')
    if (isRoomHost) {
      setIsRoomHostAction(true)
    }
    return () => {}
  }, [searchParams, setIsRoomHostAction])

  return (
    <div className='joinPage-container'>
      <div className='joinCard-container'>
        <img src={logo} alt='Zoom' className='introCard-logo' />
        <div className='joinContent-container'>
          <JoinRoomTitle isRoomHost={reducer.isRoomHost} />
          <JoinRoomContent />
        </div>
      </div>
    </div>
  )
}

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    setIsRoomHostAction: (isRoomHost) => dispatch(setIsRoomHost(isRoomHost)),
  }
}

export default connect(mapStoreStateToProps, mapActionsToProps)(JoinPage)
