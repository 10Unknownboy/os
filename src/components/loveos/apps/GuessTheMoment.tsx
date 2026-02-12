import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Frown, Trophy, RotateCcw, Sparkles } from "lucide-react";
import { GlassCard, RomanticButton } from "@/components/love";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

interface GuessTheMomentProps {
  customData?: { project: any; analytics: any[]; quiz: any[]; terminal: any[] };
}

const GuessTheMoment = ({ customData }: GuessTheMomentProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (customData?.quiz?.length) {
      setQuestions(customData.quiz.map((q: any, i: number) => ({
        id: i + 1,
        question: q.question,
        options: [q.option_1, q.option_2, q.option_3, q.option_4],
        correct: (q.correct_option || 1) - 1,
      })));
      return;
    }

    fetch("/data/quiz.json")
      .then((res) => res.json())
      .then((data) => setQuestions(data.questions))
      .catch(() => setQuestions([
        { id: 1, question: "Where did we have our first date?", options: ["Coffee shop", "The park", "Restaurant", "Movies"], correct: 2 },
        { id: 2, question: "What's my favorite thing about you?", options: ["Your smile", "Your laugh", "Your kindness", "Everything!"], correct: 3 },
      ]));
  }, [customData]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answerIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    if (answerIndex === currentQuestion.correct) {
      setScore(score + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    } else {
      setScore(Math.max(0, score - 1));
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setIsComplete(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsComplete(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "You know me so well! 💕";
    if (percentage >= 60) return "Pretty good! We're connected! 🌟";
    if (percentage >= 40) return "Not bad! Let's make more memories! 💫";
    return "Let's spend more time together! 💝";
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Heart size={48} className="text-primary" />
        </motion.div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="w-24 h-24 rounded-full bg-gradient-romantic mx-auto mb-6 flex items-center justify-center">
            <Trophy size={48} className="text-primary-foreground" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4 text-gradient">Quiz Complete!</h2>
          <GlassCard className="mb-6">
            <div className="text-5xl font-bold text-primary mb-2">{score}/{questions.length}</div>
            <p className="text-muted-foreground">{getScoreMessage()}</p>
          </GlassCard>
          <RomanticButton onClick={restart}><RotateCcw size={18} />Play Again</RomanticButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6">
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(20)].map((_, i) => (
              <motion.div key={i} className="absolute" initial={{ x: "50%", y: "50%", scale: 0 }} animate={{ x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%`, scale: [0, 1, 0], rotate: Math.random() * 360 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
                <Heart size={24} className="text-primary fill-primary" style={{ opacity: 0.8 }} />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">Question {currentIndex + 1} of {questions.length}</div>
        <div className="flex items-center gap-2 text-primary font-semibold"><Heart size={16} className="fill-current" />Score: {score}</div>
      </div>
      <div className="h-2 bg-accent rounded-full mb-8 overflow-hidden">
        <motion.div className="h-full bg-gradient-romantic rounded-full" initial={{ width: 0 }} animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
          <GlassCard className="mb-6"><h3 className="text-xl font-semibold text-foreground">{currentQuestion?.question}</h3></GlassCard>
          <div className="grid gap-3">
            {currentQuestion?.options.map((option, index) => {
              const isCorrect = index === currentQuestion.correct;
              const isSelected = selectedAnswer === index;
              let buttonClass = "glass-card p-4 text-left transition-all";
              if (isAnswered) {
                if (isCorrect) buttonClass += " ring-2 ring-green-500 bg-green-500/10";
                else if (isSelected) buttonClass += " ring-2 ring-destructive bg-destructive/10";
              } else buttonClass += " hover:bg-accent/50 cursor-pointer";
              return (
                <motion.button key={index} onClick={() => handleAnswer(index)} className={buttonClass} whileHover={!isAnswered ? { scale: 1.02 } : {}} whileTap={!isAnswered ? { scale: 0.98 } : {}} animate={isAnswered && isSelected && !isCorrect ? { x: [0, -10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAnswered && isCorrect ? "bg-green-500 text-white" : isAnswered && isSelected ? "bg-destructive text-white" : "bg-accent"}`}>
                      {isAnswered && isCorrect && <Heart size={16} className="fill-current" />}
                      {isAnswered && isSelected && !isCorrect && <Frown size={16} />}
                      {!isAnswered && <span className="text-sm font-medium">{String.fromCharCode(65 + index)}</span>}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
      {isAnswered && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <RomanticButton onClick={nextQuestion} className="w-full">
            {currentIndex + 1 >= questions.length ? "See Results" : "Next Question"}<Sparkles size={18} />
          </RomanticButton>
        </motion.div>
      )}
    </div>
  );
};

export default GuessTheMoment;
