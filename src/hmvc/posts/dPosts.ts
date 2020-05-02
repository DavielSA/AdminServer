
import db from "../../bd/db";
import { ResponseG } from './../../bd/configFields';
import { SQL } from './../../bd/sql';
import mPosts, { PostStatus } from './mPosts';
import mPostsExtended from './mPostsExtended';
import { ResponseString } from './../../libs/ResponseString';

import Utils from "./../../libs/utils";

class dServices extends db {

    constructor() {
        super();
        // this.dbName = "bd";
        this.tblName = "posts";
        this.Connect();
    }

    public DEFAULT_LANG: string = "es";

    /**
     * Method for validate
     * @param item {mPosts} item to validate
     * @param author {number} User id creator of content
     * @returns {ResponseG} return undefined when not valid data.
     */
    public ValidateInsert(item: mPosts, author: number): ResponseG {
        const response: ResponseG = this.GetResponseEmpty();
        item.author = author;
        response.item = item;

        if (!item.name)
            response.error.push(ResponseString.INVALID_FIELD.replace("{0}", "name"));

        if (!item.author)
            response.error.push(ResponseString.INVALID_FIELD.replace("{0}", "author"));

        if (!item.category_id)
            response.error.push(ResponseString.INVALID_FIELD.replace("{0}", "category_id"));

        if ((item as any).langs)
            delete (item as any).langs;

        if (!item.status)
            response.item.status = PostStatus.DRAFT;

        return response;
    }

    /**
     * Method for validate
     * @param item {mPosts} item to validate
     * @returns {ResponseG} return undefined when not valid data.
     */
    public ValidateUpdate(item: mPosts): ResponseG {
        const response: ResponseG = this.GetResponseEmpty();
        response.item = item;

        if (!item.id)
            response.error.push(ResponseString.INVALID_FIELD.replace("{0}", "id"));

        if (!item.name)
            response.error.push(ResponseString.INVALID_FIELD.replace("{0}", "name"));

        if (!item.category_id)
            response.info.push(ResponseString.INVALID_FIELD.replace("{0}", "category_id"));

        if ((item as any).langs)
            delete (item as any).langs;

        return response;
    }

    /**
     * This method open the schema and add new service
     * @param item {mPosts} Argument contains lang to create in database;
     * @param callback {function} This is function to response. return object type ResponseG
     * @return {void}
     */
    public Create(item: mPosts, callback: (result: ResponseG) => any): void {
        const self = this;
        const d: SQL = self.MakeInsert(item);
        self.ExecQuery(d.sql, d.data, callback);
    }

    /**
     * Method for update one row
     * @param item {mPosts} Argument contains lang to update in database;
     * @param callback {function} This is function to response. return object type ResponseG
     * @return {void}
     */
    public Update(item: mPosts, callback: (result: ResponseG) => any): void {
        const d: SQL = this.MakeUpdate(item, { id: item.id });
        this.ExecQuery(d.sql, d.data, callback);
    }

    /**
     *
     * @param item {mPosts} Item to delete
     * @param callback {function} This is function to response. return object type ResponseG
     * @return {void}
     */
    public Delete(item: mPosts, callback: (result: ResponseG) => any): void {
        const d: SQL = this.MakeWhere({ id: item.id });
        const sql = this.GetBasicDelete() + " WHERE " + d.sql;
        this.ExecQuery(sql, d.data, callback);
    }

    public IfExist(item: mPosts, callback: (result: ResponseG) => any): void {
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
    public Get(item: mPostsExtended, callback: (result: ResponseG) => any): void {
        const where: SQL = this.MakeWhere(item);

        // Fields of table posts
        where.sql = this.IfContainsReplace(where.sql, "`id` =", "s.id=");
        where.sql = this.IfContainsReplace(where.sql, "`name` =", "s.name=");
        where.sql = this.IfContainsReplace(where.sql, "`fcreated` =", "s.fcreated=");
        where.sql = this.IfContainsReplace(where.sql, "`fupdate` =", "s.fupdate=");

        // Field of table posts category
        where.sql = this.IfContainsReplace(where.sql, "`category_id` =", "s.category_id=");
        where.sql = this.IfContainsReplace(where.sql, "`category_alias` =", "pc.name=");

        // Field of table langs
        where.sql = this.IfContainsReplace(where.sql, "`lang_name` =", "l.name=");
        where.sql = this.IfContainsReplace(where.sql, "`lang_id` =", "sl.lang_id=");

        // Fields of table services_langs
        where.sql = this.IfContainsReplace(where.sql, "`title` = ?", "sl.title LIKE '%?%'");
        where.sql = this.IfContainsReplace(where.sql, "`description` = ?", "sl.description LIKE '%?%'");
        where.sql = this.IfContainsReplace(where.sql, "`content` = ?", "sl.content LIKE '%?%'");
        if (where.sql)
            where.sql = " AND " + where.sql;

        const sql: string = `
            SELECT 		l.name as lang_name,s.id
                        ,s.category_id
                        ,pc.name as category_alias
                        ,pcl.name as category_name
                        ,s.name, sl.lang_id
                        ,sl.title
                        ,sl.description,sl.content
                        ,s.fcreated,s.fupdate
            FROM		\`${this.dbName}\`.\`${this.tblName}\` As s
            INNER JOIN	\`${this.dbName}\`.\`posts_langs\` As sl
                ON		s.id = sl.posts_id
            INNER JOIN	\`${this.dbName}\`.\`posts_category\` As pc
                ON		s.category_id = pc.id
            INNER JOIN  \`${this.dbName}\`.\`posts_category_langs\` As pcl
                ON		pcl.posts_category_id = pc.id
                        AND pcl.lang_id = sl.lang_id
            INNER JOIN	\`${this.dbName}\`.\`langs\` As l
                ON		sl.lang_id = l.id
            WHERE       s.status=1
            ${where.sql}
        `;

        this.GetQuery(sql, where.data, callback);
    }

    /**
     * Return entity mService empty.
     */
    public DefaultEntity(): mPosts {
        return {
            id: undefined,
            category_id: undefined,
            author: undefined,
            status: undefined,
            name: undefined,
            fcreated: undefined,
            fupdate: undefined
        };
    }

    public DefaultEntityExtends(): mPostsExtended {
        return {
            id: undefined,
            name: undefined,
            category_id: undefined,
            category_name: undefined,
            category_alias: undefined,

            lang_id: undefined,
            lang_name: undefined,

            title: undefined,
            description: undefined,
            content: undefined,
            fcreated: undefined,
            fupdate: undefined
        }
    }
}
export default new dServices();
