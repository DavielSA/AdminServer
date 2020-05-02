"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class Home {
    constructor() {
        this.router = express_1.Router();
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
    Post(req, res) {
        return res.status(200).send({});
    }
    /**
     * Method to update element.
     * @param req Request
     * @param res Response
     */
    Put(req, res) {
        return res.status(200).send({});
    }
    /**
     * Method to get first page or request ajax.
     * @param req Request
     * @param res Response
     */
    Home(req, res) {
        return res.status(200).send({});
    }
    /**
     * Method to get first page with pretty url
     * @param req Request
     * @param res Response
     */
    HomeMessage(req, res) {
        return res.status(200).send({});
    }
}
exports.default = new Home();
//# sourceMappingURL=ctrl.home.js.map