"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.formatLog = function (event) {
        return __assign(__assign({}, event), { timestamp: new Date().toISOString() });
    };
    Logger.info = function (message, metadata) {
        var logEvent = this.formatLog(__assign({ level: 'info', message: message }, metadata));
        console.log(JSON.stringify(logEvent));
    };
    Logger.warn = function (message, metadata) {
        var logEvent = this.formatLog(__assign({ level: 'warn', message: message }, metadata));
        console.warn(JSON.stringify(logEvent));
    };
    Logger.error = function (message, error, metadata) {
        var logEvent = this.formatLog(__assign({ level: 'error', message: message, error: (error === null || error === void 0 ? void 0 : error.message) || (error === null || error === void 0 ? void 0 : error.toString()) }, metadata));
        console.error(JSON.stringify(logEvent));
    };
    Logger.requestStart = function (question, customerId) {
        this.info('Chat request started', { question: question, customerId: customerId });
        return Date.now();
    };
    Logger.requestEnd = function (startTime, source, question, customerId) {
        var duration = Date.now() - startTime;
        this.info('Chat request completed', {
            question: question,
            source: source,
            duration: duration,
            customerId: customerId
        });
    };
    return Logger;
}());
exports.Logger = Logger;
