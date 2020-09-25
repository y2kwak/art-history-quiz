import React, { useState } from 'react';
import {fetchQuizQuestions} from './API';

//Components
import QuestionCard from './components/QuestionCard'
// types
import { QuestionState, Difficulty } from './API';
//styles
import { GlobalStyle } from './App.styles';

export type AnswerObject = {
  question:string;
  answer:string;
  correct: boolean;
  correctAnswer: string;
}

function App() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]); // array of questionstate
  const [number, setNumber] = useState(0); // q number that user is currenlty on
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const TOTAL_QUESTIONS = 10;
  
  const startTrivia = async() => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS, 
      Difficulty.EASY);

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => { // event cause by mouse event, specifically on button
    if (!gameOver) {
      //Users answer
      const answer = e.currentTarget.value; // when we press button in question card
      // check answer against correct answer
      const correct = questions[number].correct_answer === answer;
      // add score if answer is correct
      if(correct) setScore(prev => prev+1);

      //save answer in the array of user answers
      const AnswerObject = {
        question: questions[number].question,
        answer, // same as answer
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers(prev => [...prev, AnswerObject]); 
    }
  }

  const nextQuestion = () => {
    // move on to next question if not the last
    const nextQuestion = number + 1;
    if(nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  }

  return ( 
    <>
    <GlobalStyle/>
    <div className="App">
      <h1>React Quiz </h1>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? ( // only shows the start button if 10 questions have not been answered and is gameOver intial
        <button className="start" onClick={startTrivia}>
          Start
        </button>
      ) : null}
      {!gameOver ? <p className="score">Score : {score}</p> : null }
      {loading && <p>Loading Questions...</p>}
      {!loading && !gameOver  && (
      <QuestionCard
        questionNumber={number +1}
        totalQuestions={TOTAL_QUESTIONS}
        question={questions[number].question}
        answers={questions[number].answers}
        userAnswer={userAnswers ? userAnswers[number] : undefined}
        callback={checkAnswer}
      />)}
      {!loading && 
      !gameOver && 
      userAnswers.length === number + 1 && 
      number !== TOTAL_QUESTIONS - 1 ? (
      <button className="next" onClick={nextQuestion}>
        Next Question
        </button>
      ) : null}
    </div>
    </>
  );
}

export default App;
