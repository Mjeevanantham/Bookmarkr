import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '@/config/env';

export const createAIClient = () => {
  const apiKey = env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable');
  }
  return new GoogleGenerativeAI(apiKey);
};

export const getGeminiModel = (model: string = 'gemini-pro') => {
  const ai = createAIClient();
  return ai.getGenerativeModel({ model });
};
