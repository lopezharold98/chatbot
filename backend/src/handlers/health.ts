import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { HealthResponse } from '../types/chat';
import { Logger } from '../utils/logger';
import { LLMService } from '../services/llmService';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,OPTIONS'
  };

  // Manejar preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    Logger.info('Health check requested');

    // Verificar servicios disponibles
    const llmAvailable = LLMService.isAvailable();
    
    const response: HealthResponse = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };

    // Agregar información adicional sobre servicios
    const extendedResponse = {
      ...response,
      services: {
        llm: llmAvailable ? 'available' : 'unavailable',
        rules: 'available'
      },
      environment: process.env.NODE_ENV || 'development'
    };

    Logger.info('Health check completed', { 
      status: 'ok', 
      llmAvailable 
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(extendedResponse)
    };

  } catch (error) {
    Logger.error('Health check failed', error as Error);
    
    const errorResponse: HealthResponse = {
      status: 'error',
      timestamp: new Date().toISOString()
    };

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(errorResponse)
    };
  }
};