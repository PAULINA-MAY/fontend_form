import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from "./features/home"
import  Exam from "./features/exam"

function App() {
  

  return (
    <>
         <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}></Route> 
        <Route path='/exam' element={<Exam />}></Route> 
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
