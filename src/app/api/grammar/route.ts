import { createOllama } from 'ollama-ai-provider';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

const ollama = createOllama({
  baseURL: 'http://localhost:11434',
});

export async function POST(req: Request) {
  const { sentence, provider } = await req.json();
  
  let model;
  switch (provider) {
    case 'ollama':
      model = ollama('llama2');
      break;
    case 'openai':
      model = openai('gpt-3.5-turbo');
      break;
    case 'anthropic':
      model = anthropic('claude-3-sonnet-20240229');
      break;
    default:
      throw new Error('Invalid provider');
  }

  const result = await generateText({
    model,
    prompt: `Please correct the grammar in the following sentence: "${sentence}"
             Provide only the corrected sentence without any additional explanation.`,
  });

  return new Response(JSON.stringify({ correctedSentence: result.text }), {
    headers: { 'Content-Type': 'application/json' },
  });
}