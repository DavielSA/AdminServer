
import db from "../../bd/db";
import { ResponseG } from './../../bd/configFields';
import mUserHistory from './mUserHistory';


class dUserHistory extends db {

    constructor() {
        super();
        // this.dbName = "bd";
        this.tblName = "user_history";
        this.Connect();
    }

    /**
     * This method open the schema and add argument <data>
     * @param loginip {string} IP client
     * @param userid {number} ID clients
     */
    public Create(loginip: string, userid: number): void {
        const data: mUserHistory = {
            user_id: userid,
            login_ip: loginip,
            timestampt: undefined
        };
        const d: any = this.MakeInsert(data);
        this.ExecQuery(d.sql, d.data, (result: ResponseG) => {
            // tslint:no-empty
        });
    }

    /**
     * Return entity mUser empty.
     */
    public DefaultEntity(): mUserHistory {
        return {
            user_id: undefined,
            timestampt: (new Date()),
            login_ip: undefined
        };
    }
}
export default new dUserHistory();
