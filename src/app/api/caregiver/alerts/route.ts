import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function GET() {
  return NextResponse.json({ 
    alert: globalStore.latestCrisis,
    caregiverResponse: globalStore.caregiverResponse 
  });
}

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
      return NextResponse.json({ success: true, message: 'Alert marked as resolved' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
