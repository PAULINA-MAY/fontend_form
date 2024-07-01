import React, { useState, useEffect } from "react";
import { fetchQuestions } from '../services/public.services';
import { FiClock } from 'react-icons/fi';

const CardQuestion = () => {
  const [questionsData, setQuestionsData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [selectedOptionsState, setSelectedOptionsState] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchQuestions();
        let shuffledQuestions = shuffleArray(res.data.data); // Shuffle questions
        setQuestionsData(shuffledQuestions);
        setSelectedOptionsState(new Array(shuffledQuestions.length).fill(null));
        startTimer(); // Start timer when questions are loaded
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft > 0 && !answerFeedback) {
        setTimeLeft(timeLeft - 1);
      } else if (timeLeft === 0 && !answerFeedback) {
        revealAnswer();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, answerFeedback]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startTimer = () => {
    setTimeLeft(15); 
  };

  const revealAnswer = () => {
    const correctAnswerId = questionsData[currentQuestionIndex].Option.find(option => option.IsCorrect).Id_o;
    setAnswerFeedback('timeup');
    setSelectedOptionsState(options => {
      const updatedSelectedOptions = [...options];
      updatedSelectedOptions[currentQuestionIndex] = correctAnswerId;
      return updatedSelectedOptions;
    });
    setShowNextButton(true);
  };

  const handleOptionChange = (optionId) => {
    if (!answerFeedback) {
      const updatedSelectedOptions = [...selectedOptionsState];
      updatedSelectedOptions[currentQuestionIndex] = optionId;
      setSelectedOptionsState(updatedSelectedOptions);
      setSelectedOption(optionId);

      const correctAnswer = questionsData[currentQuestionIndex].Option.find(option => option.IsCorrect).Id_o;
      if (optionId === correctAnswer) {
        setCorrectAnswers(correctAnswers + 1);
        setAnswerFeedback('correct');
      } else {
        setAnswerFeedback('incorrect');
      }
      setShowNextButton(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questionsData.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setAnswerFeedback(null);
      setShowNextButton(false);
      startTimer(); // Restart timer for the next question
    } else {
      setShowModal(true);
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setCorrectAnswers(0);
    setShowModal(false);
    setAnswerFeedback(null);
    setShowNextButton(false);
    setSelectedOptionsState(new Array(questionsData.length).fill(null));
    setQuizCompleted(false);
    let shuffledQuestions = shuffleArray(questionsData); // Reshuffle questions for restart
    setQuestionsData(shuffledQuestions);
    startTimer(); // Restart timer when restarting quiz
  };

  const handleExitQuiz = () => {
    window.location.href = '/'; // Redirect to home page
  };

  // Function to shuffle an array
  const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  // Función para obtener el mensaje según el número de aciertos
  const getMessage = () => {
    if (correctAnswers === 4) {
      return "¡Felicidades! Conseguiste 4 de 5 aciertos.";
    } else if (correctAnswers === 3) {
      return "¡Bien! Conseguiste 3 de 5 aciertos.";
    } else if (correctAnswers === 2) {
      return "¡Hay que estudiar! Conseguiste 2 de 5 aciertos.";
    } else if (correctAnswers === 0) {
      return "Lo siento, conseguiste 0 de 5 aciertos.";
    } else {
      return `Obtuviste ${correctAnswers} de 5 aciertos.`;
    }
  };

  return (
    <>
      <div className="w-1/2 mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-8">
        <div className="flex items-center justify-between py-4">
          <h2 className="text-xl font-bold text-black-400">Evaluación 2 Parcial</h2>
          <div className="flex items-center ">
            <FiClock className="mr-2 text-indigo-600 " />
            <p className="text-xl font-semibold text-indigo-600">{formatTime(timeLeft)}</p>
          </div>
        </div>

        {!quizCompleted && questionsData.length > 0 && (
          <>
            <p className="text-lg mb-4">{questionsData[currentQuestionIndex].Content_q}</p>
            <div className="grid grid-cols-1 gap-4">
              {questionsData[currentQuestionIndex].Option.map(option => {
                const isSelected = selectedOptionsState[currentQuestionIndex] === option.Id_o;
                const isCorrect = option.IsCorrect;
                let optionClass = "bg-blue-200 border-2 border-blue-200";
                let icon = null;

                if (answerFeedback === 'timeup') {
                  if (isCorrect) {
                    optionClass = `bg-green-200 border-2 border-green-600`;
                    icon = <span className={`text-green-600 text-2xl`}>&#10003;</span>;
                  } else {
                    optionClass = `bg-gray-200 border-2 border-gray-400`;
                  }
                } else {
                  if (isSelected && answerFeedback) {
                    optionClass = `bg-${answerFeedback === 'correct' ? 'green' : 'red'}-200 border-2 border-${answerFeedback === 'correct' ? 'green' : 'red'}-600`;
                    icon = <span className={`text-${answerFeedback === 'correct' ? 'green' : 'red'}-600 text-2xl`}>{answerFeedback === 'correct' ? '\u2713' : '\u2717'}</span>;
                  } else if (!isSelected && answerFeedback && isCorrect) {
                    optionClass = `bg-green-200 border-2 border-green-600`;
                    icon = <span className={`text-green-600 text-2xl`}>&#10003;</span>;
                  } else if (!isSelected && answerFeedback && !isCorrect) {
                    optionClass = `bg-red-200 border-2 border-red-600`;
                    icon = <span className={`text-red-600 text-2xl`}>&#10007;</span>;
                  }
                }

                return (
                  <div
                    key={option.Id_o}
                    className={`flex items-center p-4 rounded cursor-pointer ${optionClass}`}
                    onClick={() => handleOptionChange(option.Id_o)}
                    style={{ backgroundColor: isSelected ? (isCorrect ? '#34D399' : '#EF4444') : '' }}
                  >
                    <input
                      type="radio"
                      name="option"
                      id={option.Id_o}
                      className="mr-2"
                      checked={isSelected}
                      onChange={() => { }}
                      // No deshabilitar el input cuando se ha proporcionado retroalimentación
                      disabled={answerFeedback !== null}
                    />
                    <label htmlFor={option.Id_o} className="text-blue-600 font-medium">{option.Content_o}</label>
                    {icon}
                  </div>
                );
              })}
            </div>
            {answerFeedback !== 'timeup' && selectedOption && (
              <button
                className={`mt-4 bg-${answerFeedback === 'correct' ? 'green' : 'red'}-500 text-white px-4 py-2 rounded hover:bg-${answerFeedback === 'correct' ? 'green' : 'red'}-600`}
                onClick={handleNextQuestion}
                disabled={!showNextButton}
              >
                Siguiente
              </button>
            )}
            {answerFeedback === 'timeup' && (
              <button
                className={`mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600`}
                onClick={handleNextQuestion}
                disabled={!showNextButton}
              >
                Siguiente
              </button>
            )}
          </>
        )}
        {quizCompleted && (
          <>
            <h2 className="text-xl font-bold mb-4">Resumen de Respuestas</h2>
            <div className="mb-4">
              {questionsData.map((question, index) => (
                <div key={question.Id_q} className="flex justify-between mb-2">
                  <p>{question.Content_q}</p>
                  <p>
                    {selectedOptionsState[index] === question.Option.find(opt => opt.IsCorrect).Id_o ? (
                      <span className={`text-green-600`}>&#10003;</span>
                    ) : (
                      <span className="text-red-600">&#10007;</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-lg mb-4">
              Has respondido correctamente {correctAnswers} de {questionsData.length} preguntas.
            </p>
            {correctAnswers === questionsData.length ? (
              <p className="text-green-600 font-medium">¡Felicidades! Has respondido correctamente todas las preguntas.</p>
            ) : (
              <p className="text-red-600 font-medium">No has respondido todas las preguntas correctamente.</p>
            )}
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
              onClick={handleRestartQuiz}
            >
              Presentar de nuevo
            </button>
            <button
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={handleExitQuiz}
            >
              Salir
            </button>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Resultado de la Evaluación</h2>
            <p className="text-lg mb-4 font-semibold  text-gray-400">
              { getMessage()}
            </p>
            {correctAnswers === questionsData.length ? (
              <p className="text-green-600 font-medium">¡Felicidades! Has respondido correctamente todas las preguntas.</p>
            ) : (
              <p className="text-red-600 font-medium">No has respondido todas las preguntas correctamente.</p>
            )}
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
              onClick={handleRestartQuiz}
            >
              Presentar de nuevo
            </button>
            <button
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={handleExitQuiz}
            >
              Salir
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CardQuestion;






