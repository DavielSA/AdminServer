import { Router } from "express";
import { Request, Response } from "express";

import { ResponseG } from "./../../bd/configFields";

class Home {
    public router: Router;
    constructor() {
        this.router = Router();
        this.router.get("/", this.Home);
        this.router.get("/:message", this.HomeMessage);

        this.router.post("/home", this.Post);
        this.router.put("/home", this.Put);
    }

    /**
     * Method to save element.
     * @param req Request
     * @param res Response
     */
    private Post(req: Request, res: Response) {
        return res.status(200).send({});

    }

    /**
     * Method to update element.
     * @param req Request
     * @param res Response
     */
    private Put(req: Request, res: Response) {
        return res.status(200).send({});
    }


    /**
     * Method to get first page or request ajax.
     * @param req Request
     * @param res Response
     */
    private Home(req: Request, res: Response) {
        return res.status(200).send({});
    }

    /**
     * Method to get first page with pretty url
     * @param req Request
     * @param res Response
     */
    private HomeMessage(req: Request, res: Response) {
        return res.status(200).send({});
    }

}
export default new Home();
