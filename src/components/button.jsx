
import React from 'react'

function MyButton({ onClick, title}) {
  return <>
    <button 
     onClick={onClick}
    className="bg-indigo-500 text-white font-bold py-2 px-6  mt-4 rounded hover:bg-indigo-700 transition duration-300">
    {title}
      </button>
  </>
}

export default MyButton;