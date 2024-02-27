import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Screens/Login'
import Publicpage from './Screens/Publicpage'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Login/>
     
    </>
  )
}

export default App
