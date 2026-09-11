import { useState, useEffect } from 'react';
import { Trophy, CheckCircle2, XCircle, ArrowRight, Award, Star } from 'lucide-react';
import { navigate } from '@/hooks/useRouter';
import { quizQuestions, badges } from '@/data/quiz';
import { useProgress } from '@/hooks/useProgress';
import * as Icons from 'lucide-react';

export function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState<Set<number>>(new Set);
  const [quizComplete, setQuizComplete] = useState(false);
  const { progress, recordQuizResult, awardBadge, checkBadges } = useProgress();

  const questions = quizQuestions;
  const question = questions[currentQuestion];

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelectedAnswer(idx);
    setShowResult(true);
    if (idx === question.correctAnswer) {
      setScore(score + question.points);
      setCorrectCount(correctCount + 1);
    }
    setAnswered(new Set([...answered, currentQuestion]));
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
      await recordQuizResult(score, correctCount, questions.length, 'heritage_quiz');
      const fakeProgress = { ...progress, totalPoints: progress.totalPoints + score, quizCorrectTotal: progress.quizCorrectTotal + correctCount };
      await checkBadges(fakeProgress);
    }
  };

  const restart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCorrectCount(0);
    setAnswered(new Set());
    setQuizComplete(false);
  };

  if (quizComplete) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="min-h-screen bg-stone-950 pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-900/40">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h1>
            <p className="text-stone-400">You answered {correctCount} out of {questions.length} questions correctly</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-center">
              <div className="text-3xl font-bold text-amber-400">{score}</div>
              <div className="text-stone-500 text-xs mt-1">Points Earned</div>
            </div>
            <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-center">
              <div className="text-3xl font-bold text-emerald-400">{correctCount}</div>
              <div className="text-stone-500 text-xs mt-1">Correct</div>
            </div>
            <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-center">
              <div className="text-3xl font-bold text-blue-400">{percentage}%</div>
              <div className="text-stone-500 text-xs mt-1">Accuracy</div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={restart} className="px-6 py-3 rounded-xl bg-amber-500 text-stone-900 font-semibold hover:bg-amber-400 transition-colors">
              Try Again
            </button>
            <button onClick={() => navigate('/journey')} className="px-6 py-3 rounded-xl bg-stone-800 text-white font-semibold border border-stone-700 hover:bg-stone-700 transition-colors">
              View Journey
            </button>
          </div>

          {/* Badges earned */}
          {progress.badges.length > 0 && (
            <div className="mt-8 p-5 rounded-2xl bg-stone-900 border border-stone-800">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><Award className="w-5 h-5 text-amber-400" /> Your Badges</h3>
              <div className="flex flex-wrap gap-3">
                {progress.badges.map((badgeId) => {
                  const badge = badges.find((b) => b.id === badgeId);
                  if (!badge) return null;
                  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[badge.icon] || Award;
                  return (
                    <div key={badgeId} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-800">
                      <Icon className="w-4 h-4" style={{ color: badge.color }} />
                      <span className="text-stone-300 text-sm">{badge.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Heritage Quiz</h1>
            <p className="text-stone-400 text-sm">Test your knowledge of Indian culture</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium flex items-center gap-1.5">
              <Star className="w-4 h-4" /> {score} pts
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-stone-500 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-stone-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-500" style={{ width: `${((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden mb-6">
          {question.image && (
            <div className="aspect-[16/10] overflow-hidden">
              <img src={question.image} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-6">
            <span className="px-2.5 py-1 rounded-full bg-stone-800 text-stone-400 text-xs font-medium mb-3 inline-block capitalize">{question.category.replace('_', ' ')}</span>
            <h2 className="text-xl font-semibold text-white mb-4">{question.question}</h2>

            <div className="space-y-2">
              {question.options.map((option, idx) => {
                const isCorrect = idx === question.correctAnswer;
                const isSelected = idx === selectedAnswer;
                let className = 'border-stone-800 bg-stone-800/50 hover:bg-stone-800 text-stone-300';
                if (showResult) {
                  if (isCorrect) {
                    className = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400';
                  } else if (isSelected) {
                    className = 'border-red-500/50 bg-red-500/10 text-red-400';
                  } else {
                    className = 'border-stone-800 bg-stone-800/30 text-stone-500';
                  }
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={showResult}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${className}`}
                  >
                    <span className="font-medium">{option}</span>
                    {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div className="mt-4 p-4 rounded-xl bg-stone-800/50 border border-stone-700">
                <p className="text-stone-300 text-sm leading-relaxed">{question.explanation}</p>
              </div>
            )}
          </div>
        </div>

        {showResult && (
          <button
            onClick={handleNext}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'} <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
