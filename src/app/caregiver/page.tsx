'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function CaregiverDashboard() {
  const [alert, setAlert] = useState<any>(null);

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Caregiver Dashboard</h1>
          <p className="text-slate-500">Monitoring patient status</p>
        </header>

        {!alert && (
          <Card className="border-dashed border-2 bg-transparent shadow-none">
            <CardContent className="flex flex-col items-center justify-center p-12 text-slate-400">
              <CheckCircle2 className="w-16 h-16 mb-4 text-emerald-500 opacity-50" />
              <p className="text-lg">No active alerts. The patient is currently stable.</p>
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
                <div className="flex items-center space-x-3">
                  <AlertCircle className={`w-8 h-8 ${
                    alert.severityLevel === 'high' ? 'text-red-500' : 
                    alert.severityLevel === 'medium' ? 'text-amber-500' : 
                    'text-blue-500'
                  }`} />
                  <div>
                    <CardTitle className="text-xl capitalize">{alert.severityLevel} Priority Alert</CardTitle>
                    <CardDescription className="flex items-center space-x-1 mt-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Patient Audio Context:</h3>
                  <div className="p-4 bg-white/50 dark:bg-black/20 rounded-md italic border-l-4 border-slate-300">
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
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
