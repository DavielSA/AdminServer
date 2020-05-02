import { Router, Request, Response } from "express";

import { HttpCode } from './../../libs/HttpCode';
import Utils from './../../libs/utils';
import Auth from './../../libs/Auth';
import { ResponseString } from './../../libs/ResponseString';

import Data from './dPosts';
import Model, { PostStatus } from './mPosts';
import DataLangs from './dPostsLangs';
import ModelLang from './mPostsLangs';
import ModelExtends from './mPostsExtended';


import { ResponseG } from "./../../bd/configFields";
import dLangs from './../langs/dLangs';
import mLang from './../langs/mLang';

class Posts {
    public router: Router;
    constructor() {
        this.router = Router();
        this.router.get("/posts/:lang", this.Get);

        this.router.post("/posts/save", Auth.Verify, this.Post);
        this.router.post("/posts/save/title", Auth.Verify, this.PostTitle);
        this.router.post("/posts/save/title/lang", Auth.Verify, this.PostTitleLang);

        this.router.put("/posts/update", Auth.Verify, this.Put);
        this.router.put("/posts/update/title", Auth.Verify, this.PutTitle);
        this.router.put("/posts/update/title/lang", Auth.Verify, this.Put);

        this.router.post("/posts/delete/:post", Auth.Verify, this.DeletePost);
    }

    /**
     * Method to create a new service langs.
     * @param req {Request}
     * @param res {Response}
     */
    private PostTitleLang(req: Request, res: Response) {
        const response: ResponseG = DataLangs.ValidateInsert(req.body, true);

        if (response.error.length > 0) {
            response.item = req.body;
            return res.status(HttpCode.INVALID_DATA).send(response);
        }

        dLangs.Get(dLangs.DefaultEntity(), (r: ResponseG) => {
            if (response.error.length > 0)
                return res.status(HttpCode.INVALID_DATA).send(r);
            // Check if valid lang
            const langs: number[] = r.item.map((o: mLang) => o.id);
            const elementos: ModelLang[] = response.item.filter((id: ModelLang) => langs.includes(id.lang_id));
            if (elementos.length < 1) {
                r.error.push(ResponseString.LANG_INVALID);
                return res.status(HttpCode.INVALID_DATA).send(r);
            }
            const service: Model = Data.DefaultEntity();
            service.id = response.item[0].service_id;
            Data.IfExist(service, (serv: ResponseG) => {
                if (response.error.length > 0)
                    return res.status(HttpCode.INVALID_DATA).send(serv);

                DataLangs.Create(response.item, (ml: ResponseG) => {
                    const statusCode: number = (ml.error.length > 0) ? HttpCode.BAD_REQUEST : HttpCode.OK;
                    return res.status(statusCode).send(response.item);
                });
            })

        });
    }

    /**
     * Method to create a only new service.
     * @param req {Request}
     * @param res {Response}
     */
    private PostTitle(req: Request, res: Response) {
        const userId: number = (req as any).id;
        const response: ResponseG = Data.ValidateInsert(req.body, userId);
        if (response.error.length > 0) {
            response.item = req.body;
            return res.status(HttpCode.INVALID_DATA).send(response);
        }

        // Creamos los registros de la tabla principales
        Data.Create(response.item, (resp: ResponseG) => {
            if (resp.error.length > 0 || Utils.isEmptyObject(resp.item))
                return res.status(HttpCode.OK).send(resp);
            resp.item = {
                id: resp.item.insertId,
                name: response.item.name,
                type_id: response.item.type_id,
                fcreated: new Date(), fupdate: new Date()
            };
            return res.status(HttpCode.OK).send(resp);
        });

    }

    /**
     * Method to create a new service with langs.
     * @param req {Request}
     * @param res {Response}
     */
    private Post(req: Request, res: Response) {
        const userId: number = (req as any).id;
        const body: any = req.body;
        const datLangs: ModelLang[] = req.body.langs;
        const response: ResponseG = Data.ValidateInsert(body, userId);
        let response2: ResponseG = DataLangs.GetResponseEmpty();
        // Validamos los idiomas
        if (!Utils.isEmptyObject(datLangs))
            response2 = DataLangs.ValidateInsert(datLangs);
        else
            response2.error.push(ResponseString.NOT_ARGUMENT);

        response.error = Utils.UnionArray(response.error, response2.error);
        if (response.error.length > 0) {
            response.item = req.body;
            return res.status(HttpCode.INVALID_DATA).send(response);
        }

        const item: Model = response.item;
        dLangs.Get(dLangs.DefaultEntity(), (r: ResponseG) => {
            if (response.error.length > 0)
                return res.status(HttpCode.INVALID_DATA).send(req.body);
            // Check if valid lang
            const langs: number[] = r.item.map((o: mLang) => o.id);
            const elementos: ModelLang[] = datLangs.filter((id: ModelLang) => langs.includes(id.lang_id));

            if (elementos.length < 1) {
                r.error.push(ResponseString.LANG_INVALID);
                return res.status(HttpCode.INVALID_DATA).send(req.body);
            }

            // Creamos los registros de la tabla principales
            Data.Create(item, (resp: ResponseG) => {
                if (resp.error.length > 0 || Utils.isEmptyObject(resp.item))
                    return res.status(HttpCode.OK).send(resp);
                // Creamos los registros por idioma
                const serviceLang: ModelLang[] = datLangs.map((o: ModelLang) => {
                    o.posts_id = resp.item.insertId;
                    return o;
                });
                DataLangs.Create(serviceLang, (re: ResponseG) => {
                    const d: Model = {
                        id: resp.item.insertId,
                        name: item.name,
                        author: item.author,
                        status: item.status,
                        category_id: item.category_id,
                        fcreated: new Date(), fupdate: new Date()
                    };
                    re.item = d;
                    re.item.lang = serviceLang;
                    re = Utils.UnionResponse(re, resp);

                    if (re.error.length > 0 || Utils.isEmptyObject(resp.item)) {
                        Data.Delete(d, (rs: ResponseG) => {
                            // tslint:no-empty
                        });
                        delete re.item.id;
                        return res.status(HttpCode.BAD_REQUEST).send(re);
                    }

                    return res.status(HttpCode.OK).send(re);
                });
            });

        });
    }

