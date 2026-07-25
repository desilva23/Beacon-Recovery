'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface JournalEntry {
  id: string;
  raw_transcript: string;
  ai_severity_score: string;
  ai_identified_trigger: string;
  created_at: string;
}

const severityColor = (level: string) => {
  if (level === 'high') return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800';
  if (level === 'medium') return 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800';
  return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800';
};

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/journal')
      .then(r => r.json())
      .then(d => setEntries(d.entries || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="space-y-1">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Urge Journal</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Your personal record of crisis interventions and recovery moments.</p>
        </header>

        {loading && (
          <div className="text-center py-16 text-slate-400">Loading your journal...</div>
        )}

        {!loading && entries.length === 0 && (
          <Card className="border-dashed border-2 bg-transparent shadow-none">
            <CardContent className="flex flex-col items-center justify-center p-16 text-slate-400 text-center">
              <BookOpen className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">No journal entries yet. Use the Patient Portal to start your record.</p>
            </CardContent>
          </Card>
        )}

        {!loading && entries.map(entry => (
          <Card
            key={entry.id}
            className={`border-2 transition-shadow hover:shadow-md cursor-pointer ${severityColor(entry.ai_severity_score)}`}
            onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <div>
                    <CardTitle className="text-base capitalize">{entry.ai_severity_score || 'low'} Severity Event</CardTitle>
                    <div className="flex items-center space-x-1 text-xs opacity-70 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(entry.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                {expanded === entry.id ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
              </div>
            </CardHeader>
            {expanded === entry.id && (
              <CardContent className="space-y-3 pt-0">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">What you said</p>
                  <p className="text-sm italic">"{entry.raw_transcript}"</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">AI Response Given</p>
                  <p className="text-sm">{entry.ai_identified_trigger}</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
