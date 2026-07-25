import { NextResponse } from 'next/server';
import { AIFactory } from '@/lib/ai';
import { globalStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!transcript || !transcript.trim()) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const providerHeader = req.headers.get('x-ai-provider');
    const providerName = providerHeader === 'gemini' ? 'gemini' : 'groq';

    const provider = AIFactory.getProvider(providerName);
    const crisisPlan = await provider.evaluateCrisis(transcript);

    // Save to global memory store for caregiver dashboard real-time polling
    globalStore.latestCrisis = {
      ...crisisPlan,
      transcript,
      timestamp: new Date().toISOString()
    };

    // Persist to Supabase (non-blocking — best effort)
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase.from('interventions').insert({
          patient_id: user.id,
          raw_transcript: transcript,
          ai_severity_score: crisisPlan.severityLevel,
          ai_identified_trigger: crisisPlan.patientScript,
        });
      }
    } catch (dbErr) {
      // Swallow DB errors — core AI response must still reach the patient
      console.warn('DB write skipped:', dbErr);
    }

    return NextResponse.json(crisisPlan);
  } catch (error) {
    console.error('Crisis Eval Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
