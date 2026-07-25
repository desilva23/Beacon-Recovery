'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ChevronRight } from 'lucide-react';

const steps = [
  {
    count: 5,
    sense: 'See',
    emoji: '👁️',
    color: 'indigo',
    instruction: 'Look around slowly. Name 5 things you can see right now.',
    prompt: 'What do you see?',
    examples: ['a wall', 'a window', 'your hands', 'a chair', 'the ceiling'],
  },
  {
    count: 4,
    sense: 'Touch',
    emoji: '✋',
    color: 'violet',
    instruction: 'Notice textures around you. Name 4 things you can physically touch.',
    prompt: 'What can you touch?',
    examples: ['the floor under your feet', 'your clothing', 'your phone', 'a surface near you'],
  },
  {
    count: 3,
    sense: 'Hear',
    emoji: '👂',
    color: 'blue',
    instruction: 'Listen carefully. Name 3 sounds you can hear right now.',
    prompt: 'What do you hear?',
    examples: ['traffic outside', 'your own breathing', 'birds or wind'],
  },
  {
    count: 2,
    sense: 'Smell',
    emoji: '👃',
    color: 'emerald',
    instruction: 'Take a slow breath. Name 2 things you can smell.',
    prompt: 'What do you smell?',
    examples: ['fresh air', 'your own scent'],
  },
  {
    count: 1,
    sense: 'Taste',
    emoji: '👅',
    color: 'amber',
    instruction: 'Notice your mouth. Name 1 thing you can taste.',
    prompt: 'What do you taste?',
    examples: ['nothing', 'something you ate recently'],
  },
];

const colorMap: Record<string, string> = {
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-950/30 dark:border-indigo-700 dark:text-indigo-200',
  violet: 'bg-violet-50 border-violet-200 text-violet-800 dark:bg-violet-950/30 dark:border-violet-700 dark:text-violet-200',
  blue: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-700 dark:text-blue-200',
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-700 dark:text-emerald-200',
  amber: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-700 dark:text-amber-200',
};

const buttonColorMap: Record<string, string> = {
  indigo: 'bg-indigo-600 hover:bg-indigo-700',
  violet: 'bg-violet-600 hover:bg-violet-700',
  blue: 'bg-blue-600 hover:bg-blue-700',
  emerald: 'bg-emerald-600 hover:bg-emerald-700',
  amber: 'bg-amber-500 hover:bg-amber-600',
};

export default function GroundingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[][]>(steps.map(() => []));
  const [input, setInput] = useState('');
  const [done, setDone] = useState(false);

  const step = steps[currentStep];
  const currentAnswers = answers[currentStep];
  const isStepComplete = currentAnswers.length >= step.count;

  const addAnswer = () => {
    const trimmed = input.trim();
    if (!trimmed || currentAnswers.length >= step.count) return;
    const updated = answers.map((a, i) =>
      i === currentStep ? [...a, trimmed] : a
    );
    setAnswers(updated);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addAnswer();
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md space-y-6"
        >
          <div className="text-6xl">🌟</div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Well done!</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            You just completed the 5-4-3-2-1 grounding exercise. You are present. You are safe. Your mind is here, not in the past or future.
          </p>
          <div className="space-y-3">
            <a href="/patient">
              <Button className="w-full h-12 text-base bg-indigo-600 hover:bg-indigo-700 text-white">
                Return to SOS Portal
              </Button>
            </a>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setCurrentStep(0);
                setAnswers(steps.map(() => []));
                setInput('');
                setDone(false);
              }}
            >
              Practice Again
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>5-4-3-2-1 Grounding</span>
            <span>Step {currentStep + 1} of {steps.length}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <motion.div
              className="bg-indigo-500 h-2 rounded-full"
              animate={{ width: `${((currentStep) / steps.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
          >
            <Card className={`border-2 ${colorMap[step.color]} shadow-lg`}>
              <CardContent className="p-6 space-y-5">
                <div className="text-center space-y-2">
                  <div className="text-5xl">{step.emoji}</div>
                  <div className="text-4xl font-black">{step.count}</div>
                  <h2 className="text-xl font-bold">Things You Can {step.sense}</h2>
                  <p className="text-sm opacity-80">{step.instruction}</p>
                </div>

                {/* Answers list */}
                <div className="space-y-2 min-h-[80px]">
                  {currentAnswers.map((ans, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0 opacity-70" />
                      <span>{ans}</span>
                    </motion.div>
                  ))}
                  {Array.from({ length: step.count - currentAnswers.length }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm opacity-30">
                      <div className="w-4 h-4 rounded-full border-2 border-current shrink-0" />
                      <span>{i === 0 && currentAnswers.length === 0 ? step.examples[0] : '...'}</span>
                    </div>
                  ))}
                </div>

                {/* Input */}
                {!isStepComplete && (
                  <div className="flex gap-2">
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`${step.prompt} (${currentAnswers.length + 1}/${step.count})`}
                      className="flex-1 px-3 py-2 rounded-lg border-2 border-current/30 bg-white/60 dark:bg-black/20 text-sm focus:outline-none focus:border-current/60"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={addAnswer}
                      className={`${buttonColorMap[step.color]} text-white px-4`}
                    >
                      Add
                    </Button>
                  </div>
                )}

                {isStepComplete && (
                  <Button
                    className={`w-full h-11 text-base ${buttonColorMap[step.color]} text-white`}
                    onClick={nextStep}
                  >
                    {currentStep < steps.length - 1 ? (
                      <>Next <ChevronRight className="w-4 h-4 ml-1" /></>
                    ) : (
                      '✓ Complete'
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
