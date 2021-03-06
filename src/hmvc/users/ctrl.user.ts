import { Router, Request, Response } from "express";

import Data from './dUser';
import Model from './mUser';

import { HttpCode } from './../../libs/HttpCode';
import { ResponseString } from './../../libs/ResponseString';
import Auth from './../../libs/Auth';
import { ResponseG } from "./../../bd/configFields";
import dUserHistory from "./dUserHistory";
import { clasController, DocEntity, DocFieldsEntity } from "./../../bd/controller";

class User extends clasController {
    public router: Router;
    constructor() {
        super();

        this.router = Router();
        this.router.post("/register", this.Register);
        this.router.post("/user/login", this.Login);
        this.router.get("/user/logout",Auth.Verify,this.Logout);

        this.Documentation();

        this.router.get('/help/user', (req: Request, res: Response) => {
            return res.status(200).send(this.Doc);
        });
    }

    private Documentation() {
        this.Doc = [
            {
                controller: "User",
                url: "/register",
                method: "POST",
                description: "Create new user",
                fields: [
                    {
                        field: "id",
                        require: false,
                        type: "number",
                        description: "Auto numeric number. it's not necesary to create"
                    },
                    {
                        field: "email",
                        require: true,
                        type: "string",
                        description: "Email of client"
                    },
                    {
                        field: "password",
                        require: true,
                        type: "string",
                        description: "Password top secret of client"
                    },
                    {
                        field: "name",
                        require: false,
                        type: "string",
                        description: "Name of client"
                    },
                    {
                        field: "permissions",
                        require: false,
                        type: "number",
                        description: "Id of permission of client. By default is 0"
                    }
                ]
            },
            {
                controller: "User",
                url: "/user/login",
                method: "POST",
                description: "Method to autenticate user. This return JWT when login is true",
                fields: [
                    {
                        field: "email",
                        require: true,
                        type: "string",
                        description: "Email of client"
                    },
                    {
                        field: "password",
                        require: true,
                        type: "string",
                        description: "Password top secret of client"
                    }
                ]
            }
        ]
    }

    /**
     * Method to create a new user.
     * @param req Request
     * @param res Response
     */
    private Register(req: Request, res: Response) {
        // validate data to create a new users
        Data.IsValidInsert(req.body, (response: ResponseG) => {
            if (response.error.length > 0)
                return res.status(HttpCode.INVALID_DATA).send(response);
            const entity: Model = response.item;
            // Check email not exist in db. If Exist is duplicate users
            Data.Get({ email: entity.email } as Model, (exist: ResponseG) => {
                exist.item = (exist.item) ? exist.item[0] : undefined;

                if (exist.error.length > 0 || exist.item) {
                    response.error.push(ResponseString.DUPLICATE_USER);
                    delete response.item.hash;
                    delete response.item.salt;
                    return res.status(HttpCode.OK).send(response);
                }
                // Insert a user
                Data.Create(entity, response, (r: ResponseG) => {
                    response.error = r.error;
                    response.warning = r.warning;
                    response.info = r.info;
                    delete response.item.hash;
                    delete response.item.salt;

                    return res.status(HttpCode.OK).send(response);
                });
            });
        });
    }

    /**
     * Method to authenticate user.
     * @param req Request
     * @param res Response
     */
    private Login(req: Request, res: Response) {
        // validate basic data to login user.
        const response: ResponseG = Data.IsValidlogin(req.body);
        if (response.error.length > 0)
            return res.status(HttpCode.INVALID_DATA).send(response);

        Data.GetLogin(response, response.item.email, response.item.password, (r: ResponseG) => {
            if (r.error.length > 0 || !r.item) {
                return res.status(HttpCode.OK).send(r);
            }
            r.item = Auth.MakeToken(response.item);
            const ip: string = req.connection.remoteAddress;
            dUserHistory.Create(ip,r.item.user_id);

            return res.status(HttpCode.OK).send(response);
        });
    }

    /**
     * Method to disconnect user.
     * @param req Request
     * @param res Response
     */
    private Logout(req: Request, res: Response) {
        return res.status(200).send({});
    }

}
export default new User();
