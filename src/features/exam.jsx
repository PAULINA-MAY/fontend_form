import React, { useState, useEffect } from 'react';
import CardQuestion from '../components/cardQuestion'; 

function Exam() {


 
  
  return (
    <>
   <div className="flex justify-center items-center h-screen flex-col bg-gradient-to-br from-purple-600 to-indigo-600">
            <CardQuestion />
        </div>
    </>
  );
}

export default Exam;



