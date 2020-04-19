import { Router, Request, Response } from "express";

import Data from './dLangs';
import Model from './mLang';

import { HttpCode } from './../../libs/HttpCode';
import Auth from './../../libs/Auth';
import { ResponseG } from "./../../bd/configFields";
import logs from "./../../libs/logs";



class Langs {
    public router: Router;
    constructor() {
        this.router = Router();
        this.router.get("/langs/get", this.Get);
        this.router.post("/langs/post", Auth.Verify, this.Post);
        this.router.put("/langs/put", Auth.Verify, this.Put);
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
     * Method to disconnect user.
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
