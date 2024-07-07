import React from 'react'
import './App.css'
import { Link, Route, Routes } from 'react-router-dom'
const App = () => {
  return (
    <Routes>
      <Route
        path={'/'}
        element={
          <div>
            <h1>Hello, SSR!</h1>
            <Link to={'/about'}>About</Link>
          </div>
        }
      />
      <Route
        path={'/about'}
        element={
          <div>
            <h1>SSR is sever side rendering</h1>
            <Link to={'/'}>Home</Link>
          </div>
        }
      />
    </Routes>
  )
}

export default App
