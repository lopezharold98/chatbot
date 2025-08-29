import OpenAI from 'openai';
import { Logger } from '../utils/logger';

export class LLMService {
  private static openai: OpenAI | null = null;
  private static readonly TIMEOUT_MS = 10000; 
  private static readonly MAX_TOKENS = 150;

  private static initializeClient(): void {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      Logger.warn('OpenAI API key not configured, LLM service unavailable');
      return;
    }

    this.openai = new OpenAI({
      apiKey,
      timeout: this.TIMEOUT_MS
    });
  }

  static async getResponse(question: string): Promise<string | null> {
    if (!this.openai) {
      this.initializeClient();
    }

    if (!this.openai) {
      Logger.warn('LLM service not available');
      return null;
    }

    try {
      Logger.info('Calling LLM service', { question });
      
      const completion = await Promise.race([
        this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Eres un asistente de atención al cliente de una tienda online. 
              Responde de manera breve, útil y amigable a preguntas sobre productos, 
              envíos, devoluciones, precios y servicios. Máximo 2 oraciones.
              Si no tienes información específica, sugiere contactar soporte.`
            },
            {
              role: 'user',
              content: question
            }
          ],
          max_tokens: this.MAX_TOKENS,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.5,
          presence_penalty: 0.3
        }),
        this.createTimeoutPromise()
      ]);

      const response = completion.choices[0]?.message?.content?.trim();
      
      if (response) {
        Logger.info('LLM response received', { 
          question, 
          responseLength: response.length 
        });
        return response;
      } else {
        Logger.warn('Empty response from LLM', { question });
        return null;
      }

    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          Logger.error('LLM request timeout', error, { question });
        } else if (error.message.includes('rate_limit')) {
          Logger.error('LLM rate limit exceeded', error, { question });
        } else {
          Logger.error('LLM service error', error, { question });
        }
      }
      return null;
    }
  }

  private static createTimeoutPromise(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('LLM request timeout'));
      }, this.TIMEOUT_MS);
    });
  }

  static isAvailable(): boolean {
    return !!process.env.OPENAI_API_KEY;
  }
}