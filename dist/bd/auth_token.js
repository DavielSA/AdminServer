"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
const logs_1 = __importDefault(require("./../libs/logs"));
class AuthToken extends db_1.default {
    constructor() {
        super();
        // this.dbName = "bd";
        this.tblName = "users_auths";
        this.Connect();
    }
    Save(token) {
        const d = this.MakeInsert(token);
        this.ExecQuery(d.sql, d.data, (r) => {
            // tslint:no-empty
        });
    }
    /**
     * Method for delete all token expired
     */
    ClearTokens() {
        const sql = this.GetBasicDelete() + " expired_token=?";
        this.ExecQuery(sql, [(new Date())], (r) => {
            // tslint:no-empty
            logs_1.default.Log(r);
        });
    }
    /**
     *
     * @param token {string} token string
     * @param callback {void} function to response callback
     */
    GetTokens(token, callback) {
        const fecha = new Date();
        const query = this.GetBasicSelect() + " WHERE expired_token > ? AND token = ? ; ";
        this.GetQuery(query, [fecha, token], callback);
    }
}
exports.default = new AuthToken();
//# sourceMappingURL=auth_token.js.map