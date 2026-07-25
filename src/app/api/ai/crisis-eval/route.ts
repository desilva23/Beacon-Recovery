import { NextResponse } from 'next/server';
import { AIFactory } from '@/lib/ai';
import { globalStore } from '@/lib/store';

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const providerHeader = req.headers.get('x-ai-provider');
    const providerName = providerHeader === 'gemini' ? 'gemini' : 'groq';
    
    const provider = AIFactory.getProvider(providerName);
    const crisisPlan = await provider.evaluateCrisis(transcript);

    // Save to memory store for hackathon demo (Caregiver Dashboard connection)
    globalStore.latestCrisis = {
      ...crisisPlan,
      transcript,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(crisisPlan);
  } catch (error) {
    console.error('Crisis Eval Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
