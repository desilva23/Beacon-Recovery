'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartPulse, ShieldCheck, BookOpen, BookOpenCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Role = 'patient' | 'caregiver' | null;

export default function LandingPage() {
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setRole(user.user_metadata?.role ?? 'patient');
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-10 text-center">

        <div className="space-y-3">
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Beacon <span className="text-indigo-600 dark:text-indigo-400">Recovery</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {role === 'patient'
              ? 'Welcome back. Your support tools are ready.'
              : role === 'caregiver'
              ? 'Welcome back. Monitor and support your loved one.'
              : 'A GenAI-powered crisis intervention platform for recovery support.'}
          </p>
          {!role && (
            <div className="flex items-center justify-center gap-4 pt-2">
              <Link href="/login">
                <Button size="lg" className="px-8">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="px-8">Create Account</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Patient view */}
        {role === 'patient' && (
          <div className="grid md:grid-cols-3 gap-5">
            <Card className="border-2 border-indigo-100 hover:border-indigo-300 dark:border-indigo-900 dark:hover:border-indigo-700 transition-all shadow-md hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-2">
                  <HeartPulse className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle className="text-lg">Patient Portal</CardTitle>
                <CardDescription>Voice SOS with AI de-escalation & speech synthesis</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/patient" className="w-full block">
                  <Button className="w-full" size="sm">Enter Portal</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-violet-100 hover:border-violet-300 dark:border-violet-900 dark:hover:border-violet-700 transition-all shadow-md hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="mx-auto bg-violet-100 dark:bg-violet-900/50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-2">
                  <BookOpen className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                </div>
                <CardTitle className="text-lg">Urge Journal</CardTitle>
                <CardDescription>Track past interventions and identify trigger patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/journal" className="w-full block">
                  <Button variant="outline" className="w-full border-2" size="sm">View Journal</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-100 hover:border-amber-300 dark:border-amber-900 dark:hover:border-amber-700 transition-all shadow-md hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="mx-auto bg-amber-100 dark:bg-amber-900/50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-2">
                  <BookOpenCheck className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-lg">Resources</CardTitle>
                <CardDescription>SAMHSA hotlines, grounding techniques & relapse prevention</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/resources" className="w-full block">
                  <Button variant="outline" className="w-full border-2" size="sm">Explore</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Caregiver view */}
        {role === 'caregiver' && (
          <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            <Card className="border-2 border-emerald-100 hover:border-emerald-300 dark:border-emerald-900 dark:hover:border-emerald-700 transition-all shadow-md hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="mx-auto bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-lg">Caregiver Dashboard</CardTitle>
                <CardDescription>Live alerts with AI-generated contextual action plans</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/caregiver" className="w-full block">
                  <Button variant="outline" className="w-full border-2" size="sm">Open Dashboard</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-100 hover:border-amber-300 dark:border-amber-900 dark:hover:border-amber-700 transition-all shadow-md hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="mx-auto bg-amber-100 dark:bg-amber-900/50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-2">
                  <BookOpenCheck className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-lg">Resources</CardTitle>
                <CardDescription>SAMHSA hotlines, grounding techniques & caregiver support</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/resources" className="w-full block">
                  <Button variant="outline" className="w-full border-2" size="sm">Explore</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Not logged in — show all cards */}
        {!role && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="border-2 border-indigo-100 hover:border-indigo-300 dark:border-indigo-900 transition-all shadow-md hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-2">
                  <HeartPulse className="w-7 h-7 text-indigo-600" />
                </div>
                <CardTitle className="text-lg">Patient Portal</CardTitle>
                <CardDescription>Voice SOS with AI de-escalation</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/login"><Button className="w-full" size="sm">Sign In</Button></Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-emerald-100 hover:border-emerald-300 dark:border-emerald-900 transition-all shadow-md hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="mx-auto bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-7 h-7 text-emerald-600" />
                </div>
                <CardTitle className="text-lg">Caregiver Dashboard</CardTitle>
                <CardDescription>Live alerts with AI action plans</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/login"><Button variant="outline" className="w-full border-2" size="sm">Sign In</Button></Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-violet-100 hover:border-violet-300 dark:border-violet-900 transition-all shadow-md hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="mx-auto bg-violet-100 dark:bg-violet-900/50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-2">
                  <BookOpen className="w-7 h-7 text-violet-600" />
                </div>
                <CardTitle className="text-lg">Urge Journal</CardTitle>
                <CardDescription>Track past crisis interventions</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/login"><Button variant="outline" className="w-full border-2" size="sm">Sign In</Button></Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-100 hover:border-amber-300 dark:border-amber-900 transition-all shadow-md hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="mx-auto bg-amber-100 dark:bg-amber-900/50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-2">
                  <BookOpenCheck className="w-7 h-7 text-amber-600" />
                </div>
                <CardTitle className="text-lg">Resources</CardTitle>
                <CardDescription>SAMHSA hotlines & grounding tools</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/resources"><Button variant="outline" className="w-full border-2" size="sm">Explore</Button></Link>
              </CardContent>
            </Card>
          </div>
        )}

        <p className="text-xs text-slate-400 dark:text-slate-600 pt-2">
          Powered by GroqCloud LLaMA 3.3 · Web Speech API · Next.js 15 · Supabase
        </p>
      </div>
    </div>
  );
}
