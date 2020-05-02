
import db from "../../bd/db";
import { ResponseG } from './../../bd/configFields';
import { SQL } from './../../bd/sql';
import mPostsLangs from './mPostsLangs';
import { ResponseString } from './../../libs/ResponseString';
import logs from "./../../libs/logs";

class dServicesLangs extends db {

    constructor() {
        super();
        // this.dbName = "bd";
        this.tblName = "posts_langs";
        this.Connect();
    }

    public DEFAULT_LANG: string = "es";

    /**
     * Method for validate
     * @param item {mPostsLangs} item to validate
     * @param validateSericeId {boolean} When need validate posts_id fields.
     * @returns {ResponseG} return undefined when not valid data.
     */
    public ValidateInsert(item: mPostsLangs[], validateServiceId: boolean = false): ResponseG {

        const response: ResponseG = this.GetResponseEmpty();
        response.item = item;
        let oldServiceId: number = 0;
        for (const i in item) {
            if (validateServiceId) {
                if (oldServiceId !== 0 && item[i].posts_id && oldServiceId !== item[i].posts_id)
                    response.error.push(`[${i}] ${ResponseString.INVALID_FIELD.replace("{0}", "posts_id")}`);
                if (!item[i].posts_id)
                    response.error.push(`[${i}] ${ResponseString.INVALID_FIELD.replace("{0}", "posts_id")}`);
                else oldServiceId = item[i].posts_id;

            }
            if (!item[i].title)
                response.error.push(`[${i}] ${ResponseString.OPTIONAL_FIELD.replace("{0}", "title")}`);

            if (!item[i].lang_id)
                response.error.push(`[${i}] ${ResponseString.INVALID_FIELD.replace("{0}", "lang_id")}`);

            if (!item[i].description)
                response.info.push(`[${i}] ${ResponseString.OPTIONAL_FIELD.replace("{0}", "description")}`);

            if (!item[i].content)
                response.info.push(`[${i}] ${ResponseString.OPTIONAL_FIELD.replace("{0}", "content")}`);
        }
        return response;
    }

    /**
     * Method for validate
     * @param item {mPostsLangs} item to validate
     * @returns {ResponseG} return undefined when not valid data.
     */
    public ValidateUpdate(item: mPostsLangs[]): ResponseG {
        const response: ResponseG = this.GetResponseEmpty();
        response.item = item;
        for (const i in item) {
            if (!item[i].lang_id)
                response.error.push(`[${i}] ${ResponseString.INVALID_FIELD.replace("{0}", "lang_id")}`);

            if (!item[i].posts_id)
                response.error.push(`[${i}] ${ResponseString.INVALID_FIELD.replace("{0}", "posts_id")}`);

            if (!item[i].title)
                response.error.push(`[${i}] ${ResponseString.OPTIONAL_FIELD.replace("{0}", "title")}`);

            if (!item[i].description)
                response.info.push(`[${i}] ${ResponseString.OPTIONAL_FIELD.replace("{0}", "description")}`);

            if (!item[i].content)
                response.info.push(`[${i}] ${ResponseString.OPTIONAL_FIELD.replace("{0}", "content")}`);
        }
        return response;
    }

    /**
     * This method open the schema and add new posts_langs
     * @param item {mPostsLangs} Argument contains lang to create in database;
     * @param callback {function} This is function to response. return object type ResponseG
     * @return {void}
     */
    public Create(item: mPostsLangs[], callback: (result: ResponseG) => any): void {
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
    public Update(item: mPostsLangs, callback: (result: ResponseG) => any): void {
        const d: SQL = this.MakeUpdate(item, { lang_id: item.lang_id, service_id: item.posts_id });
        this.ExecQuery(d.sql, d.data, callback);
    }

    /**
     *
     * @param item {mService} Item to delete
     * @param callback {function} This is function to response. return object type ResponseG
     * @return {void}
     */
    public Delete(item: mPostsLangs, callback: (result: ResponseG) => any): void {
        const d: SQL = this.MakeWhere({ service_id: item.posts_id });
        const sql = this.GetBasicDelete() + " WHERE " + d.sql;
        this.ExecQuery(sql, d.data, callback);
    }


    /**
     * Return entity mService empty.
     */
    public DefaultEntity(): mPostsLangs {
        return {
            lang_id: undefined,
            posts_id: undefined,
            title: undefined,
            description: undefined,
            content:undefined,
            fcreated: undefined,
            fupdate: undefined
        };
    }

}
export default new dServicesLangs();
