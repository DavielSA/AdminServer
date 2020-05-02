import mysql, { MysqlError, FieldInfo } from "mysql";
import logs from "./../libs/logs";

import { ResponseG } from './configFields';
import { SQL } from './sql';

interface iConnectionObject {
    host: string;
    user: string;
    password: string;
    database: string;
}
export default class DB {

    protected con: mysql.Connection;
    protected dbName: string;
    protected tblName: string;
    private connectionObject: iConnectionObject;

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
    protected Connect() {
        this.connectionObject.database = this.dbName;
        this.con = mysql.createConnection(this.connectionObject);
        this.con.connect();
    }

    /**
     * This method return simple select. Example:
     *      SELECT * FROM `DataBaseName`.`TableName`
     */
    protected GetBasicSelect(): string {
        return `SELECT * FROM \`${this.dbName}\`.\`${this.tblName}\` `;
    }

    /**
     * This method return simple delete. Example:
     *      DELETE FROM `DataBaseName`.`TableName` WHERE
     */
    protected GetBasicDelete(): string {
        return `DELETE FROM \`${this.dbName}\`.\`${this.tblName}\` WHERE `;
    }

    /**
     * Generic method for create a where string and data array.
     * @param data {any} Object with data to generate where.
     * @return {object} Return object with string where and array of any data
     */
    protected MakeWhere(data: any): SQL {
        if (!data)
            return { sql: "", data: [] };

        const fields: string[] = Object.keys(data).map((o) => data[o] ? `\`${o}\` = ?` : undefined).filter((o) => o);
        const aWhere: string[] = Object.keys(data).map((o) => data[o]).filter((o) => o);
        return {
            sql: fields.join(" AND "),
            data: aWhere
        }
    }

    /**
     * Generic method for create a insert query and data.
     * @param data {any} Object with data to generate data to insert.
     * @return {object} Return object with string sql and array of any data
     */
    protected MakeInsert(data: any): SQL {
        if (!data)
            return { sql: "", data: [] };

        const fields: string[] = Object.keys(data).map((o) => data[o] ? `\`${o}\`` : undefined).filter((o) => o);
        const aWhere: string[] = Object.keys(data).map((o) => data[o]).filter((o) => o);
        const fieldsWhere: string[] = Array.from({ length: fields.length }, (_) => `?`);
        const sql: string = `INSERT INTO \`${this.dbName}\`.\`${this.tblName}\` (${fields.join(',')}) VALUES (${fieldsWhere.join(',')}) `;

        return {
            sql,
            data: aWhere
        }
    }

    /**
     * Insert multiple rows
     * @param data {any[]} Collections of data to insert in database
     * @returns {SQL} Return string sql and data array with multple insert structure
     */
    protected MakeInsertMultiple(data: any[]): SQL {
        /*
        INSERT INTO
            projects(name, start_date, end_date)
        VALUES
            ('AI for Marketing','2019-08-01','2019-12-31'),
            ('ML for Sales','2019-05-15','2019-11-20');
        */
        if (!data)
            return { sql: "", data: [] };

        const fields: string[] = Object
            .keys(data[0])
            .map((o) => `\`${o}\``);

        const aWhere: string[][] = data.map((dat: any) => (Object.keys(dat).map((o: string) => (dat[o] ? dat[o] : 'null'))));
        const item : string[] =  Array.from({ length: fields.length}, (c) => "?");
        const fieldsWhere : string[][] = Array.from( {length:data.length}, (c) => item);
        const sql: string = `INSERT INTO \`${this.dbName}\`.\`${this.tblName}\` (${fields.join(',')}) VALUES ${fieldsWhere.map((c:string[]) => `(${c.join(',')})`).join(", ")} `;

        return {
            sql,
            data: aWhere.length===1 ? aWhere[0] : aWhere
        }
    }

    /**
     * Generic method for create a insert query and data.
     * @param data {any} Object with data to generate fields to update.
     * @param dataWhere {any} Object with data to generate where.
     * @return {object} Return object with string sql and array of any data
     */
    protected MakeUpdate(data: any, dataWhere: any): SQL {
        if (!data)
            return { sql: "", data: [] };

        const fields: string[] = Object.keys(data).map((o) => data[o] ? `\`${o}\` = ?` : undefined).filter((o) => o);
        const where: string[] = Object.keys(dataWhere).map((o) => data[o] ? `\`${o}\` = ?` : undefined).filter((o) => o);
        const aData: string[] = [...Object.keys(data).map((o) => data[o]).filter((o) => o), ...Object.keys(dataWhere).map((o) => data[o]).filter((o) => o)];
        const sql = `UPDATE \`${this.dbName}\`.\`${this.tblName}\` SET ${fields.join(',')} WHERE ${where.join(' AND ')}`;

        return {
            sql,
            data: aData
        }
    }

    /**
     * GetQuery. Method to execute query and return some rows (only select).
     * @param sql {string} Query to execute
     * @param argument {array} Array of element to filters
     * @param callback {void} Function to response callback.
     * @returns {void}
     */
    protected GetQuery(sql: string, argument: any[], callback: (Response: ResponseG) => any) {
        this.con.query(sql, argument, (error: MysqlError, results, fields: FieldInfo[]) => {
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
    protected ExecQuery(sql: string, argument: any[], callback: (Response: ResponseG) => any) {
        this.con.query(sql, argument, (error: MysqlError, results, fields: FieldInfo[]) => {
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
    protected CallSelect(callback: (Respuesta: ResponseG) => any,
        e: MysqlError, r: any) {
        const Respuesta: ResponseG = this.GetResponseEmpty();
        if (e) {
            logs.Error(e);
            Respuesta.error.push(e.code);
        } else {
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
    protected CallBackInsert(callback: (Respuesta: ResponseG) => ResponseG,
        e: MysqlError, r: any) {
        const Respuesta: ResponseG = this.GetResponseEmpty();
        if (e) {
            logs.Error(e);
            Respuesta.error.push(e.code);
        } else {
            Respuesta.item = r;
        }
        callback(Respuesta);
    }


    /**
     * This generic method execute when whee need update one or more items
     * @param callback {void} Function to execute when finished
     * @param e {MysqlError} When exist error this var is declared
     * @param r {any} When the insert is sussefully this contains
     */
    protected CallUpdate(callback: (Respuesta: ResponseG) => ResponseG,
        e: MysqlError, r: any) {
        const Respuesta: ResponseG = this.GetResponseEmpty();

        if (e) {
            logs.Error(e);
            Respuesta.error.push(e.code);
        } else {
            Respuesta.item = r.result;
        }
        callback(Respuesta);
    }

    protected IfContainsReplace(str: string, find: string, replace: string) {
        return (str.search(find) >= 0)
            ? str.replace(find, replace)
            : str;
    }

    /**
     * Create empty ResponseG default
     */
    public GetResponseEmpty(): ResponseG {
        return {
            error: [],
            warning: [],
            info: [],
            item: {}
        };
    }

}
