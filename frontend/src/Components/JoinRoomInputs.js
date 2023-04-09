import React from 'react'

const Input = ({ placeholder, value, changeHandler }) => {
  return (
    <input
      type='text'
      value={value}
      onChange={changeHandler}
      className='joinRoom-input'
      placeholder={placeholder}
    />
  )
}

const JoinRoomInputs = (props) => {
  const { roomId, setRoomId, name, setName, isRoomHost } = props

  const handleRoomIdChange = (event) => {
    setRoomId(event.target.value)
  }

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  return (
    <div className='joinRoom-input-container'>
      {!isRoomHost && (
        <Input
          placeholder='Enter Meeting Id'
          value={roomId}
          changeHandler={handleRoomIdChange}
        />
      )}
      <Input
        placeholder='Enter your Name'
        value={name}
        changeHandler={handleNameChange}
      />
    </div>
  )
}

export default JoinRoomInputs
