"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const logs_1 = __importDefault(require("./../libs/logs"));
class DB {
    /**
     * Instanciamos la clase. Aquí obtenemos de .env
     * en la variable DB_URL la url de conexión a la BD,
     * si no existe usamos por default "mongodb://localhost:27017"
     */
    constructor() {
        this.dbName = process.env.dbname || "adminserverdb";
        this.connectionObject = {
            host: process.env.host || "localhost",
            user: process.env.dbuser || "root",
            password: process.env.dbpass || "",
            database: this.dbName
        };
    }
    /**
     * In this method connect to database and defin the pool conextion, the conection to schema
     * and the access to table.
     */
    Connect() {
        this.connectionObject.database = this.dbName;
        this.con = mysql_1.default.createConnection(this.connectionObject);
        this.con.connect();
    }
    /**
     * This method return simple select. Example:
     *      SELECT * FROM `DataBaseName`.`TableName`
     */
    GetBasicSelect() {
        return `SELECT * FROM \`${this.dbName}\`.\`${this.tblName}\` `;
    }
    /**
     * This method return simple delete. Example:
     *      DELETE FROM `DataBaseName`.`TableName` WHERE
     */
    GetBasicDelete() {
        return `DELETE FROM \`${this.dbName}\`.\`${this.tblName}\` WHERE `;
    }
    /**
     * Generic method for create a where string and data array.
     * @param data {any} Object with data to generate where.
     * @return {object} Return object with string where and array of any data
     */
    MakeWhere(data) {
        if (!data)
            return { sql: "", data: [] };
        const fields = Object.keys(data).map((o) => data[o] ? `\`${o}\` = ?` : undefined).filter((o) => o);
        const aWhere = Object.keys(data).map((o) => data[o]).filter((o) => o);
        return {
            sql: fields.join(" AND "),
            data: aWhere
        };
    }
    /**
     * Generic method for create a insert query and data.
     * @param data {any} Object with data to generate data to insert.
     * @return {object} Return object with string sql and array of any data
     */
    MakeInsert(data) {
        if (!data)
            return { sql: "", data: [] };
        const fields = Object.keys(data).map((o) => data[o] ? `\`${o}\`` : undefined).filter((o) => o);
        const aWhere = Object.keys(data).map((o) => data[o]).filter((o) => o);
        const fieldsWhere = Array.from({ length: fields.length }, (_) => `?`);
        const sql = `INSERT INTO \`${this.dbName}\`.\`${this.tblName}\` (${fields.join(',')}) VALUES (${fieldsWhere.join(',')}) `;
        return {
            sql,
            data: aWhere
        };
    }
    /**
     * Generic method for create a insert query and data.
     * @param data {any} Object with data to generate fields to update.
     * @param dataWhere {any} Object with data to generate where.
     * @return {object} Return object with string sql and array of any data
     */
    MakeUpdate(data, dataWhere) {
        if (!data)
            return { sql: "", data: [] };
        const fields = Object.keys(data).map((o) => data[o] ? `\`${o}\` = ?` : undefined).filter((o) => o);
        const where = Object.keys(dataWhere).map((o) => data[o] ? `\`${o}\` = ?` : undefined).filter((o) => o);
        const aData = [...Object.keys(data).map((o) => data[o]).filter((o) => o), ...Object.keys(dataWhere).map((o) => data[o]).filter((o) => o)];
        const sql = `UPDATE \`${this.dbName}\`.\`${this.tblName}\` SET ${fields.join(',')} WHERE ${where.join(' AND ')}`;
        return {
            sql,
            data: aData
        };
    }
    /**
     * GetQuery. Method to execute query and return some rows (only select).
     * @param sql {string} Query to execute
     * @param argument {array} Array of element to filters
     * @param callback {void} Function to response callback.
     * @returns {void}
     */
    GetQuery(sql, argument, callback) {
        this.con.query(sql, argument, (error, results, fields) => {
            this.CallSelect(callback, error, results);
        });
    }
    /**
     * ExecQuery. Method to execute query for insert, update or delete.
     * @param sql {string} Query to execute
     * @param argument {array} Array of element to filters
     * @param callback {void} Function to response callback.
     * @returns {void}
     */
    ExecQuery(sql, argument, callback) {
        this.con.query(sql, argument, (error, results, fields) => {
            this.CallBackInsert(callback, error, results);
        });
        // this.con.end();
    }
    /**
     * This generic method execute when whee need get one or more items of entity
     * @param callback {void} Function to execute when finished
     * @param e {MysqlError} When exist error this var is declared
     * @param r {any} When the sellect is sussefully this contains data
     */
    CallSelect(callback, e, r) {
        const Respuesta = this.GetResponseEmpty();
        if (e) {
            logs_1.default.Log(e);
            Respuesta.error.push(e.code);
        }
        else {
            Respuesta.item = r;
        }
        callback(Respuesta);
    }
    /**
     * This generic method execute when whee need insert one or more items
     * @param callback {void} Function to execute when finished
     * @param e {MysqlError} When exist error this var is declared
     * @param r {any} When the insert is sussefully this contains
     */
    CallBackInsert(callback, e, r) {
        const Respuesta = this.GetResponseEmpty();
        if (e) {
            logs_1.default.Log(e);
            Respuesta.error.push(e.code);
        }
        else {
            Respuesta.item = r.result;
        }
        callback(Respuesta);
    }
    /**
     * This generic method execute when whee need update one or more items
     * @param callback {void} Function to execute when finished
     * @param e {MysqlError} When exist error this var is declared
     * @param r {any} When the insert is sussefully this contains
     */
    CallUpdate(callback, e, r) {
        const Respuesta = this.GetResponseEmpty();
        if (e) {
            logs_1.default.Log(e);
            Respuesta.error.push(e.code);
        }
        else {
            Respuesta.item = r.result;
        }
        callback(Respuesta);
    }
    /**
     * Create empty ResponseG default
     */
    GetResponseEmpty() {
        return {
            error: [],
            warning: [],
            info: [],
            item: {}
        };
    }
}
exports.default = DB;
//# sourceMappingURL=db.js.map