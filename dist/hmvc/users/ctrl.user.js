"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dUser_1 = __importDefault(require("./dUser"));
const HttpCode_1 = require("./../../libs/HttpCode");
const ResponseString_1 = require("./../../libs/ResponseString");
const Auth_1 = __importDefault(require("./../../libs/Auth"));
const dUserHistory_1 = __importDefault(require("./dUserHistory"));
const controller_1 = require("./../../bd/controller");
class User extends controller_1.clasController {
    constructor() {
        super();
        this.router = express_1.Router();
        this.router.post("/register", this.Register);
        this.router.post("/user/login", this.Login);
        this.router.get("/user/logout", Auth_1.default.Verify, this.Logout);
        this.Documentation();
        this.router.get('/help/service/types', (req, res) => {
            return res.status(200).send(this.Doc);
        });
    }
    Documentation() {
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
        ];
    }
    /**
     * Method to create a new user.
     * @param req Request
     * @param res Response
     */
    Register(req, res) {
        // validate data to create a new users
        dUser_1.default.IsValidInsert(req.body, (response) => {
            if (response.error.length > 0)
                return res.status(HttpCode_1.HttpCode.INVALID_DATA).send(response);
            const entity = response.item;
            // Check email not exist in db. If Exist is duplicate users
            dUser_1.default.Get({ email: entity.email }, (exist) => {
                exist.item = (exist.item) ? exist.item[0] : undefined;
                if (exist.error.length > 0 || exist.item) {
                    response.error.push(ResponseString_1.ResponseString.DUPLICATE_USER);
                    delete response.item.hash;
                    delete response.item.salt;
                    return res.status(HttpCode_1.HttpCode.OK).send(response);
                }
                // Insert a user
                dUser_1.default.Create(entity, response, (r) => {
                    response.error = r.error;
                    response.warning = r.warning;
                    response.info = r.info;
                    delete response.item.hash;
                    delete response.item.salt;
                    return res.status(HttpCode_1.HttpCode.OK).send(response);
                });
            });
        });
    }
    /**
     * Method to authenticate user.
     * @param req Request
     * @param res Response
     */
    Login(req, res) {
        // validate basic data to login user.
        const response = dUser_1.default.IsValidlogin(req.body);
        if (response.error.length > 0)
            return res.status(HttpCode_1.HttpCode.INVALID_DATA).send(response);
        dUser_1.default.GetLogin(response, response.item.email, response.item.password, (r) => {
            if (r.error.length > 0 || !r.item) {
                return res.status(HttpCode_1.HttpCode.OK).send(r);
            }
            r.item = Auth_1.default.MakeToken(response.item);
            const ip = req.connection.remoteAddress;
            dUserHistory_1.default.Create(ip, r.item.user_id);
            return res.status(HttpCode_1.HttpCode.OK).send(response);
        });
    }
    /**
     * Method to disconnect user.
     * @param req Request
     * @param res Response
     */
    Logout(req, res) {
        return res.status(200).send({});
    }
}
exports.default = new User();
//# sourceMappingURL=ctrl.user.js.map