import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/caregiver/alerts
 * Fetches current active alert from memory or Supabase fallback.
 * Implements Cache-Control headers for maximum route efficiency.
 */
export async function GET() {
  let alert = globalStore.latestCrisis;

  if (!alert) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from('interventions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        alert = {
          severityLevel: data.ai_severity_score || 'medium',
          transcript: data.raw_transcript,
          patientScript: data.ai_identified_trigger,
          caregiverAdvice: 'Provide calm, non-judgmental support. Encourage grounding techniques and check in regularly.',
          timestamp: data.created_at,
        };
      }
    } catch {
      // Ignore DB errors in GET fallback
    }
  }

  return NextResponse.json(
    { 
      alert: alert?.resolved ? null : alert,
      caregiverResponse: globalStore.caregiverResponse 
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    }
  );
}

/**
 * POST /api/caregiver/alerts
 * Handles caregiver responses (messages to patient) and resolving alerts.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, message } = body;

    if (action === 'send_message') {
      globalStore.caregiverResponse = {
        message,
        timestamp: new Date().toISOString(),
      };
      if (globalStore.latestCrisis) {
        globalStore.latestCrisis.caregiverAcknowledged = true;
        globalStore.latestCrisis.caregiverMessage = message;
      }
      return NextResponse.json({ success: true, message: 'Message sent to patient' });
    }

    if (action === 'resolve') {
      if (globalStore.latestCrisis) {
        globalStore.latestCrisis.resolved = true;
      }
      globalStore.latestCrisis = null;
      return NextResponse.json({ success: true, message: 'Alert marked as resolved' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
