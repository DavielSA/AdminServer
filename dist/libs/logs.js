"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logs {
    constructor() {
        this.INFO = "INFO";
        this.WARN = "WARN";
        this.ERRO = "ERRO";
        /**
         * Private method for show console.log with structur.
         * @param {string} type. Type of message print in console.
         * @param {string} msg. Message to print in console.
         */
        this.WriteLogs = (type, msg) => {
            const nowDate = new Date();
            // tslint:disable-next-line:no-console
            console.log(`[${nowDate.toLocaleString()}]-[${type}]`, msg);
        };
        /**
         * Logs show for info message in console
         * @param {any} msg. Object to show in console
         */
        this.Log = (msg) => {
            this.WriteLogs(this.INFO, JSON.stringify(msg));
        };
        /**
         * Logs show for error message in console
         * @param {any} msg. Object to show in console
         */
        this.Error = (msg) => {
            this.WriteLogs(this.INFO, JSON.stringify(msg));
        };
        /**
         * Logs show for warnings message in console
         * @param {any} msg. Object to show in console
         */
        this.Warning = (msg) => {
            this.WriteLogs(this.WARN, JSON.stringify(msg));
        };
    }
}
exports.default = new Logs();
//# sourceMappingURL=logs.js.map