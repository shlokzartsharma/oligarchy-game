import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { quizzes } from '../data/quizzes';
import Ollie from '../components/Ollie';

const QuizScreen = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { completeQuiz, unlockAccount, updateAccount } = useGameStore();
  const quiz = quizzes.find((q) => q.id === quizId);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [ollieMessage, setOllieMessage] = useState('');

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers, answerIndex];
    setSelectedAnswers(newAnswers);

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      const correct = quiz.questions.filter(
        (q, i) => q.correctAnswer === newAnswers[i]
      ).length;
      const score = (correct / quiz.questions.length) * 100;
      setShowResults(true);

      if (score >= quiz.passingScore) {
        setOllieMessage(`Congratulations! You scored ${score.toFixed(0)}%! You've unlocked new accounts.`);
        completeQuiz(quiz.id);
        // Unlock accounts
        quiz.unlocks.forEach((accountType) => {
          unlockAccount(accountType as any);
          if (accountType === 'checking') {
            updateAccount('checking', 500);
          } else if (accountType === 'savings') {
            updateAccount('savings', 500);
          }
        });
      } else {
        setOllieMessage(`You scored ${score.toFixed(0)}%. You need ${quiz.passingScore}% to pass. Try again!`);
      }
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setOllieMessage('');
  };

  const handleContinue = () => {
    navigate('/quick-play/game');
  };

  const currentQ = quiz.questions[currentQuestion];
  const score = showResults
    ? (quiz.questions.filter((q, i) => q.correctAnswer === selectedAnswers[i]).length /
        quiz.questions.length) *
      100
    : 0;
  const passed = score >= quiz.passingScore;

  return (
    <div className="min-h-screen bg-cream p-4 pt-24">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl"
        >
          <h1 className="text-3xl font-bold text-navy mb-6">{quiz.title}</h1>

          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-4">
                  <span className="text-navy/60">
                    Question {currentQuestion + 1} of {quiz.questions.length}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-navy mb-6">
                  {currentQ.question}
                </h2>
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(index)}
                      className="w-full text-left p-4 rounded-lg border-2 border-navy/20 hover:border-navy bg-cream hover:bg-cream/80 transition-all"
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{passed ? '🎉' : '📚'}</div>
                  <h2 className="text-3xl font-bold text-navy mb-2">
                    {passed ? 'You Passed!' : 'Keep Learning'}
                  </h2>
                  <p className="text-xl text-navy/70">
                    Score: {score.toFixed(0)}% (Need {quiz.passingScore}%)
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  {quiz.questions.map((q, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg ${
                        selectedAnswers[i] === q.correctAnswer
                          ? 'bg-soft-green/20 border-2 border-soft-green'
                          : 'bg-soft-red/20 border-2 border-soft-red'
                      }`}
                    >
                      <p className="font-semibold text-navy mb-2">{q.question}</p>
                      <p className="text-sm text-navy/70 mb-1">
                        <strong>Your answer:</strong> {q.options[selectedAnswers[i]]}
                      </p>
                      <p className="text-sm text-navy/70 mb-1">
                        <strong>Correct answer:</strong> {q.options[q.correctAnswer]}
                      </p>
                      <p className="text-sm text-navy/80 mt-2 italic">
                        {q.explanation}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  {!passed && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRetry}
                      className="flex-1 bg-navy text-cream px-6 py-3 rounded-full font-bold"
                    >
                      Retry
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleContinue}
                    className={`flex-1 px-6 py-3 rounded-full font-bold ${
                      passed
                        ? 'bg-soft-green text-navy'
                        : 'bg-navy text-cream'
                    }`}
                  >
                    {passed ? 'Continue to Game' : 'Continue Anyway'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {ollieMessage && <Ollie message={ollieMessage} />}
      </div>
    </div>
  );
};

export default QuizScreen;

