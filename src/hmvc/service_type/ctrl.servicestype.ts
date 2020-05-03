import { Router, Request, Response } from "express";

import Data from './dServiceType';
import Model from './mServiceType';

import { HttpCode } from './../../libs/HttpCode';
import Auth from './../../libs/Auth';
import { ResponseG } from "./../../bd/configFields";
import { clasController, DocEntity, DocFieldsEntity } from "./../../bd/controller";


class ServiceType extends clasController {
    public router: Router;
    constructor() {
        super();

        this.router = Router();
        this.router.get("/service/types", this.Get);
        this.router.post("/service/types", Auth.Verify, this.Post);
        this.router.put("/service/types", Auth.Verify, this.Put);

        this.Documentation();

        this.router.get('/help/service/types', (req: Request, res: Response) => {
            return res.status(200).send(this.Doc);
        });
    }

    private Documentation() {
        this.Doc = [
            {
                controller: "ServiceType",
                url: "/service/types",
                method: "GET",
                description: "Get All service type. No requiere autentificación",
                fields: []
            },
            {
                controller: "ServiceType",
                url: "/service/types",
                method: "POST",
                description: "Create new service type. Only user auths",
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
                    }
                ]
            },
            {
                controller: "ServiceType",
                url: "/service/types",
                method: "PUT",
                description: "Update one service type",
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
                    }
                ]
            },
        ]
    }

    /**
     * Method to create a new services type.
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
     * Method update services type.
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
     * Method to services type.
     * @param req {Request}
     * @param res {Response}
     */
    private Get(req: Request, res: Response) {
        Data.Get(Data.DefaultEntity(), (r: ResponseG) => {
            return res.status(HttpCode.OK).send(r);
        });
    }

}
export default new ServiceType();
