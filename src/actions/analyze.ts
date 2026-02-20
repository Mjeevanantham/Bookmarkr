'use server';

import { env } from '@/config/env';
import { getGeminiModel } from '@/lib/ai';

interface AnalysisResult {
  description?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  status?: 'saved' | 'reading' | 'completed';
}

export async function analyzeBookmark(
  url: string,
  title?: string,
): Promise<AnalysisResult | null> {
  if (!env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.warn('AI Analysis skipped: Missing API Key');
    return null;
  }

  try {
    const model = getGeminiModel();
    const prompt = `
      Analyze this bookmark.
      URL: ${url}
      Title: ${title || 'Unknown'}

      Output a JSON object with:
      - description: A short summary (max 100 chars).
      - tags: Array of 3-5 keywords (lowercase).
      - priority: "low", "medium", or "high" based on importance.
      - status: "saved", "reading", or "completed".

      Return ONLY raw JSON, no markdown formatting.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up potential markdown code blocks
    const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();

    const data = JSON.parse(jsonString);

    return {
      description: data.description,
      tags: data.tags,
      priority: ['low', 'medium', 'high'].includes(data.priority)
        ? data.priority
        : 'medium',
      status: ['saved', 'reading', 'completed'].includes(data.status)
        ? data.status
        : 'saved',
    };
  } catch (error) {
    console.error('AI Analysis failed:', error);
    return null;
  }
}
