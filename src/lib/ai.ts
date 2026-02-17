import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '@/config/env';

export const createAIClient = () => {
  if (!env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error('Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable');
  }
  return new GoogleGenerativeAI(env.GOOGLE_GENERATIVE_AI_API_KEY);
};

export const getGeminiModel = (model: string = 'gemini-pro') => {
  const ai = createAIClient();
  return ai.getGenerativeModel({ model });
};
