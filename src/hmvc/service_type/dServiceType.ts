
import db from "../../bd/db";
import { ResponseG } from './../../bd/configFields';
import { SQL } from './../../bd/sql';
import  mServiceType from './mServiceType';
import { ResponseString } from './../../libs/ResponseString';




class dServiceTpe extends db {

    constructor() {
        super();
        // this.dbName = "bd";
        this.tblName = "services_types";
        this.Connect();
    }

    /**
     * Method for validate
     * @param item {mServiceType} item to validate
     * @returns {ResponseG} return undefined when not valid data.
     */
    public ValidateInsert(item: mServiceType): ResponseG {
        const response: ResponseG = this.GetResponseEmpty();
        response.item = item;

        if (!item.name)
            response.error.push(ResponseString.INVALID_FIELD.replace("{0}", "name"));

        return response;
    }

    /**
     * Method for validate
     * @param item {mServiceType} item to validate
     * @returns {ResponseG} return undefined when not valid data.
     */
    public ValidateUpdate(item: mServiceType): ResponseG {
        const response: ResponseG = this.GetResponseEmpty();
        response.item = item;

        if (!item.id)
            response.error.push(ResponseString.INVALID_FIELD.replace("{0}", "id"));

        if (!item.name)
            response.error.push(ResponseString.INVALID_FIELD.replace("{0}", "name"));

        return response;
    }

    /**
     * This method open the schema and add new services_type
     * @param item {mServiceType} Argument contains lang to create in database;
     * @param callback {function} This is function to response. return object type ResponseG
     * @return {void}
     */
    public Create(item: mServiceType, callback: (result: ResponseG) => any): void {
        const self = this;
        const d: SQL = self.MakeInsert(item);
        self.ExecQuery(d.sql, d.data, (r: ResponseG) => {
            if (r.error.length > 0) {
                callback(r);
            } else {
                self.Get(item, callback);
            }
        });
    }

    /**
     * Method for update one row
     * @param item {mServiceType} Argument contains lang to update in database;
     * @param callback {function} This is function to response. return object type ResponseG
     * @return {void}
     */
    public Update(item: mServiceType, callback: (result: ResponseG) => any): void {
        const self = this;
        const d: SQL = this.MakeUpdate(item, { id: item.id });
        this.ExecQuery(d.sql, d.data, (r: ResponseG) => {
            if (r.error.length > 0) {
                callback(r);
            } else {
                self.Get(item, callback);
            }
        });
    }

    /**
     *
     * @param item {mServiceType} Item to delete
     * @param callback {function} This is function to response. return object type ResponseG
     * @return {void}
     */
    public Delete(item: mServiceType, callback: (result: ResponseG) => any): void {
        const d: SQL = this.MakeWhere({ id: item.id });
        const sql = this.GetBasicDelete() + " WHERE " + d.sql;
        this.ExecQuery(sql, d.data, callback);
    }

    /**
     *
     * @param item {mServiceType} Item to find in database;
     * @param callback
     */
    public Get(item: mServiceType, callback: (result: ResponseG) => any): void {
        const d: SQL = this.MakeWhere(item);
        const where: string = d.sql ? " WHERE " + d.sql : "";
        const sql: string = this.GetBasicSelect() + where;
        this.GetQuery(sql, d.data, callback);
    }

    /**
     * Return entity mLang empty.
     */
    public DefaultEntity(): mServiceType {
        return {
            id: undefined,
            name: undefined,
            fcreated: undefined,
            fupdate: undefined
        };
    }
}
export default new dServiceTpe();
