'use client';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mic, Square, AlertCircle, Heart, RotateCcw, Pencil } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { BreathPacer } from '@/components/coping/breath-pacer';
import type { CrisisPlan } from '@/lib/ai';

type Stage = 'idle' | 'listening' | 'editing' | 'correcting' | 'processing' | 'result';

export default function PatientDashboard() {
  const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechRecognition();
  const [stage, setStage] = useState<Stage>('idle');
  const [editableTranscript, setEditableTranscript] = useState('');
  const [crisisPlan, setCrisisPlan] = useState<CrisisPlan | null>(null);
  const [selectionInfo, setSelectionInfo] = useState<{ start: number; end: number } | null>(null);
  const [correctionListening, setCorrectionListening] = useState(false);
  const [correctionTranscript, setCorrectionTranscript] = useState('');
  const [caregiverMessage, setCaregiverMessage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const correctionRecRef = useRef<any>(null);

  // Poll for caregiver messages
  useEffect(() => {
    const checkCaregiverMessage = async () => {
      try {
        const res = await fetch('/api/caregiver/alerts');
        const data = await res.json();
        if (data.alert?.caregiverMessage) {
          setCaregiverMessage(data.alert.caregiverMessage);
        } else if (data.caregiverResponse?.message) {
          setCaregiverMessage(data.caregiverResponse.message);
        }
      } catch (e) {
        console.error(e);
      }
    };

    checkCaregiverMessage();
    const interval = setInterval(checkCaregiverMessage, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStop = () => {
    stopListening();
    setEditableTranscript(transcript.trim());
    setStage('editing');
  };

  const handleStartCorrection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start === end) {
      alert('Please select the text you want to re-record first.');
      return;
    }
    setSelectionInfo({ start, end });
    setCorrectionTranscript('');
    setCorrectionListening(true);
    setStage('correcting');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    correctionRecRef.current = rec;

    rec.onresult = (event: any) => {
      const corrected = event.results[0][0].transcript;
      setCorrectionTranscript(corrected);
    };

    rec.onend = () => {
      setCorrectionListening(false);
    };

    rec.start();
  };

  const applyCorrection = () => {
    if (!selectionInfo || !correctionTranscript) return;
    const before = editableTranscript.slice(0, selectionInfo.start);
    const after = editableTranscript.slice(selectionInfo.end);
    setEditableTranscript(before + correctionTranscript + after);
    setSelectionInfo(null);
    setCorrectionTranscript('');
    setStage('editing');
  };

  const handleReRecord = () => {
    setTranscript('');
    setEditableTranscript('');
    setCrisisPlan(null);
    setSelectionInfo(null);
    setStage('idle');
  };

  const handleSubmit = async () => {
    if (!editableTranscript.trim()) return;
    setStage('processing');
    try {
      const res = await fetch('/api/ai/crisis-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: editableTranscript }),
      });
      const data = await res.json();
      setCrisisPlan(data);
      setStage('result');
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.patientScript);
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error(error);
      setStage('editing');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100">Beacon Recovery</h1>

        <Card className="border-2 border-indigo-100 dark:border-indigo-900 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">How are you feeling?</CardTitle>
            <CardDescription>Tap the button and speak freely. We are here to help.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">

            {/* IDLE: Big SOS button */}
            {stage === 'idle' && (
              <Button
                onClick={() => { startListening(); setStage('listening'); }}
                size="lg"
                className="w-48 h-48 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-transform hover:scale-105"
              >
                <div className="flex flex-col items-center">
                  <AlertCircle className="w-12 h-12 mb-2" />
                  <span className="text-xl font-bold">I Need Help</span>
                </div>
              </Button>
            )}

            {/* LISTENING: pulsing mic */}
            {stage === 'listening' && (
              <div className="flex flex-col items-center w-full space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25" />
                  <Button
                    onClick={handleStop}
                    size="lg"
                    className="relative w-32 h-32 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg"
                  >
                    <Square className="w-8 h-8" />
                  </Button>
                </div>
                <div className="w-full p-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 min-h-[80px] text-center italic">
                  {transcript || 'Listening…'}
                </div>
              </div>
            )}

            {/* EDITING: editable transcript + controls */}
            {(stage === 'editing' || stage === 'correcting') && (
              <div className="w-full space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Pencil className="w-3.5 h-3.5" /> Edit or select text to fix</span>
                    <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">Editable</span>
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={editableTranscript}
                    onChange={e => setEditableTranscript(e.target.value)}
                    rows={5}
                    className="w-full p-4 rounded-lg border-2 border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 resize-none focus:outline-none focus:border-indigo-400 transition-colors"
                    placeholder="Your spoken words appear here…"
                  />
                </div>

                {/* Correction mode UI */}
                {stage === 'correcting' && (
                  <div className="p-4 rounded-lg border-2 border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 space-y-3">
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                      <Mic className="w-4 h-4 animate-pulse" />
                      {correctionListening ? 'Listening for correction…' : 'Correction captured:'}
                    </p>
                    {correctionTranscript && (
                      <p className="text-sm italic text-slate-700 dark:text-slate-300">"{correctionTranscript}"</p>
                    )}
                    <div className="flex gap-2">
                      {correctionTranscript && (
                        <Button size="sm" onClick={applyCorrection} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">
                          Apply Correction
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setStage('editing')}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {stage === 'editing' && (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="border-2 border-amber-400 text-amber-700 hover:bg-amber-50"
                      onClick={handleStartCorrection}
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Re-record Selection
                    </Button>
                    <Button
                      variant="outline"
                      className="border-2 border-slate-300"
                      onClick={handleReRecord}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Start Over
                    </Button>
                  </div>
                )}

                {stage === 'editing' && (
                  <Button onClick={handleSubmit} className="w-full h-12 text-base bg-indigo-600 hover:bg-indigo-700 text-white">
                    Submit for AI Support
                  </Button>
                )}
              </div>
            )}

            {/* PROCESSING: breath pacer */}
            {stage === 'processing' && <BreathPacer isVisible={true} />}

            {/* Caregiver Live Message Banner */}
            {caregiverMessage && (
              <Card className="w-full bg-emerald-50 border-2 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700 animate-in fade-in slide-in-from-top-2">
                <CardContent className="p-4 flex items-start space-x-3">
                  <span className="text-2xl">💌</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-1">
                      Message from your Caregiver
                    </p>
                    <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100 italic">
                      "{caregiverMessage}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* RESULT: AI response */}
            {stage === 'result' && crisisPlan && (
              <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Card className="bg-indigo-50 border-indigo-200 dark:bg-indigo-950 dark:border-indigo-800">
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <Heart className="w-12 h-12 text-indigo-500" />
                    <p className="text-lg text-indigo-900 dark:text-indigo-100 font-medium leading-relaxed">
                      {crisisPlan.patientScript}
                    </p>
                  </CardContent>
                </Card>

                {/* Next steps */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">What would you like to do next?</p>
                  <div className="grid grid-cols-2 gap-3">
                    <a href="/journal">
                      <Button variant="outline" className="w-full border-2 border-violet-300 text-violet-700 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-300">
                        📓 View My Journal
                      </Button>
                    </a>
                    <a href="/resources">
                      <Button variant="outline" className="w-full border-2 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300">
                        📚 Resources
                      </Button>
                    </a>
                  </div>
                  <a href="tel:18006624357" className="block">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                      📞 Call SAMHSA Helpline (Free, 24/7)
                    </Button>
                  </a>
                  <Button variant="outline" className="w-full text-slate-500" onClick={handleReRecord}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>
                </div>
              </div>
            )}


          </CardContent>
        </Card>

        {/* Hint text */}
        {stage === 'editing' && (
          <p className="text-center text-xs text-slate-400 dark:text-slate-600 px-4">
            💡 Tip: Select any misheard word in the text above, then tap "Re-record Selection" to fix it with your voice.
          </p>
        )}
      </div>
    </div>
  );
}
