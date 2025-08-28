// handlers/chat.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ChatService } from '../services/chatService';
import { ChatRequest, ErrorResponse } from '../types/chat';
import { Logger } from '../utils/logger';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // Headers CORS
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
  };

  // Manejar preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    const errorResponse: ErrorResponse = {
      error: 'Method not allowed',
      timestamp: new Date().toISOString()
    };
    
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify(errorResponse)
    };
  }

  try {
    // Validar que existe body
    if (!event.body) {
      Logger.warn('Request received without body');
      const errorResponse: ErrorResponse = {
        error: 'Request body is required',
        timestamp: new Date().toISOString()
      };

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify(errorResponse)
      };
    }

    // Parsear JSON
    let requestData: ChatRequest;
    try {
      requestData = JSON.parse(event.body);
    } catch (parseError) {
      Logger.error('Invalid JSON in request body', parseError as Error);
      const errorResponse: ErrorResponse = {
        error: 'Invalid JSON format',
        timestamp: new Date().toISOString()
      };

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify(errorResponse)
      };
    }

    // Validar campo question
    if (!requestData.question || requestData.question.trim() === '') {
      Logger.warn('Request received without question field', { 
        customerId: requestData.customerId 
      });
      
      const errorResponse: ErrorResponse = {
        error: 'question is required',
        timestamp: new Date().toISOString()
      };

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify(errorResponse)
      };
    }

    // Validar longitud de la pregunta
    if (requestData.question.length > 500) {
      Logger.warn('Question too long', { 
        questionLength: requestData.question.length,
        customerId: requestData.customerId 
      });
      
      const errorResponse: ErrorResponse = {
        error: 'Question too long (max 500 characters)',
        timestamp: new Date().toISOString()
      };

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify(errorResponse)
      };
    }

    // Procesar la pregunta
    const response = await ChatService.processQuestion({
      question: requestData.question.trim(),
      customerId: requestData.customerId?.trim()
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    Logger.error('Unhandled error in chat handler', error as Error);
    
    const errorResponse: ErrorResponse = {
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    };

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(errorResponse)
    };
  }
};