import { LogEvent } from '../types/chat';

export class Logger {
  private static formatLog(event: Omit<LogEvent, 'timestamp'>): LogEvent {
    return {
      ...event,
      timestamp: new Date().toISOString()
    };
  }

  static info(message: string, metadata?: Partial<LogEvent>): void {
    const logEvent = this.formatLog({
      level: 'info',
      message,
      ...metadata
    });
    console.log(JSON.stringify(logEvent));
  }

  static warn(message: string, metadata?: Partial<LogEvent>): void {
    const logEvent = this.formatLog({
      level: 'warn',
      message,
      ...metadata
    });
    console.warn(JSON.stringify(logEvent));
  }

  static error(message: string, error?: Error, metadata?: Partial<LogEvent>): void {
    const logEvent = this.formatLog({
      level: 'error',
      message,
      error: error?.message || error?.toString(),
      ...metadata
    });
    console.error(JSON.stringify(logEvent));
  }

  static requestStart(question: string, customerId?: string): number {
    this.info('Chat request started', { question, customerId });
    return Date.now();
  }

  static requestEnd(
    startTime: number, 
    source: string, 
    question: string, 
    customerId?: string
  ): void {
    const duration = Date.now() - startTime;
    this.info('Chat request completed', {
      question,
      source,
      duration,
      customerId
    });
  }
}