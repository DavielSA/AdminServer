import { Router, Request, Response } from "express";

import Data from './dLangs';
import Model from './mLang';

import { HttpCode } from './../../libs/HttpCode';
import Auth from './../../libs/Auth';
import { ResponseG } from "./../../bd/configFields";
import { clasController, DocEntity, DocFieldsEntity } from "./../../bd/controller";


class Langs extends clasController {
    public router: Router;
    constructor() {
        super();

        this.router = Router();
        this.router.get("/langs/get", this.Get);
        this.router.post("/langs/post", Auth.Verify, this.Post);
        this.router.put("/langs/put", Auth.Verify, this.Put);

        this.Documentation();
        this.router.get('/help/langs', (req: Request, res: Response) => {
            return res.status(200).send(this.Doc);
        });
    }
    private Documentation() {
        this.Doc = [
            {
                controller: "Langs",
                url: "/langs/get",
                method: "GET",
                description: "Obtenemos toda los idiomas creados. No requiere autentificación",
                fields: []
            },
            {
                controller: "Langs",
                url: "/langs/post",
                method: "POST",
                description: "Create new langs. Only user auths",
                fields: [
                    {
                        field: "id",
                        require: false,
                        type: "number",
                        description: "Auto numeric number. it's not necesary to create"
                    },
                    {
                        field: "name",
                        require: true,
                        type: "string",
                        description: "Name of languague"
                    },
                    {
                        field: "flag",
                        require: false,
                        type: "string",
                        description: "Image in base64 of flag"
                    }
                ]
            },
            {
                controller: "Langs",
                url: "/langs/put",
                method: "PUT",
                description: "Update one langs",
                fields: [
                    {
                        field: "id",
                        require: true,
                        type: "number",
                        description: "Id of languague"
                    },
                    {
                        field: "name",
                        require: true,
                        type: "string",
                        description: "Name of languague"
                    },
                    {
                        field: "flag",
                        require: false,
                        type: "string",
                        description: "Image in base64 of flag"
                    }
                ]
            },
        ]
    }

    /**
     * Method to create a new langs.
     * @param req {Request}
     * @param res {Response}
     */
    private Post(req: Request, res: Response) {

        const response: ResponseG = Data.ValidateInsert(req.body);
        if (response.error.length > 0) {
            return res.status(HttpCode.INVALID_DATA).send(response);
        }
        const item: Model = response.item;

        Data.Create(item, (r: ResponseG) => {
            return res.status(HttpCode.OK).send(r);
        });
    }

    /**
     * Method update lang.
     * @param req {Request}
     * @param res {Response}
     */
    private Put(req: Request, res: Response) {
        const response: ResponseG = Data.ValidateUpdate(req.body);
        if (response.error.length > 0) {
            return res.status(HttpCode.INVALID_DATA).send(response);
        }
        const item: Model = req.body;

        Data.Update(item, (r: ResponseG) => {
            return res.status(HttpCode.OK).send(response);
        });
    }

    /**
     * Method to filter.
     * @param req {Request}
     * @param res {Response}
     */
    private Get(req: Request, res: Response) {
        Data.Get(undefined, (r: ResponseG) => {
            return res.status(HttpCode.OK).send(r);
        });
    }

}
export default new Langs();
