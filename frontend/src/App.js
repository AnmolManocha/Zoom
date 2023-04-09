import React, { useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import IntroPage from './Pages/IntroPage/IntroPage'
import JoinPage from './Pages/JoinPage/JoinPage'
import RoomPage from './Pages/RoomPage/RoomPage'
import { connectWithSocketIOServer } from './utils/wss'

function App() {
  useEffect(() => {
    connectWithSocketIOServer()

    return () => {}
  }, [])

  return (
    <Router>
      <Routes>
        <Route path='/' element={<IntroPage />} />
        <Route path='/join-room' element={<JoinPage />} />
        <Route path='/room' element={<RoomPage />} />
      </Routes>
    </Router>
  )
}

export default App
