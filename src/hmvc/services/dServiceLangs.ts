
import db from "../../bd/db";
import { ResponseG } from './../../bd/configFields';
import { SQL } from './../../bd/sql';
import mServiceLang from './mServiceLangs';
import { ResponseString } from './../../libs/ResponseString';
import logs from "./../../libs/logs";

class dServicesLangs extends db {

    constructor() {
        super();
        // this.dbName = "bd";
        this.tblName = "services_langs";
        this.Connect();
    }

    public DEFAULT_LANG: string = "es";

    /**
     * Method for validate
     * @param item {mService} item to validate
     * @param validateSericeId {boolean} When need validate service_id fields.
     * @returns {ResponseG} return undefined when not valid data.
     */
    public ValidateInsert(item: mServiceLang[], validateServiceId: boolean = false): ResponseG {

        const response: ResponseG = this.GetResponseEmpty();
        response.item = item;
        let oldServiceId: number = 0;
        for (const i in item) {
            if (validateServiceId) {
                if (oldServiceId !== 0 && item[i].service_id && oldServiceId !== item[i].service_id)
                    response.error.push(`[${i}] ${ResponseString.INVALID_FIELD.replace("{0}", "service_id")}`);
                if (!item[i].service_id)
                    response.error.push(`[${i}] ${ResponseString.INVALID_FIELD.replace("{0}", "service_id")}`);
                else oldServiceId = item[i].service_id;

            }
            if (!item[i].name)
                response.error.push(`[${i}] ${ResponseString.INVALID_FIELD.replace("{0}", "name")}`);

            if (!item[i].lang_id)
                response.error.push(`[${i}] ${ResponseString.INVALID_FIELD.replace("{0}", "lang_id")}`);

            if (!item[i].description)
                response.info.push(`[${i}] ${ResponseString.INVALID_FIELD.replace("{0}", "description")}`);
        }
        return response;
    }

    /**
     * Method for validate
     * @param item {mService} item to validate
     * @returns {ResponseG} return undefined when not valid data.
     */
    public ValidateUpdate(item: mServiceLang[]): ResponseG {
        const response: ResponseG = this.GetResponseEmpty();
        response.item = item;
        for (const i in item) {
            if (!item[i].name)
                response.error.push(`[${i}] ${ResponseString.INVALID_FIELD.replace("{0}", "name")}`);

            if (!item[i].lang_id)
                response.error.push(`[${i}] ${ResponseString.INVALID_FIELD.replace("{0}", "lang_id")}`);

            if (!item[i].service_id)
                response.error.push(`[${i}] ${ResponseString.INVALID_FIELD.replace("{0}", "service_id")}`);

            if (!item[i].description)
                response.info.push(`[${i}] ${ResponseString.INVALID_FIELD.replace("{0}", "description")}`);
        }
        return response;
    }

    /**
     * This method open the schema and add new service
     * @param item {mService} Argument contains lang to create in database;
     * @param callback {function} This is function to response. return object type ResponseG
     * @return {void}
     */
    public Create(item: mServiceLang[], callback: (result: ResponseG) => any): void {
        const self = this;
        const d: SQL = self.MakeInsertMultiple(item);
        self.ExecQuery(d.sql, d.data, callback);
    }

    /**
     * Method for update one row
     * @param item {mService} Argument contains lang to update in database;
     * @param callback {function} This is function to response. return object type ResponseG
     * @return {void}
     */
    public Update(item: mServiceLang, callback: (result: ResponseG) => any): void {
        const d: SQL = this.MakeUpdate(item, { lang_id: item.lang_id, service_id: item.service_id });
        this.ExecQuery(d.sql, d.data, callback);
    }

    /**
     *
     * @param item {mService} Item to delete
     * @param callback {function} This is function to response. return object type ResponseG
     * @return {void}
     */
    public Delete(item: mServiceLang, callback: (result: ResponseG) => any): void {
        const d: SQL = this.MakeWhere({ service_id: item.service_id });
        const sql = this.GetBasicDelete() + " WHERE " + d.sql;
        this.ExecQuery(sql, d.data, callback);
    }


    /**
     * Return entity mService empty.
     */
    public DefaultEntity(): mServiceLang {
        return {
            lang_id: undefined,
            service_id: undefined,
            name: undefined,
            description: undefined,
            fcreated: undefined,
            fupdate: undefined
        };
    }

}
export default new dServicesLangs();
