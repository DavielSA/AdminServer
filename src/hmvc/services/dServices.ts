
import db from "../../bd/db";
import { ResponseG } from './../../bd/configFields';
import { SQL } from './../../bd/sql';
import mService from './mService';
import mServiceExtended from './mServiceExtended';
import { ResponseString } from './../../libs/ResponseString';
import logs from "./../../libs/logs";
import Utils from "./../../libs/utils";

class dServices extends db {

    constructor() {
        super();
        // this.dbName = "bd";
        this.tblName = "services";
        this.Connect();
    }

    public DEFAULT_LANG: string = "es";

    /**
     * Method for validate
     * @param item {mService} item to validate
     * @returns {ResponseG} return undefined when not valid data.
     */
    public ValidateInsert(item: mService): ResponseG {
        const response: ResponseG = this.GetResponseEmpty();
        response.item = item;

        if (!item.name)
            response.error.push(ResponseString.INVALID_FIELD.replace("{0}", "name"));

        if (!item.type_id)
            response.error.push(ResponseString.INVALID_FIELD.replace("{0}", "type_id"));

        if ((item as any).langs)
            delete (item as any).langs;

        return response;
    }

    /**
     * Method for validate
     * @param item {mService} item to validate
     * @returns {ResponseG} return undefined when not valid data.
     */
    public ValidateUpdate(item: mService): ResponseG {
        const response: ResponseG = this.GetResponseEmpty();
        response.item = item;

        if (!item.id)
            response.error.push(ResponseString.INVALID_FIELD.replace("{0}", "id"));

        if (!item.name)
            response.error.push(ResponseString.INVALID_FIELD.replace("{0}", "name"));

        if (!item.type_id)
            response.info.push(ResponseString.INVALID_FIELD.replace("{0}", "type_id"));

        if ((item as any).langs)
            delete (item as any).langs;

        return response;
    }

    /**
     * This method open the schema and add new service
     * @param item {mService} Argument contains lang to create in database;
     * @param callback {function} This is function to response. return object type ResponseG
     * @return {void}
     */
    public Create(item: mService, callback: (result: ResponseG) => any): void {
        const self = this;
        const d: SQL = self.MakeInsert(item);
        self.ExecQuery(d.sql, d.data, callback);
    }

    /**
     * Method for update one row
     * @param item {mService} Argument contains lang to update in database;
     * @param callback {function} This is function to response. return object type ResponseG
     * @return {void}
     */
    public Update(item: mService, callback: (result: ResponseG) => any): void {
        const d: SQL = this.MakeUpdate(item, { id: item.id });
        this.ExecQuery(d.sql, d.data, callback);
    }

    /**
     *
     * @param item {mService} Item to delete
     * @param callback {function} This is function to response. return object type ResponseG
     * @return {void}
     */
    public Delete(item: mService, callback: (result: ResponseG) => any): void {
        const d: SQL = this.MakeWhere({ id: item.id });
        const sql = this.GetBasicDelete() + " WHERE " + d.sql;
        this.ExecQuery(sql, d.data, callback);
    }

    public IfExist(item: mService, callback: (result: ResponseG) => any): void {
        const d: SQL = this.MakeWhere(item);
        const where: string = d.sql ? " WHERE " + d.sql : "";
        const sql: string = this.GetBasicSelect() + where;
        this.GetQuery(sql, d.data, (r: ResponseG) => {
            if (r.error.length < 1 && Utils.isEmptyObject(r.item)) {
                r.error.push(ResponseString.GENERIC_NOTFOUND('SERVICE'));
            }
            callback(r);
        });
    }
    /**
     *
     * @param item {mService} Item to find in database;
     * @param callback
     */
    public Get(item: mServiceExtended, callback: (result: ResponseG) => any): void {
        const where: SQL = this.MakeWhere(item);
        // Field of table langs
        where.sql = this.IfContainsReplace(where.sql, "`lang_name` =", "l.name=");
        where.sql = this.IfContainsReplace(where.sql, "`flag` =", "l.flag=");
        // Fields of table services
        where.sql = this.IfContainsReplace(where.sql, "`type_id` =", "s.type_id=");
        where.sql = this.IfContainsReplace(where.sql, "`name` =", "s.name=");
        where.sql = this.IfContainsReplace(where.sql, "`fcreated` =", "s.fcreated=");
        where.sql = this.IfContainsReplace(where.sql, "`fupdate` =", "s.fupdate=");
        // Fields of table services_langs
        where.sql = this.IfContainsReplace(where.sql, "`lang_id` =", "sl.lang_id=");
        where.sql = this.IfContainsReplace(where.sql, "`title` = ?", "sl.name LIKE '%?%'");
        where.sql = this.IfContainsReplace(where.sql, "`description` = ?", "sl.description LIKE '%?%'");
        if (where.sql)
            where.sql = " WHERE " + where.sql;

        const sql: string = `
            SELECT 		l.name as lang_name, l.flag,s.id, s.type_id, s.name, sl.lang_id, sl.name As title, sl.description, s.fcreated, s.fupdate
            FROM		\`${this.dbName}\`.\`${this.tblName}\` As s
            INNER JOIN	\`${this.dbName}\`.services_langs As sl
                ON		s.id = sl.service_id
            INNER JOIN	langs As l
                ON		sl.lang_id = l.id
            ${where.sql}
        `;

        this.GetQuery(sql, where.data, callback);
    }

    /**
     * Return entity mService empty.
     */
    public DefaultEntity(): mService {
        return {
            id: undefined,
            type_id: undefined,
            name: undefined,
            fcreated: undefined,
            fupdate: undefined
        };
    }

    public DefaultEntityExtends(): mServiceExtended {
        return {
            id: undefined,
            type_id: undefined,
            lang_name: undefined,
            flag: undefined,
            name: undefined,
            lang_id: undefined,
            title: undefined,
            description: undefined,
            fcreated: undefined,
            fupdate: undefined
        }
    }
}
export default new dServices();
