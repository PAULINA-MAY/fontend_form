import React from 'react';

import MyButton from '../components/button';

function Card() {


  const handleStartClick = () => {
    window.location.href = '/exam';
  };

  return (
    <>
      <div className="w-1/2 h-1/2 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex h-full">
          <div className="md:flex-shrink-0 w-full md:w-1/2">
            <img className="h-full w-full object-cover" src="https://cdn.pixabay.com/photo/2018/05/18/15/30/web-design-3411373_640.jpg" alt="Card Image" />
          </div>
          <div className="p-8 w-full md:w-1/2 flex flex-col justify-center">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Evaluación</div>
            <a href="#" className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Parcial 2</a>
            <h2 className=" uppercase tracking-wide mt-2 text-gray-600 font-semibold">Reglas</h2>
            <p className="text-gray-600">
                1-Solo tienes <span className="text-red-500 font-medium">15 segundos</span> para responder cada pregunta
            </p>
            <p className=' text-gray-600'>2-No puedes salir del quizz mentraz este corriendo tu tiempo</p>
            <p className=' text-gray-600'>3-Obtendrás puntos base a tus respuestas correctas</p>
            <MyButton onClick={handleStartClick} title={"Empezar"} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;
