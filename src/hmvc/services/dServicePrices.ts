
import db from "../../bd/db";
import { ResponseG } from './../../bd/configFields';
import { SQL } from './../../bd/sql';
import mServicePrices from './mServicePrices';
import { ResponseString } from './../../libs/ResponseString';
import mServiceExtended from './mServiceExtended';


class dSerciePrice extends db {

    constructor() {
        super();
        // this.dbName = "bd";
        this.tblName = "services_prices";
        this.Connect();
    }

    /**
     * Method for validate
     * @param item {mServicePrices} item to validate
     * @param validateSericeId {boolean} When need validate service_id fields.
     * @returns {ResponseG} return undefined when not valid data.
     */
    public ValidateInsert(item: mServicePrices): ResponseG {
        const response: ResponseG = this.GetResponseEmpty();
        response.item = item;

        if (!item.service_id)
            response.error.push(`${ResponseString.INVALID_FIELD.replace("{0}", "service_id")}`);

        if (!item.months)
            response.error.push(`${ResponseString.INVALID_FIELD.replace("{0}", "months")}`);

        if (!item.price)
            response.error.push(`${ResponseString.INVALID_FIELD.replace("{0}", "price")}`);

        return response;
    }

    /**
     * Method for validate
     * @param item {mServicePrices} item to validate
     * @returns {ResponseG} return undefined when not valid data.
     */
    public ValidateUpdate(item: mServicePrices): ResponseG {
        const response: ResponseG = this.GetResponseEmpty();
        response.item = item;

        if (!item.service_id)
            response.error.push(`${ResponseString.INVALID_FIELD.replace("{0}", "service_id")}`);

        if (!item.months)
            response.error.push(`${ResponseString.INVALID_FIELD.replace("{0}", "months")}`);

        if (!item.price)
            response.error.push(`${ResponseString.INVALID_FIELD.replace("{0}", "price")}`);
        return response;
    }

    /**
     * This method open the schema and add new service
     * @param item {mServicePrices} Argument contains lang to create in database;
     * @param callback {function} This is function to response. return object type ResponseG
     * @return {void}
     */
    public Create(item: mServicePrices, callback: (result: ResponseG) => any): void {
        const self = this;
        const d: SQL = self.MakeInsert(item);
        self.ExecQuery(d.sql, d.data, callback);
    }

    /**
     * Method for update one row
     * @param item {mServicePrices} Argument contains lang to update in database;
     * @param callback {function} This is function to response. return object type ResponseG
     * @return {void}
     */
    public Update(item: mServicePrices, callback: (result: ResponseG) => any): void {
        const d: SQL = this.MakeUpdate(item, { service_id: item.service_id, months: item.months });
        this.ExecQuery(d.sql, d.data, callback);
    }

    /**
     *
     * @param item {mService} Item to delete
     * @param callback {function} This is function to response. return object type ResponseG
     * @return {void}
     */
    public Delete(item: mServicePrices, callback: (result: ResponseG) => any): void {
        const d: SQL = this.MakeWhere({ service_id: item.service_id, months: item.months });
        const sql = this.GetBasicDelete() + " WHERE " + d.sql;
        this.ExecQuery(sql, d.data, callback);
    }


    /**
     *
     * @param item {mServicePrices} Item to find in database;
     * @param callback
     */
    public Get(item: mServicePrices, callback: (result: ResponseG) => any): void {
        const d: SQL = this.MakeWhere(item);
        const where: string = d.sql ? " WHERE " + d.sql : "";
        const sql: string = this.GetBasicSelect() + where;
        this.GetQuery(sql, d.data, callback);
    }

    /**
     *
     * @param item {mServiceExtended} Item to find in database by id;
     * @param callback
     */
    public GetExtra(item:mServiceExtended[],callback: (result: ResponseG) => any) : void {
        const ids : number[] = item.map((o:mServiceExtended) => o.id);
        const sql = this.GetBasicSelect() + " WHERE service_id IN (?) ";
        this.GetQuery(sql,ids,callback);
    }

    /**
     * Return entity mService empty.
     */
    public DefaultEntity(): mServicePrices {
        return {
            service_id: undefined,
            months: undefined,
            price: undefined,
            fcreated: undefined,
            fupdate: undefined
        };
    }

}
export default new dSerciePrice();
