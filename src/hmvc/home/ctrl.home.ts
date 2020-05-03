import { Router } from "express";
import { Request, Response } from "express";

import { ResponseG } from "./../../bd/configFields";
import { clasController, DocEntity, DocFieldsEntity } from "./../../bd/controller";

class Home extends clasController {
    public router: Router;
    constructor() {
        super();

        this.router = Router();
        this.router.get("/", this.Home);
        this.router.get("/:message", this.HomeMessage);

        this.router.post("/home", this.Post);
        this.router.put("/home", this.Put);

        this.Documentation();
        this.router.get('/help/home', (req: Request, res: Response) => {
            return res.status(200).send(this.Doc);
        });
    }

    private Documentation() {
        this.Doc = [
            {
                controller: "Home",
                url: "/",
                method: "GET",
                description: "",
                fields: []
            }
        ]
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
