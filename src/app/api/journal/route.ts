import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/** Columns fetched for journal entries — avoids over-fetching with SELECT * */
const JOURNAL_COLUMNS = 'id, created_at, raw_transcript, ai_severity_score, ai_identified_trigger' as const;

/**
 * GET /api/journal
 * Retrieves patient's historical crisis interventions from Supabase.
 * Enforces RLS — returns only user's authenticated records.
 * Only selects required columns for efficiency.
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('interventions')
    .select(JOURNAL_COLUMNS)
    .eq('patient_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    { entries: data },
    {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    }
  );
}

/**
 * POST /api/journal
 * Manually inserts a journal entry into Supabase.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { transcript?: string; severityLevel?: string; patientScript?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.transcript?.trim()) {
    return NextResponse.json({ error: 'transcript is required' }, { status: 400 });
  }

  const { error } = await supabase.from('interventions').insert({
    patient_id: user.id,
    raw_transcript: body.transcript,
    ai_severity_score: body.severityLevel,
    ai_identified_trigger: body.patientScript,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 201 });
}