    /**
     * Method update only service.
     * @param req {Request}
     * @param res {Response}
     */
    private PutTitle(req: Request, res: Response) {
        const response: ResponseG = Data.ValidateUpdate(req.body);
        if (response.error.length > 0) {
            return res.status(HttpCode.INVALID_DATA).send(response);
        }
        const item: Model = req.body;

        Data.Update(item, (r: ResponseG) => {
            const statusCode: number = (r.error.length > 0 || Utils.isEmptyObject(r.item))
                ? HttpCode.BAD_REQUEST
                : HttpCode.OK;
            r.item = item;
            return res.status(statusCode).send(response);
        });
    }

    /**
     * Method update service with service lang.
     * @param req {Request}
     * @param res {Response}
     */
    private Put(req: Request, res: Response) {
        const body: any = req.body;
        const datLangs: ModelLang[] = req.body.langs;
        const response: ResponseG = Data.ValidateUpdate(body);
        let response2: ResponseG = DataLangs.GetResponseEmpty();
        // Validamos los idiomas
        if (!Utils.isEmptyObject(datLangs))
            response2 = DataLangs.ValidateUpdate(datLangs);
        else
            response2.error.push(ResponseString.NOT_ARGUMENT);

        response.error = Utils.UnionArray(response.error, response2.error);
        if (response.error.length > 0) {
            response.item = req.body;
            return res.status(HttpCode.INVALID_DATA).send(response);
        }

        const item: Model = response.item;
        dLangs.Get(dLangs.DefaultEntity(), (r: ResponseG) => {
            if (response.error.length > 0)
                return res.status(HttpCode.INVALID_DATA).send(req.body);
            // Verificamos que sea un idioma válido
            const langs: number[] = r.item.map((o: mLang) => o.id);
            const elementos: ModelLang[] = datLangs.filter((id: ModelLang) => langs.includes(id.lang_id));

            if (elementos.length < 1) {
                r.error.push(ResponseString.LANG_INVALID);
                return res.status(HttpCode.INVALID_DATA).send(req.body);
            }

            // Creamos los registros de la tabla principales
            Data.Update(item, (resp: ResponseG) => {
                if (resp.error.length > 0 || Utils.isEmptyObject(resp.item))
                    return res.status(HttpCode.OK).send(resp);
                // Creamos los registros por idioma
                const serviceLang: ModelLang[] = datLangs.map((o: ModelLang) => {
                    o.posts_id = item.id;
                    return o;
                });

                for (const i in serviceLang) {
                    DataLangs.Update(serviceLang[i], (re: ResponseG) => {
                        // tslint:no-empty
                    });
                }
                resp.item = item;
                resp.item.langs = serviceLang;
                return res.status(HttpCode.OK).send(resp);
            });

        });
    }

    private DeletePost(req: Request, res: Response) {
        const postsId: string = req.params.posts;
        if (!Number(postsId))
            return;
        const data: Model = Data.DefaultEntity();
        data.id = Number(postsId);
        data.status = PostStatus.TRASH;
        Data.Update(data, (response: ResponseG) => {
            response.item = data;
            return res.status(HttpCode.OK).send(response);
        });
    }

    /**
     * Method to filter.
     * @param req {Request}
     * @param res {Response}
     */
    private Get(req: Request, res: Response) {
        const item: ModelExtends = Data.DefaultEntityExtends();

        item.lang_name = (req.params.lang && req.params.lang)
            ? req.params.lang
            : Data.DEFAULT_LANG;

        const lang: mLang = dLangs.DefaultEntity();
        lang.name = item.lang_name;

        dLangs.Get(lang, (r: ResponseG) => {
            if (r.error.length > 0 || Utils.isEmptyObject(r.item))
                item.lang_name = Data.DEFAULT_LANG;

            Data.Get(item, (response: ResponseG) => {
                if (r.error.length > 0 || Utils.isEmptyObject(r.item))
                    response.info.push(ResponseString.LANG_UNSOPORTED(item.lang_name));

                return res.status(HttpCode.OK).send(response);
            });
        });


    }

}
export default new Posts();
