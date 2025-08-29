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
exports.handler = void 0;
var chatService_1 = require("../services/chatService");
var logger_1 = require("../utils/logger");
var handler = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var headers, errorResponse, errorResponse, requestData, errorResponse, errorResponse, errorResponse, response, error_1, errorResponse;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                headers = {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
                };
                // Manejar preflight CORS
                if (event.httpMethod === 'OPTIONS') {
                    return [2 /*return*/, {
                            statusCode: 200,
                            headers: headers,
                            body: ''
                        }];
                }
                // Solo permitir POST
                if (event.httpMethod !== 'POST') {
                    errorResponse = {
                        error: 'Method not allowed',
                        timestamp: new Date().toISOString()
                    };
                    return [2 /*return*/, {
                            statusCode: 405,
                            headers: headers,
                            body: JSON.stringify(errorResponse)
                        }];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                // Validar que existe body
                if (!event.body) {
                    logger_1.Logger.warn('Request received without body');
                    errorResponse = {
                        error: 'Request body is required',
                        timestamp: new Date().toISOString()
                    };
                    return [2 /*return*/, {
                            statusCode: 400,
                            headers: headers,
                            body: JSON.stringify(errorResponse)
                        }];
                }
                requestData = void 0;
                try {
                    requestData = JSON.parse(event.body);
                }
                catch (parseError) {
                    logger_1.Logger.error('Invalid JSON in request body', parseError);
                    errorResponse = {
                        error: 'Invalid JSON format',
                        timestamp: new Date().toISOString()
                    };
                    return [2 /*return*/, {
                            statusCode: 400,
                            headers: headers,
                            body: JSON.stringify(errorResponse)
                        }];
                }
                // Validar campo question
                if (!requestData.question || requestData.question.trim() === '') {
                    logger_1.Logger.warn('Request received without question field', {
                        customerId: requestData.customerId
                    });
                    errorResponse = {
                        error: 'question is required',
                        timestamp: new Date().toISOString()
                    };
                    return [2 /*return*/, {
                            statusCode: 400,
                            headers: headers,
                            body: JSON.stringify(errorResponse)
                        }];
                }
                // Validar longitud de la pregunta
                if (requestData.question.length > 500) {
                    logger_1.Logger.warn('Question too long', {
                        customerId: requestData.customerId
                    });
                    errorResponse = {
                        error: 'Question too long (max 500 characters)',
                        timestamp: new Date().toISOString()
                    };
                    return [2 /*return*/, {
                            statusCode: 400,
                            headers: headers,
                            body: JSON.stringify(errorResponse)
                        }];
                }
                return [4 /*yield*/, chatService_1.ChatService.processQuestion({
                        question: requestData.question.trim(),
                        customerId: (_a = requestData.customerId) === null || _a === void 0 ? void 0 : _a.trim()
                    })];
            case 2:
                response = _b.sent();
                console.log('LLM response:', response);
                return [2 /*return*/, {
                        statusCode: 200,
                        headers: headers,
                        body: JSON.stringify(response)
                    }];
            case 3:
                error_1 = _b.sent();
                logger_1.Logger.error('Unhandled error in chat handler', error_1);
                errorResponse = {
                    error: 'Internal server error',
                    timestamp: new Date().toISOString()
                };
                return [2 /*return*/, {
                        statusCode: 500,
                        headers: headers,
                        body: JSON.stringify(errorResponse)
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.handler = handler;
