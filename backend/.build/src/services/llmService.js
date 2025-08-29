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
exports.LLMService = void 0;
// services/llmService.ts
var openai_1 = require("openai");
var logger_1 = require("../utils/logger");
var LLMService = /** @class */ (function () {
    function LLMService() {
    }
    LLMService.initializeClient = function () {
        var apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            logger_1.Logger.warn('OpenAI API key not configured, LLM service unavailable');
            return;
        }
        this.openai = new openai_1.default({
            apiKey: apiKey,
            timeout: this.TIMEOUT_MS
        });
    };
    LLMService.getResponse = function (question) {
        return __awaiter(this, void 0, void 0, function () {
            var completion, response, error_1;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this.openai) {
                            this.initializeClient();
                        }
                        if (!this.openai) {
                            logger_1.Logger.warn('LLM service not available');
                            return [2 /*return*/, null];
                        }
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        logger_1.Logger.info('Calling LLM service', { question: question });
                        return [4 /*yield*/, Promise.race([
                                this.openai.chat.completions.create({
                                    model: 'gpt-3.5-turbo',
                                    messages: [
                                        {
                                            role: 'system',
                                            content: "Eres un asistente de atenci\u00F3n al cliente de una tienda online. \n              Responde de manera breve, \u00FAtil y amigable a preguntas sobre productos, \n              env\u00EDos, devoluciones, precios y servicios. M\u00E1ximo 2 oraciones.\n              Si no tienes informaci\u00F3n espec\u00EDfica, sugiere contactar soporte."
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
                            ])];
                    case 2:
                        completion = _d.sent();
                        response = (_c = (_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim();
                        if (response) {
                            logger_1.Logger.info('LLM response received', {
                                question: question,
                                responseLength: response.length
                            });
                            return [2 /*return*/, response];
                        }
                        else {
                            logger_1.Logger.warn('Empty response from LLM', { question: question });
                            return [2 /*return*/, null];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _d.sent();
                        if (error_1 instanceof Error) {
                            if (error_1.message.includes('timeout')) {
                                logger_1.Logger.error('LLM request timeout', error_1, { question: question });
                            }
                            else if (error_1.message.includes('rate_limit')) {
                                logger_1.Logger.error('LLM rate limit exceeded', error_1, { question: question });
                            }
                            else {
                                logger_1.Logger.error('LLM service error', error_1, { question: question });
                            }
                        }
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LLMService.createTimeoutPromise = function () {
        var _this = this;
        return new Promise(function (_, reject) {
            setTimeout(function () {
                reject(new Error('LLM request timeout'));
            }, _this.TIMEOUT_MS);
        });
    };
    LLMService.isAvailable = function () {
        return !!process.env.OPENAI_API_KEY;
    };
    LLMService.openai = null;
    LLMService.TIMEOUT_MS = 10000;
    LLMService.MAX_TOKENS = 150;
    return LLMService;
}());
exports.LLMService = LLMService;
