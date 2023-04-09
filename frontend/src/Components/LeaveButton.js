import React from 'react'

const LeaveButton = () => {
  const handleLeaveButton = () => {
    const siteUrl = window.location.origin
    window.location.href = siteUrl
  }
  return (
    <div className='videoButton-container'>
      <button onClick={handleLeaveButton} id='leave-button'>
        <i className='material-symbols-outlined'>Call_End</i>
      </button>
    </div>
  )
}

export default LeaveButton
