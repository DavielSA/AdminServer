
import db from "../../bd/db";
import { ResponseG } from './../../bd/configFields';
import { SQL } from './../../bd/sql';
import mUser from './mUser';
import Utils from "./../../libs/utils";
import Auth, { AuthEntity } from './../../libs/Auth';
import { ResponseString } from './../../libs/ResponseString';

class dUser extends db {

    constructor() {
        super();
        // this.dbName = "bd";
        this.tblName = "users";
        this.Connect();
    }

    /**
     * Method to validate data receibed for verbs
     * @param data {any} Data to validate.
     * @param callback {function} this is function to response. return object type ResponseG
     */
    public IsValidInsert(data: any, callback: (result: ResponseG) => any): boolean {
        const r: ResponseG = this.GetResponseEmpty();

        if (Utils.isEmptyObject(data)) {
            r.error.push(ResponseString.NOT_ARGUMENT)
            callback(r);
            return false;
        }

        if (!data.email || !Utils.isEmail(data.email)) {
            r.error.push(ResponseString.INVALID_FIELD.replace("{0}", "email"));
        }
        if (!data.password) {
            r.error.push(ResponseString.INVALID_FIELD.replace("{0}", "password"));
        }

        if (!data.name) {
            r.warning.push(ResponseString.OPTIONAL_FIELD.replace("{0}", "name"));
            data.name = "";
        }
        if (!data.role) {
            r.info.push(ResponseString.OPTIONAL_FIELD.replace("{0}", "role"));
            data.permissions = 0;
        }

        data.status = 0;
        data.fcreated = new Date();
        data.fupdate = new Date();
        r.item = data;

        if (r.error.length > 0) {
            delete r.item.password;
            callback(r);
            return false;
        }

        Auth.GetHash(data.password, (e: boolean, rAuth: AuthEntity | any) => {
            if (e) {
                r.error.push(ResponseString.PASSWORD_HASH_ERROR);
            } else {
                r.item.hash = rAuth.hash;
                r.item.salt = rAuth.salt;
            }
            delete r.item.password;
            callback(r);
        });
        return true;
    }

    /**
     * this method validate basic data to login user.
     * @param data
     * @param callback {function} this is function to response. return object type ResponseG
     */
    public IsValidlogin(data: any): ResponseG {
        const r: ResponseG = this.GetResponseEmpty();

        if (Utils.isEmptyObject(data)) {
            r.error.push(ResponseString.NOT_ARGUMENT)
            return r;
        }
        if (!data.email || !Utils.isEmail(data.email)) {
            r.error.push(ResponseString.INVALID_FIELD.replace("{0}", "email"));
        }
        if (!data.password) {
            r.error.push(ResponseString.INVALID_FIELD.replace("{0}", "password"));
        }
        r.item = data;
        return r;
    }

    /**
     * This metod return all ocurrence for <where> argument.
     * @param where {mUser} criteria to filter
     * @param callback {function} this is function to response. Return object type ResponseG
     */
    public Get(where: mUser, callback: (result: ResponseG) => any): void {
        const d: SQL = this.MakeWhere(where);
        const sql: string = this.GetBasicSelect() + " WHERE " + d.sql;

        this.GetQuery(sql, d.data, callback);
    }

    /**
     *
     * @param Respuesta {ResponseG}. Manage response generic
     * @param sEmail {string}. Email a user to search in db.
     * @param password {string}. Password to user for compare.
     * @param callback {void}. Function to response.
     */
    public GetLogin(Respuesta: ResponseG, sEmail: string, password: string, callback: (result: ResponseG) => any) {
        const sql: string = this.GetBasicSelect() + " WHERE email = ? ";

        this.GetQuery(sql, [sEmail], (r: ResponseG) => {
            if (r.error.length > 0) {
                Respuesta.error = [...Respuesta.error, ...r.error];
                Respuesta.warning = [...Respuesta.warning, ...r.warning];
                callback(Respuesta);
            } else if (r.item.length < 1) {
                Respuesta.error.push(ResponseString.USER_NOT_FOUND);
                callback(Respuesta);
            } else {
                const item: any = r.item[0];
                Auth.VerifyHash(password, item.salt, (error: boolean, hash: string) => {
                    if (error) {
                        Respuesta.error.push(ResponseString.PASSWORD_HASH_ERROR);
                    } else {
                        if (item.hash !== hash)
                            Respuesta.error.push(ResponseString.PASWORD_INVALID);
                        delete item.hash;
                        delete item.salt;
                        Respuesta.item = item;
                    }
                    callback(Respuesta);
                });
            }
        });
    }

    /**
     * This method open the schema and add argument <data>
     * @param data {mUser} Data to insert in schema
     * @param callback {function}  this is function to response. Return object type ResponseG
     */
    public Create(data: mUser, Respuesta: ResponseG, callback: (result: ResponseG) => any): void {
        const d: SQL = this.MakeInsert(data);
        this.ExecQuery(d.sql, d.data, callback);
    }

    /**
     * This method open /find the schema with a objectId and update this
     * @param data {mUser}. Data to update in schema
     * @param callback {function}. This is function to response. Return object type ResponseG
     */
    public Update(data: mUser, callback: (result: ResponseG) => any): void {
        const Respuesta: ResponseG = this.GetResponseEmpty();
        const d: SQL = this.MakeUpdate(data, { id: data.id });
        this.ExecQuery(d.sql, d.data, callback);
    }

    /**
     * Return entity mUser empty.
     */
    public DefaultEntity(): mUser {
        return {
            id: undefined,
            email: undefined,
            hash: undefined,
            salt: undefined,
            name: undefined,
            permissions: undefined,
            lastlogin: new Date(),
            fcreated: new Date(),
            fupdate: new Date()
        };
    }
}
export default new dUser();
