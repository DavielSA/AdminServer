
import db from "../../bd/db";
import { ResponseG } from './../../bd/configFields';
import { SQL } from './../../bd/sql';
import mLang from './mLang';
import { ResponseString } from './../../libs/ResponseString';
import logs from './../../libs/logs';



class dLangs extends db {

    constructor() {
        super();
        // this.dbName = "bd";
        this.tblName = "langs";
        this.Connect();
    }

    /**
     * Method for validate
     * @param item {mLang} item to validate
     * @returns {ResponseG} return undefined when not valid data.
     */
    public ValidateInsert(item: mLang): ResponseG {
        const response: ResponseG = this.GetResponseEmpty();
        response.item = item;

        if (!item.name)
            response.error.push(ResponseString.INVALID_FIELD.replace("{0}", "name"));

        if (!item.flag)
            response.info.push(ResponseString.OPTIONAL_FIELD.replace("{0}", "flag"));

        return response;
    }

    /**
     * Method for validate
     * @param item {mLang} item to validate
     * @returns {ResponseG} return undefined when not valid data.
     */
    public ValidateUpdate(item: mLang): ResponseG {
        const response: ResponseG = this.GetResponseEmpty();
        response.item = item;

        if (!item.id)
            response.error.push(ResponseString.INVALID_FIELD.replace("{0}", "id"));

        if (!item.name)
            response.error.push(ResponseString.INVALID_FIELD.replace("{0}", "name"));

        if (!item.flag)
            response.info.push(ResponseString.OPTIONAL_FIELD.replace("{0}", "flag"));

        return response;
    }

    /**
     * This method open the schema and add new langs
     * @param item {mLang} Argument contains lang to create in database;
     * @param callback {function} This is function to response. return object type ResponseG
     * @return {void}
     */
    public Create(item: mLang, callback: (result: ResponseG) => any): void {
        const self = this;
        const d: SQL = self.MakeInsert(item);
        self.ExecQuery(d.sql, d.data, (r: ResponseG) => {
            if (r.error.length > 0) {
                callback(r);
            } else {
                self.Get(item,callback);
            }
        });
    }

    /**
     * Method for update one row
     * @param item {mLang} Argument contains lang to update in database;
     * @param callback {function} This is function to response. return object type ResponseG
     * @return {void}
     */
    public Update(item: mLang, callback: (result: ResponseG) => any): void {
        const d: SQL = this.MakeUpdate(item, { id: item.id });
        this.ExecQuery(d.sql, d.data, callback);
    }

    /**
     *
     * @param item {mLang} Item to delete
     * @param callback {function} This is function to response. return object type ResponseG
     * @return {void}
     */
    public Delete(item: mLang, callback: (result: ResponseG) => any): void {
        const d: SQL = this.MakeWhere({ id: item.id });
        const sql = this.GetBasicDelete() + " WHERE " + d.sql;
        this.ExecQuery(sql, d.data, callback);
    }

    /**
     *
     * @param item {mlang} Item to find in database;
     * @param callback
     */
    public Get(item: mLang, callback: (result: ResponseG) => any): void {
        const d: SQL = this.MakeWhere(item);
        const where: string = d.sql ? " WHERE " + d.sql : "";
        const sql: string = this.GetBasicSelect() + where;
        this.GetQuery(sql, d.data, callback);
    }

    /**
     * Return entity mLang empty.
     */
    public DefaultEntity(): mLang {
        return {
            id: undefined,
            name: undefined,
            flag: undefined,
            fcreated: undefined,
            fupdate: undefined
        };
    }
}
export default new dLangs();
