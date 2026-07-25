import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartPulse, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full space-y-12 text-center">
        
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Beacon <span className="text-indigo-600 dark:text-indigo-400">Recovery</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A GenAI-powered crisis intervention platform offering zero-typing support for patients and real-time contextual guidance for caregivers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Patient Portal Card */}
          <Card className="border-2 border-indigo-100 hover:border-indigo-300 dark:border-indigo-900 dark:hover:border-indigo-700 transition-colors shadow-lg hover:shadow-xl">
            <CardHeader>
              <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                <HeartPulse className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle className="text-2xl">Patient Portal</CardTitle>
              <CardDescription className="text-base mt-2">
                Experiencing a craving or emotional trigger? Access our zero-typing voice SOS for immediate grounding and support.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/patient" className="w-full block">
                <Button className="w-full text-lg h-12" size="lg">
                  Enter Patient Portal
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Caregiver Portal Card */}
          <Card className="border-2 border-emerald-100 hover:border-emerald-300 dark:border-emerald-900 dark:hover:border-emerald-700 transition-colors shadow-lg hover:shadow-xl">
            <CardHeader>
              <div className="mx-auto bg-emerald-100 dark:bg-emerald-900/50 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                <ShieldCheck className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="text-2xl">Caregiver Dashboard</CardTitle>
              <CardDescription className="text-base mt-2">
                Monitor your loved one's status in real-time and receive AI-generated contextual action plans during a crisis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/caregiver" className="w-full block">
                <Button variant="outline" className="w-full text-lg h-12 border-2" size="lg">
                  Access Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
