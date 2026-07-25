import { NextResponse } from 'next/server';
import { globalStore, type CrisisAlert } from '@/lib/store';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/** Columns needed for the caregiver dashboard — avoids SELECT * */
const ALERT_COLUMNS =
  'id, created_at, raw_transcript, ai_severity_score, ai_identified_trigger' as const;

/**
 * GET /api/caregiver/alerts
 * Returns the current active crisis alert from in-memory store,
 * falling back to the latest DB record when store is empty.
 */
export async function GET() {
  let alert = globalStore.latestCrisis;

  if (!alert) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from('interventions')
        .select(ALERT_COLUMNS)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        const dbAlert: CrisisAlert = {
          severityLevel: (data.ai_severity_score as CrisisAlert['severityLevel']) ?? 'medium',
          transcript: data.raw_transcript ?? '',
          patientScript: data.ai_identified_trigger ?? '',
          caregiverAdvice:
            'Provide calm, non-judgmental support. Encourage grounding techniques and check in regularly.',
          timestamp: data.created_at,
        };
        alert = dbAlert;
      }
    } catch {
      // Ignore DB errors in GET fallback — alert simply stays null
    }
  }

  return NextResponse.json(
    {
      alert: alert?.resolved ? null : alert,
      caregiverResponse: globalStore.caregiverResponse,
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
 * Handles caregiver responses, patient acknowledgments, and alert resolution.
 */
export async function POST(req: Request) {
  let body: { action?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { action, message } = body;

  switch (action) {
    case 'send_message': {
      if (!message?.trim()) {
        return NextResponse.json({ error: 'message is required' }, { status: 400 });
      }
      const ts = new Date().toISOString();
      globalStore.caregiverResponse = { message, timestamp: ts };
      if (globalStore.latestCrisis) {
        globalStore.latestCrisis.caregiverAcknowledged = true;
        globalStore.latestCrisis.caregiverMessage = message;
      }
      return NextResponse.json({ success: true, message: 'Message sent to patient' });
    }

    case 'patient_ack': {
      if (globalStore.latestCrisis) globalStore.latestCrisis.patientSafeAck = true;
      if (globalStore.caregiverResponse) globalStore.caregiverResponse.patientSafeAck = true;
      return NextResponse.json({ success: true, message: 'Patient safe acknowledgment received' });
    }

    case 'resolve': {
      globalStore.latestCrisis = null;
      globalStore.caregiverResponse = null;
      return NextResponse.json({ success: true, message: 'Alert marked as resolved' });
    }

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}
