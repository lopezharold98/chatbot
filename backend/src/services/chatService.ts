import { ChatRequest, ChatResponse, TrackingInfo } from '../types/chat';
import { LLMService } from './llmService';
import { Logger } from '../utils/logger';

export class ChatService {
  private static readonly RULES = [
    {
      keywords: ['envío', 'envio', 'entrega', 'shipping', 'delivery'],
      response: 'Los pedidos tardan 2–3 días hábiles a ciudades principales.'
    },
    {
      keywords: ['devolución', 'devolucion', 'return', 'devolver'],
      response: 'Tienes 30 días para devolver; aplica política de estado y factura.'
    },
    {
      keywords: ['precio', 'costo', 'cost', 'price', 'cuanto', 'cuánto'],
      response: 'Los precios se actualizan a diario; verifica la ficha del producto.'
    }
  ];

  private static readonly DEFAULT_RESPONSE = 'No tengo esa respuesta aún, ¿puedes reformular?';

  static async processQuestion(request: ChatRequest): Promise<ChatResponse> {
    const { question, customerId } = request;
    const startTime = Logger.requestStart(question, customerId);
    
    try {
      // Normalizar la pregunta (remover acentos y convertir a minúsculas)
      const normalizedQuestion = this.normalizeText(question);

      // Verificar si es consulta de estado de pedido
      if (this.isOrderStatusQuery(normalizedQuestion) && customerId) {
        const tracking = this.getMockTracking();
        const response: ChatResponse = {
          answer: `Tu pedido está ${tracking.status.toLowerCase()}. ETA: ${tracking.eta} con ${tracking.carrier}.`,
          source: 'rules',
          timestamp: new Date().toISOString(),
          tracking
        };
        Logger.requestEnd(startTime, 'rules', question, customerId);
        return response;
      }

      // Verificar reglas normales
      const ruleMatch = this.findRuleMatch(normalizedQuestion);
      if (ruleMatch) {
        const response: ChatResponse = {
          answer: ruleMatch,
          source: 'rules',
          timestamp: new Date().toISOString()
        };
        Logger.requestEnd(startTime, 'rules', question, customerId);
        return response;
      }

      // Intentar con LLM si está disponible
      try {
        const llmResponse = await LLMService.getResponse(question);
        if (llmResponse) {
          const response: ChatResponse = {
            answer: llmResponse,
            source: 'llm',
            timestamp: new Date().toISOString()
          };
          Logger.requestEnd(startTime, 'llm', question, customerId);
          return response;
        }
      } catch (error) {
        Logger.warn('LLM service failed, using default response', { error: error?.toString() });
      }

      // Respuesta por defecto
      const response: ChatResponse = {
        answer: this.DEFAULT_RESPONSE,
        source: 'default',
        timestamp: new Date().toISOString()
      };
      Logger.requestEnd(startTime, 'default', question, customerId);
      return response;

    } catch (error) {
      Logger.error('Error processing question', error as Error, { question, customerId });
      throw error;
    }
  }

  private static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remover acentos
  }

  private static findRuleMatch(normalizedQuestion: string): string | null {
    for (const rule of this.RULES) {
      for (const keyword of rule.keywords) {
        if (normalizedQuestion.includes(this.normalizeText(keyword))) {
          return rule.response;
        }
      }
    }
    return null;
  }

  private static isOrderStatusQuery(normalizedQuestion: string): boolean {
    const statusKeywords = ['estado', 'pedido', 'order', 'status', 'seguimiento', 'tracking'];
    return statusKeywords.some(keyword => 
      normalizedQuestion.includes(this.normalizeText(keyword))
    );
  }

  private static getMockTracking(): TrackingInfo {
    const statuses = ['EN_CAMINO', 'PROCESANDO', 'DESPACHADO', 'ENTREGADO'];
    const carriers = ['MockExpress', 'FastDelivery', 'QuickShip'];
    const etas = ['24h', '48h', '72h', '1-2 días'];

    return {
      status: statuses[Math.floor(Math.random() * statuses.length)],
      eta: etas[Math.floor(Math.random() * etas.length)],
      carrier: carriers[Math.floor(Math.random() * carriers.length)]
    };
  }
}