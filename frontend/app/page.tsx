// app/page.tsx
'use client'

import Link from 'next/link'
import { MessageCircle, Zap, Shield, Clock, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Asistente Virtual
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              Inteligente
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Tu chatbot personal para resolver dudas sobre envíos, devoluciones, precios y estado de pedidos. 
            Respuestas instantáneas, 24/7, sin salir de la tienda.
          </p>
          
          <Link 
            href="/chat"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span>Comenzar a Chatear</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Respuestas Instantáneas
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Obtén respuestas inmediatas sobre envíos, devoluciones y precios sin esperar.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Información Confiable
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Respuestas basadas en políticas actualizadas y datos en tiempo real de tu tienda.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Disponible 24/7
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Asistencia disponible las 24 horas, los 7 días de la semana, cuando la necesites.
            </p>
          </div>
        </div>

        {/* What can I help you with section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            ¿En qué puedo ayudarte?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Información de Envíos</h4>
                  <p className="text-gray-600 text-sm">Tiempos de entrega, costos y métodos disponibles</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Política de Devoluciones</h4>
                  <p className="text-gray-600 text-sm">Condiciones, plazos y proceso de devolución</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Precios y Productos</h4>
                  <p className="text-gray-600 text-sm">Información actualizada sobre precios y disponibilidad</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Estado de Pedidos</h4>
                  <p className="text-gray-600 text-sm">Seguimiento en tiempo real de tus compras</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/chat"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Empezar Conversación</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p>&copy; 2024 Chatbot Full-Stack. Desarrollado con Next.js y TypeScript.</p>
        </div>
      </div>
    </div>
  )
}