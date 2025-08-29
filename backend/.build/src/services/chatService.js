"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
var llmService_1 = require("./llmService");
var logger_1 = require("../utils/logger");
var ChatService = /** @class */ (function () {
    function ChatService() {
    }
    ChatService.processQuestion = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var question, customerId, startTime, normalizedQuestion, tracking, response_1, ruleMatch, response_2, llmResponse, response_3, error_1, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        question = request.question, customerId = request.customerId;
                        startTime = logger_1.Logger.requestStart(question, customerId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        normalizedQuestion = this.normalizeText(question);
                        // Verificar si es consulta de estado de pedido
                        if (this.isOrderStatusQuery(normalizedQuestion) && customerId) {
                            tracking = this.getMockTracking();
                            response_1 = {
                                answer: "Tu pedido est\u00E1 ".concat(tracking.status.toLowerCase(), ". ETA: ").concat(tracking.eta, " con ").concat(tracking.carrier, "."),
                                source: 'rules',
                                timestamp: new Date().toISOString(),
                                tracking: tracking
                            };
                            logger_1.Logger.requestEnd(startTime, 'rules', question, customerId);
                            return [2 /*return*/, response_1];
                        }
                        ruleMatch = this.findRuleMatch(normalizedQuestion);
                        if (ruleMatch) {
                            response_2 = {
                                answer: ruleMatch,
                                source: 'rules',
                                timestamp: new Date().toISOString()
                            };
                            logger_1.Logger.requestEnd(startTime, 'rules', question, customerId);
                            return [2 /*return*/, response_2];
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, llmService_1.LLMService.getResponse(question)];
                    case 3:
                        llmResponse = _a.sent();
                        if (llmResponse) {
                            response_3 = {
                                answer: llmResponse,
                                source: 'llm',
                                timestamp: new Date().toISOString()
                            };
                            logger_1.Logger.requestEnd(startTime, 'llm', question, customerId);
                            return [2 /*return*/, response_3];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        logger_1.Logger.warn('LLM service failed, using default response', { error: error_1 === null || error_1 === void 0 ? void 0 : error_1.toString() });
                        return [3 /*break*/, 5];
                    case 5:
                        response = {
                            answer: this.DEFAULT_RESPONSE,
                            source: 'default',
                            timestamp: new Date().toISOString()
                        };
                        logger_1.Logger.requestEnd(startTime, 'default', question, customerId);
                        return [2 /*return*/, response];
                    case 6:
                        error_2 = _a.sent();
                        logger_1.Logger.error('Error processing question', error_2, { question: question, customerId: customerId });
                        throw error_2;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ChatService.normalizeText = function (text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''); // Remover acentos
    };
    ChatService.findRuleMatch = function (normalizedQuestion) {
        for (var _i = 0, _a = this.RULES; _i < _a.length; _i++) {
            var rule = _a[_i];
            for (var _b = 0, _c = rule.keywords; _b < _c.length; _b++) {
                var keyword = _c[_b];
                if (normalizedQuestion.includes(this.normalizeText(keyword))) {
                    return rule.response;
                }
            }
        }
        return null;
    };
    ChatService.isOrderStatusQuery = function (normalizedQuestion) {
        var _this = this;
        var statusKeywords = ['estado', 'pedido', 'order', 'status', 'seguimiento', 'tracking'];
        return statusKeywords.some(function (keyword) {
            return normalizedQuestion.includes(_this.normalizeText(keyword));
        });
    };
    ChatService.getMockTracking = function () {
        var statuses = ['EN_CAMINO', 'PROCESANDO', 'DESPACHADO', 'ENTREGADO'];
        var carriers = ['MockExpress', 'FastDelivery', 'QuickShip'];
        var etas = ['24h', '48h', '72h', '1-2 días'];
        return {
            status: statuses[Math.floor(Math.random() * statuses.length)],
            eta: etas[Math.floor(Math.random() * etas.length)],
            carrier: carriers[Math.floor(Math.random() * carriers.length)]
        };
    };
    ChatService.RULES = [
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
    ChatService.DEFAULT_RESPONSE = 'No tengo esa respuesta aún, ¿puedes reformular?';
    return ChatService;
}());
exports.ChatService = ChatService;
