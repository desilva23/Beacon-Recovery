'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mic, Square, AlertCircle, Heart } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { BreathPacer } from '@/components/coping/breath-pacer';
import type { CrisisPlan } from '@/lib/ai';

export default function PatientDashboard() {
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition();
  const [isProcessing, setIsProcessing] = useState(false);
  const [crisisPlan, setCrisisPlan] = useState<CrisisPlan | null>(null);

  const handleStop = async () => {
    stopListening();
    if (!transcript.trim()) return;
    
    setIsProcessing(true);
    try {
      const res = await fetch('/api/ai/crisis-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      });
      
      const data = await res.json();
      setCrisisPlan(data);
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.patientScript);
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-800 dark:text-slate-100">
          Beacon Recovery
        </h1>
        
        <Card className="border-2 border-indigo-100 dark:border-indigo-900 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">How are you feeling?</CardTitle>
            <CardDescription>
              Tap the button and speak freely. We are here to help.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-8">
            
            {!isListening && !isProcessing && (
              <Button 
                onClick={startListening}
                size="lg"
                className="w-48 h-48 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-transform hover:scale-105"
              >
                <div className="flex flex-col items-center">
                  <AlertCircle className="w-12 h-12 mb-2" />
                  <span className="text-xl font-bold">I Need Help</span>
                </div>
              </Button>
            )}

            {isListening && (
              <div className="flex flex-col items-center w-full space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25"></div>
                  <Button 
                    onClick={handleStop}
                    size="lg"
                    className="relative w-32 h-32 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg"
                  >
                    <Square className="w-8 h-8" />
                  </Button>
                </div>
                <div className="w-full p-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 min-h-[100px] text-center italic">
                  {transcript || "Listening..."}
                </div>
              </div>
            )}

            {isProcessing && <BreathPacer isVisible={true} />}

            {crisisPlan && !isProcessing && !isListening && (
              <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Card className="bg-indigo-50 border-indigo-200 dark:bg-indigo-950 dark:border-indigo-800">
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <Heart className="w-12 h-12 text-indigo-500" />
                    <p className="text-lg text-indigo-900 dark:text-indigo-100 font-medium">
                      {crisisPlan.patientScript}
                    </p>
                  </CardContent>
                </Card>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setCrisisPlan(null)}
                >
                  Start Over
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
