import { NextResponse } from 'next/server';
import { AIFactory } from '@/lib/ai';
import { globalStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/ai/crisis-eval
 * Evaluates patient spoken audio transcript using AI engine (Groq).
 * Returns de-escalation script, caregiver advice, and severity level.
 * Automatically persists to Supabase DB and notifies live Caregiver Dashboard.
 */
export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!transcript || !transcript.trim()) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const provider = AIFactory.getProvider();
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

    return NextResponse.json(crisisPlan, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Crisis Eval Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
