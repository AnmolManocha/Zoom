import React from 'react'

const ErrorMessage = ({ errorMessage }) => {
  return (
    <div className='errorMessage-container'>
      {errorMessage && <span className='errorMessage'>{errorMessage}</span>}
    </div>
  )
}

export default ErrorMessage
