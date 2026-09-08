import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { applicantData, result } = body;

    // Token saving prompt
    const prompt = `Applicant: ${applicantData.academic_score}%, Income ${applicantData.income_annual}, Credit ${applicantData.credit_score}. System: ${result.verdict}. Reason: ${result.triggered_rules?.join('; ') || 'N/A'}. Task: Write ONE short executive verdict sentence.`;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2', // Update model name if you have a different one installed in ollama (e.g. 'mistral', 'phi3')
        prompt: prompt,
        stream: false,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Ollama API error' }, { status: response.status });
    }

    const verdict = data.response || 'Verdict generated.';
    return NextResponse.json({ verdict });
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
