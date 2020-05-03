import { Router, Request, Response } from "express";

import { HttpCode } from './../../libs/HttpCode';
import Utils from './../../libs/utils';
import Auth from './../../libs/Auth';
import { ResponseString } from './../../libs/ResponseString';

import Data from './dServices';
import Model from './mService';
import DataLangs from './dServiceLangs';
import DataPrices from './dServicePrices';
import ModelLang from './mServiceLangs';
import ModelExtends from './mServiceExtended';
import ModelPrice from './mServicePrices';



import { ResponseG } from "./../../bd/configFields";
import dLangs from './../langs/dLangs';
import mLang from './../langs/mLang';
import mServicePrice from "./mServicePrices";
import mService from "./mService";
import { clasController, DocEntity, DocFieldsEntity } from "./../../bd/controller";

class Service extends clasController {
    public router: Router;
    constructor() {
        super();

        this.router = Router();
        this.router.get("/service/:lang", this.Get);

        this.router.post("/service/save", Auth.Verify, this.Post);
        this.router.post("/service/save/title", Auth.Verify, this.PostTitle);
        this.router.post("/service/save/title/lang", Auth.Verify, this.PostTitleLang);
        this.router.post("/service/save/:service/price", Auth.Verify, this.AddNewPrice);



        this.router.put("/service/update", Auth.Verify, this.Put);
        this.router.put("/service/update/title", Auth.Verify, this.PutTitle);
        this.router.put("/service/update/title/lang", Auth.Verify, this.Put);
        this.router.put("/service/update/:service/price", Auth.Verify, this.EditPrice);

        this.router.post("/service/delete/:service", Auth.Verify, this.DeleteService);
        this.router.delete("/service/delete/price/:service/:months", Auth.Verify, this.DeletePrice);

        this.Documentation();
        this.router.get('/help/posts', (req: Request, res: Response) => {
            return res.status(200).send(this.Doc);
        });
    }
    private Documentation() {
        this.Doc = [
            {
                controller: "Service",
                url: "/service/:lang",
                method: "GET",
                description: "Get all service by lang name",
                fields: [
                    {
                        field: "lang",
                        require: true,
                        type: "string",
                        description: "Name of languague passed in url. Format pretty url"
                    }
                ]
            },
            {
                controller: "Service",
                url: "/service/save",
                method: "POST",
                description: "Create new service. Only user auths",
                fields: [
                    {
                        field: "id",
                        require: false,
                        type: "number",
                        description: "Auto numeric number. it's not necesary to create"
                    },
                    {
                        field: "type_id",
                        require: true,
                        type: "number",
                        description: "Id of type to asociate service"
                    },
                    {
                        field: "name",
                        require: true,
                        type: "string",
                        description: "Name of service"
                    },
                    {
                        field: "langs",
                        require: true,
                        type: "object",
                        description: [
                            {
                                field: "lang_id",
                                require: true,
                                type: "number",
                                description: "ID of lang"
                            },
                            {
                                field: "name",
                                require: true,
                                type: "string",
                                description: "Title of service in this lang"
                            },
                            {
                                field: "description",
                                require: false,
                                type: "string",
                                description: "Short descriptions for previous show"
                            }
                        ]
                    }
                ]
            },
            {
                controller: "Service",
                url: "/service/save/title",
                method: "POST",
                description: "Save only basic info for service",
                fields: [
                    {
                        field: "lang_id",
                        require: true,
                        type: "number",
                        description: "ID of lang"
                    },
                    {
                        field: "service_id",
                        require: true,
                        type: "number",
                        description: "ID of service"
                    },
                    {
                        field: "name",
                        require: true,
                        type: "string",
                        description: "Title of service in this lang"
                    },
                    {
                        field: "description",
                        require: false,
                        type: "string",
                        description: "Short descriptions for previous show"
                    }
                ]
            },
            {
                controller: "Service",
                url: "/service/save/title/lang",
                method: "POST",
                description: "Save only info langs",
                fields: [
                    {
                        field: "lang_id",
                        require: true,
                        type: "number",
                        description: "ID of lang"
                    },
                    {
                        field: "posts_id",
                        require: true,
                        type: "number",
                        description: "ID of posts"
                    },
                    {
                        field: "title",
                        require: false,
                        type: "string",
                        description: "Title of post in this lang"
                    },
                    {
                        field: "description",
                        require: false,
                        type: "string",
                        description: "Short descriptions for previous show"
                    },
                    {
                        field: "content",
                        require: false,
                        type: "string",
                        description: "All text of posts"
                    }
                ]
            },
            {
                controller: "Service",
                url: "/service/update",
                method: "PUT",
                description: "Update Service. Only user auths",
                fields: [
                    {
                        field: "id",
                        require: true,
                        type: "number",
                        description: "Auto numeric number. it's not necesary to create"
                    },
                    {
                        field: "type_id",
                        require: true,
                        type: "number",
                        description: "Id of type to asociate service"
                    },
                    {
                        field: "name",
                        require: true,
                        type: "string",
                        description: "Name of service"
                    },
                    {
                        field: "langs",
                        require: true,
                        type: "object",
                        description: [
                            {
                                field: "lang_id",
                                require: true,
                                type: "number",
                                description: "ID of lang"
                            },
                            {
                                field: "name",
                                require: true,
                                type: "string",
                                description: "Title of service in this lang"
                            },
                            {
                                field: "description",
                                require: false,
                                type: "string",
                                description: "Short descriptions for previous show"
                            }
                        ]
                    }
                ]
            },
            {
                controller: "Service",
                url: "/service/update/title",
                method: "POST",
                description: "Update only basic info for posts",
                fields: [
                    {
                        field: "lang_id",
                        require: true,
                        type: "number",
                        description: "ID of lang"
                    },
                    {
                        field: "service_id",
                        require: true,
                        type: "number",
                        description: "ID of service"
                    },
                    {
                        field: "name",
                        require: true,
                        type: "string",
                        description: "Title of service in this lang"
                    },
                    {
                        field: "description",
                        require: false,
                        type: "string",
                        description: "Short descriptions for previous show"
                    }
                ]
            },
            {
                controller: "Service",
                url: "/service/update/title/lang",
                method: "POST",
                description: "Save only info langs",
                fields: [
                    {
                        field: "lang_id",
                        require: true,
                        type: "number",
                        description: "ID of lang"
                    },
                    {
                        field: "service_id",
                        require: true,
                        type: "number",
                        description: "ID of service"
                    },
                    {
                        field: "title",
                        require: false,
                        type: "string",
                        description: "Title of post in this lang"
                    },
                    {
                        field: "description",
                        require: false,
                        type: "string",
                        description: "Short descriptions for previous show"
                    },
                    {
                        field: "content",
                        require: false,
                        type: "string",
                        description: "All text of posts"
                    }
                ]
            },
            {
                controller: "Service",
                url: "/service/delete/:post",
                method: "DELETE",
                description: "Delete post by id in pretty url",
                fields: [
                    {
                        field: "posts",
                        require: true,
                        type: "number",
                        description: "ID of post to delete"
                    }
                ]
            },
        ]
    }

