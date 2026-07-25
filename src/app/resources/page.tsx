'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenCheck, Phone, Brain, Shield } from 'lucide-react';

const resources = [
  {
    icon: Phone,
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    title: 'SAMHSA Helpline',
    description: 'Free, confidential, 24/7 treatment referral service.',
    action: 'Call 1-800-662-4357',
    link: 'tel:18006624357',
  },
  {
    icon: Brain,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    border: 'border-indigo-200 dark:border-indigo-800',
    title: 'Understanding Cravings',
    description: 'Cravings typically last 15–30 minutes. Urge surfing — observing without acting — is a proven technique to ride them out.',
    action: 'Learn urge surfing',
    link: 'https://www.drugabuse.gov',
  },
  {
    icon: Shield,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    title: '5-4-3-2-1 Grounding',
    description: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. This grounds you in the present moment.',
    action: 'Practice now',
    link: '/grounding',
  },
  {
    icon: BookOpenCheck,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    title: 'Relapse Prevention Plan',
    description: 'Knowing your triggers, warning signs, and coping strategies in advance is the most effective way to prevent relapse.',
    action: 'Build your plan',
    link: 'https://www.na.org',
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="space-y-1">
          <div className="flex items-center space-x-3">
            <BookOpenCheck className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Educational Resources</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Evidence-based knowledge to support your recovery journey.</p>
        </header>

        <div className="space-y-4">
          {resources.map(r => (
            <Card key={r.title} className={`border-2 ${r.border} ${r.bg} hover:shadow-md transition-shadow`}>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-3">
                  <r.icon className={`w-7 h-7 ${r.color}`} />
                  <CardTitle className="text-lg">{r.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{r.description}</p>
                <a
                  href={r.link}
                  target={r.link.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`inline-flex items-center text-sm font-semibold ${r.color} hover:underline`}
                >
                  {r.action} →
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
