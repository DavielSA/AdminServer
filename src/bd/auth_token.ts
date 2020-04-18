
import bd from "./db";
import { ResponseG } from "./configFields";

export interface Token {
    user_id: number;
    token: string;
    renew_token: string;
    expired_token: Date;
    expired_token_renew: Date;
    permissions: number;
    fcreated: Date;
}
class AuthToken extends bd {
    constructor() {
        super();
        // this.dbName = "bd";
        this.tblName = "users_auths";
        this.Connect();
    }

    public Save(token: Token) {
        const d:any =this.MakeInsert(token);
        this.ExecQuery(d.sql,d.data,(r:ResponseG) => {
            // tslint:no-empty
        });
    }

    /**
     * Method for delete all token expired
     */
    public ClearTokens() {
        const sql : string = this.GetBasicDelete() + " expired_token=?";
        this.ExecQuery(sql,[(new Date())], (r:ResponseG) => {
            // tslint:no-empty
        });
    }

    /**
     *
     * @param token {string} token string
     * @param callback {void} function to response callback
     */
    public GetTokens(token: string, callback: (result: ResponseG) => any) {
        const fecha: Date = new Date();
        const query:string = this.GetBasicSelect() + " WHERE expired_token > ? AND token = ? ; ";
        this.GetQuery(query,[fecha,token], callback);
    }

}
export default new AuthToken();