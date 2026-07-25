'use client';
import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Clock, Send, Heart, ShieldCheck, MessageSquare, Volume2, Mic, MicOff } from 'lucide-react';

const quickMessages = [
  "I'm on my way to be with you right now.",
  "You are strong and you can get through this. I'm here for you.",
  "Take deep breaths. Call me as soon as you see this.",
  "I love you and I'm proud of how hard you are trying.",
];

export default function CaregiverDashboard() {
  const [alert, setAlert] = useState<any>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentStatus, setSentStatus] = useState<string | null>(null);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const voiceRecRef = useRef<any>(null);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    voiceRecRef.current = rec;

    rec.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript;
      setCustomMessage(spoken);
    };
    rec.onend = () => setIsVoiceRecording(false);
    rec.onerror = () => setIsVoiceRecording(false);

    rec.start();
    setIsVoiceRecording(true);
  };

  const stopVoiceInput = () => {
    voiceRecRef.current?.stop();
    setIsVoiceRecording(false);
  };


  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('/api/caregiver/alerts');
        const data = await res.json();
        setAlert(data.alert);
      } catch (e) {
        console.error(e);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (msgToSend?: string) => {
    const message = msgToSend || customMessage;
    if (!message.trim()) return;

    setSending(true);
    try {
      const res = await fetch('/api/caregiver/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_message', message }),
      });
      if (res.ok) {
        setSentStatus('Encouragement sent to patient!');
        setCustomMessage('');
        setTimeout(() => setSentStatus(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const handleResolve = async () => {
    try {
      await fetch('/api/caregiver/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resolve' }),
      });
      setAlert(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
              Caregiver Dashboard
            </h1>
            <p className="text-slate-500">Real-time patient monitoring & intervention hub</p>
          </div>
        </header>

        {sentStatus && (
          <div className="p-4 rounded-lg bg-emerald-50 border-2 border-emerald-200 text-emerald-800 font-medium flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{sentStatus}</span>
          </div>
        )}

        {!alert && (
          <Card className="border-dashed border-2 bg-transparent shadow-none">
            <CardContent className="flex flex-col items-center justify-center p-16 text-slate-400 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 opacity-50" />
              <p className="text-xl font-medium text-slate-700 dark:text-slate-300">No active alerts</p>
              <p className="text-sm">The patient is currently stable. Standing by for real-time notifications.</p>
            </CardContent>
          </Card>
        )}

        {alert && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
            <Card className={`border-2 shadow-lg ${
              alert.severityLevel === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : 
              alert.severityLevel === 'medium' ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20' : 
              'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className={`w-8 h-8 ${
                      alert.severityLevel === 'high' ? 'text-red-500' : 
                      alert.severityLevel === 'medium' ? 'text-amber-500' : 
                      'text-blue-500'
                    }`} />
                    <div>
                      <CardTitle className="text-xl capitalize flex items-center gap-2">
                        {alert.severityLevel} Priority Alert
                        {alert.caregiverAcknowledged && (
                          <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-normal">
                            Acknowledged
                          </span>
                        )}
                        {alert.patientSafeAck && (
                          <span className="text-xs bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                            <Heart className="w-3 h-3 fill-pink-500 text-pink-500" /> Patient Confirmed Safe
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-1 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleResolve}>
                    Mark Resolved
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-300">Patient Audio Context:</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => speakText(alert.transcript)}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                    >
                      <Volume2 className="w-3.5 h-3.5 mr-1" /> Listen to Audio
                    </Button>
                  </div>
                  <div className="p-4 bg-white/60 dark:bg-black/20 rounded-md italic border-l-4 border-indigo-400">
                    "{alert.transcript}"
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">AI Caregiver Action Plan:</h3>
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-md shadow-sm">
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {alert.caregiverAdvice}
                    </p>
                  </div>
                </div>

                {/* Send Support Back to Patient */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                    Send Encouragement to Patient
                  </h3>

                  {/* Quick message chips */}
                  <div className="flex flex-wrap gap-2">
                    {quickMessages.map((msg, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendMessage(msg)}
                        className="text-xs bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 border border-slate-300 dark:border-slate-600 px-3 py-1.5 rounded-full text-slate-700 dark:text-slate-300 transition-colors text-left"
                      >
                        "{msg}"
                      </button>
                    ))}
                  </div>

                  {/* Custom message input with voice option */}
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customMessage}
                        onChange={e => setCustomMessage(e.target.value)}
                        placeholder={isVoiceRecording ? 'Listening for caregiver voice…' : 'Type or speak a custom message…'}
                        className="flex-1 px-4 py-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                        onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                        readOnly={isVoiceRecording}
                      />
                      {/* Voice Mic Button */}
                      <button
                        type="button"
                        onClick={isVoiceRecording ? stopVoiceInput : startVoiceInput}
                        className={`flex items-center justify-center w-10 h-10 rounded-lg border-2 transition-colors shrink-0 ${
                          isVoiceRecording
                            ? 'border-red-400 bg-red-50 text-red-600 animate-pulse dark:bg-red-950/30'
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 hover:text-indigo-600'
                        }`}
                        title={isVoiceRecording ? 'Stop recording' : 'Speak your encouragement'}
                      >
                        {isVoiceRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>
                      <Button
                        onClick={() => handleSendMessage()}
                        disabled={sending || !customMessage.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
                      {isVoiceRecording ? '🎤 Recording voice encouragement…' : 'Type your message or tap 🎤 to speak it'}
                    </p>
                  </div>
                </div>
              </CardContent>

            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