    /**
     * Method to create a new service price.
     * @param req {Request}
     * @param res {Response}
     */
    private AddNewPrice(req: Request, res: Response) {
        const serviceId: number = Number(req.params.service);
        const prices: ModelPrice = req.body;
        prices.service_id = serviceId;

        const response: ResponseG = DataPrices.ValidateInsert(prices);
        if (response.error.length > 0) {
            response.item = req.body;
            return res.status(HttpCode.INVALID_DATA).send(response);
        }

        DataPrices.Create(prices, (respon: ResponseG) => {
            const statusCode: number = (respon.error.length > 0) ? HttpCode.BAD_REQUEST : HttpCode.OK;
            return res.status(statusCode).send(response.item);
        });
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
        const response: ResponseG = Data.ValidateInsert(req.body);
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
        const body: any = req.body;
        if (body.id)
            delete body.id;
        const datLangs: ModelLang[] = req.body.langs;
        const response: ResponseG = Data.ValidateInsert(body);
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
                    o.service_id = resp.item.insertId;
                    return o;
                });
                DataLangs.Create(serviceLang, (re: ResponseG) => {
                    const d: Model = {
                        id: resp.item.insertId,
                        name: item.name,
                        type_id: item.type_id,
                        fcreated: undefined, fupdate: undefined
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
                    o.service_id = item.id;
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

    /**
     * Method update service price.
     * @param req {Request}
     * @param res {Response}
     */
    private EditPrice(req: Request, res: Response) {
        const serviceId: number = Number(req.params.service);
        const prices: ModelPrice = req.body;
        prices.service_id = serviceId;

        const response: ResponseG = DataPrices.ValidateUpdate(prices);
        if (response.error.length > 0) {
            response.item = req.body;
            return res.status(HttpCode.INVALID_DATA).send(response);
        }

        DataPrices.Update(prices, (respon: ResponseG) => {
            const statusCode: number = (respon.error.length > 0) ? HttpCode.BAD_REQUEST : HttpCode.OK;
            return res.status(statusCode).send(response);
        });
    }

    /**
     * Method delete service price.
     * @param req {Request}
     * @param res {Response}
     */
    private DeletePrice(req: Request, res: Response) {
        const serviceId: string = req.params.service;
        const months: string = req.params.months;
        if (!Number(serviceId))
            return;
        if (!Number(months))
            return;

        const data: mServicePrice = DataPrices.DefaultEntity();
        data.service_id = Number(serviceId);
        data.months = Number(months);
        DataPrices.Delete(data, (response: ResponseG) => {
            const statusCode: number = (response.error.length > 0) ? HttpCode.BAD_REQUEST : HttpCode.OK;
            response.item = data;
            return res.status(statusCode).send(response);
        });
    }

    /**
     * Method delete service.
     * @param req {Request}
     * @param res {Response}
     */
    private DeleteService(req: Request, res: Response) {
        const serviceId: string = req.params.service;
        if (!Number(serviceId))
            return;

        const data: mService = Data.DefaultEntity();
        data.id = Number(serviceId);
        Data.Delete(data, (response: ResponseG) => {
            if (response.error.length > 0)
                return res.status(HttpCode.INVALID_DATA).send(response);
            const lang: ModelLang = DataLangs.DefaultEntity();
            lang.service_id = Number(serviceId);
            DataLangs.Delete(lang, (respon: ResponseG) => {
                const price: mServicePrice = DataPrices.DefaultEntity();
                price.service_id = Number(serviceId);
                DataPrices.Delete(price, (r: ResponseG) => {
                    r.item = { service_id: serviceId };
                    return res.status(HttpCode.OK).send(r);
                });
            })

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
                if (response.error.length > 0 || Utils.isEmptyObject(response.item))
                    return res.status(HttpCode.BAD_REQUEST).send(response);

                DataPrices.GetExtra(response.item, (resp: ResponseG) => {
                    response = Utils.UnionResponse(response, resp);
                    response.item = response.item.filter((i: any) => {
                        i.prices = resp.item.filter((o: ModelPrice) => o.service_id === i.id);
                        return i;
                    });
                    return res.status(HttpCode.OK).send(response);
                });
            });
        });
    }

}
export default new Service();
