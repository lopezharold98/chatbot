import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MessageCircle, Package, Clock } from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  tracking?: {
    status: string;
    eta: string;
    carrier: string;
  };
  source?: 'rules' | 'llm' | 'default';
}

interface ChatRequest {
  question: string;
  customerId?: string;
}

interface ChatResponse {
  answer: string;
  source: 'rules' | 'llm' | 'default';
  timestamp: string;
  tracking?: {
    status: string;
    eta: string;
    carrier: string;
  };
}

interface ApiError {
  error: string;
  timestamp: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: '¡Hola! Soy tu asistente virtual. Puedo ayudarte con preguntas sobre envíos, devoluciones, precios y estado de pedidos. ¿En qué puedo ayudarte?',
      sender: 'bot',
      timestamp: new Date().toISOString(),
      source: 'rules'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const requestData: ChatRequest = {
        question: inputValue.trim(),
        ...(customerId.trim() && { customerId: customerId.trim() })
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dev/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log("response en el front",response)

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.answer,
        sender: 'bot',
        timestamp: data.timestamp,
        tracking: data.tracking,
        source: data.source
      };

      setMessages(prev => [...prev, botMessage]);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión';
      setError(errorMessage);
      
      const errorBotMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `Lo siento, ocurrió un error: ${errorMessage}. Por favor, intenta nuevamente.`,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        source: 'default'
      };
      
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const getSourceBadge = (source?: string) => {
    if (!source) return null;
    
    const colors = {
      rules: 'bg-green-100 text-green-800',
      llm: 'bg-blue-100 text-blue-800',
      default: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      rules: 'Reglas',
      llm: 'IA',
      default: 'Por defecto'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[source as keyof typeof colors] || colors.default}`}>
        {labels[source as keyof typeof labels] || source}
      </span>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">
              Asistente Virtual
            </h1>
            <p className="text-sm text-gray-500">
              Ayuda con envíos, devoluciones, precios y pedidos
            </p>
          </div>
        </div>
        
        {/* Customer ID Input */}
        <div className="mt-4">
          <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-1">
            ID de Cliente (opcional, para consultar pedidos):
          </label>
          <input
            id="customerId"
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="Ej: 12345"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md xl:max-w-lg`}>
              {message.sender === 'bot' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-white text-gray-800 shadow-md border border-gray-100'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                
                {/* Tracking Info */}
                {message.tracking && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Package className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-sm text-gray-900">
                        Información de Envío
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Estado:</span>
                        <span className="font-medium">{message.tracking.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ETA:</span>
                        <span className="font-medium">{message.tracking.eta}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transportadora:</span>
                        <span className="font-medium">{message.tracking.carrier}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-2 space-x-2">
                  <span className="text-xs opacity-70">
                    {formatTimestamp(message.timestamp)}
                  </span>
                  {message.sender === 'bot' && getSourceBadge(message.source)}
                </div>
              </div>
              
              {message.sender === 'user' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-100">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span className="text-sm text-gray-500">Escribiendo...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mb-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            <span className="font-medium">Error:</span> {error}
          </p>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Escribe tu pregunta aquí..."
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              maxLength={500}
            />
            <div className="flex justify-between mt-1 px-2">
              <span className="text-xs text-gray-500">
                Presiona Enter para enviar
              </span>
              <span className="text-xs text-gray-400">
                {inputValue.length}/500
              </span>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isLoading}
            className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full p-3 transition-all duration-200 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}