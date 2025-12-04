import { useState, useEffect } from "react";
import { Trophy, CheckCircle2, XCircle, ArrowRight, RotateCcw, ArrowUp, ArrowDown } from "lucide-react";
import quizQuestions from "../data/quizQuestions.json";

interface QuizQuestion {
  type: string;
  question: string;
  options: string[];
  answer: string;
}

export function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [rankedOrder, setRankedOrder] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    // Shuffle and select 10 random questions
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 10));
  }, []);

  useEffect(() => {
    // Initialize ranked order for ranking questions
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion?.type === "rank") {
      setRankedOrder([...currentQuestion.options].sort(() => Math.random() - 0.5));
    }
  }, [currentQuestionIndex, questions]);

  const handleRankingSubmit = () => {
    if (selectedAnswer !== null) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = rankedOrder.join(", ");
    const correct = userAnswer === currentQuestion.answer;
    
    setSelectedAnswer(userAnswer);
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    if (selectedAnswer !== null) return;
    
    const newOrder = [...rankedOrder];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newOrder.length) {
      [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
      setRankedOrder(newOrder);
    }
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return; // Prevent double-clicking

    setSelectedAnswer(answer);
    const currentQuestion = questions[currentQuestionIndex];
    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 10));
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setRankedOrder([]);
    setScore(0);
    setShowResult(false);
    setIsCorrect(null);
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="text-center text-blue-200">Loading quiz...</div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="text-center">
          <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h3>
          <div className="text-5xl font-bold text-yellow-400 mb-2">
            {score}/{questions.length}
          </div>
          <div className="text-2xl text-blue-200 mb-6">{percentage}%</div>
          <div className="mb-6">
            {percentage >= 80 && (
              <div className="text-green-400 text-xl font-bold">🌟 Excellent! You're an Instagram expert!</div>
            )}
            {percentage >= 60 && percentage < 80 && (
              <div className="text-yellow-400 text-xl font-bold">👍 Good job! You know your celebrities!</div>
            )}
            {percentage < 60 && (
              <div className="text-blue-200 text-xl font-bold">💪 Keep practicing! Try again!</div>
            )}
          </div>
          <button
            onClick={resetQuiz}
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <Trophy className="h-6 w-6 text-yellow-400 mr-2" />
          Instagram Follower Quiz
        </h3>
        <div className="text-yellow-400 font-bold">
          {currentQuestionIndex + 1}/{questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-white/10 rounded-full h-3 mb-2">
          <div
            className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-blue-200">
          <span>Score: {score}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h4 className="text-xl font-bold text-white mb-6 text-center">
          {currentQuestion.question}
        </h4>

        {/* Ranking Question */}
        {currentQuestion.type === "rank" ? (
          <div className="space-y-3 mb-6">
            {rankedOrder.map((option, index) => {
              const correctOrder = currentQuestion.answer.split(", ");
              const correctIndex = correctOrder.indexOf(option);
              const isInCorrectPosition = selectedAnswer !== null && index === correctIndex;
              const isWrongPosition = selectedAnswer !== null && index !== correctIndex;

              let itemClass = "flex items-center justify-between p-4 rounded-xl font-bold transition-all duration-300 border-2 ";
              
              if (selectedAnswer !== null) {
                if (isInCorrectPosition) {
                  itemClass += "bg-green-500/30 border-green-400 text-white";
                } else if (isWrongPosition) {
                  itemClass += "bg-red-500/30 border-red-400 text-white";
                } else {
                  itemClass += "bg-white/5 border-white/10 text-white/50";
                }
              } else {
                itemClass += "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30";
              }

              return (
                <div key={index} className={itemClass}>
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => moveItem(index, "up")}
                        disabled={selectedAnswer !== null || index === 0}
                        className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => moveItem(index, "down")}
                        disabled={selectedAnswer !== null || index === rankedOrder.length - 1}
                        className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center font-bold text-yellow-400">
                        {index + 1}
                      </div>
                      <span className="flex-1">{option}</span>
                    </div>
                  </div>
                  {selectedAnswer !== null && (
                    <>
                      {isInCorrectPosition ? (
                        <CheckCircle2 className="h-6 w-6 text-green-400" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-400" />
                      )}
                    </>
                  )}
                </div>
              );
            })}
            {selectedAnswer === null && (
              <button
                onClick={handleRankingSubmit}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-6 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mt-4"
              >
                Submit Ranking
              </button>
            )}
          </div>
        ) : (
          /* Regular Options */
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "w-full p-4 rounded-xl font-bold text-left transition-all duration-300 border-2 ";
              
              if (selectedAnswer === option) {
                if (isCorrect) {
                  buttonClass += "bg-green-500/30 border-green-400 text-white";
                } else {
                  buttonClass += "bg-red-500/30 border-red-400 text-white";
                }
              } else if (selectedAnswer !== null && option === currentQuestion.answer) {
                buttonClass += "bg-green-500/30 border-green-400 text-white";
              } else {
                buttonClass += "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {selectedAnswer === option && (
                      <>
                        {isCorrect ? (
                          <CheckCircle2 className="h-6 w-6 text-green-400" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-400" />
                        )}
                      </>
                    )}
                    {selectedAnswer !== null && option === currentQuestion.answer && selectedAnswer !== option && (
                      <CheckCircle2 className="h-6 w-6 text-green-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedAnswer && currentQuestion.type !== "rank" && (
        <div className={`text-center p-4 rounded-xl ${
          isCorrect ? "bg-green-500/20 border border-green-400/30" : "bg-red-500/20 border border-red-400/30"
        }`}>
          <div className={`font-bold text-lg ${
            isCorrect ? "text-green-400" : "text-red-400"
          }`}>
            {isCorrect ? "✅ Correct!" : `❌ Wrong! The answer is: ${currentQuestion.answer}`}
          </div>
        </div>
      )}
      {selectedAnswer && currentQuestion.type === "rank" && (
        <div className={`text-center p-4 rounded-xl ${
          isCorrect ? "bg-green-500/20 border border-green-400/30" : "bg-red-500/20 border border-red-400/30"
        }`}>
          <div className={`font-bold text-lg ${
            isCorrect ? "text-green-400" : "text-red-400"
          }`}>
            {isCorrect ? "✅ Perfect ranking!" : `❌ Wrong order! Correct order: ${currentQuestion.answer}`}
          </div>
        </div>
      )}
    </div>
  );
}

