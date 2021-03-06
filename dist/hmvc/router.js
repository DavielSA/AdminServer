"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ctrl_home_1 = __importDefault(require("./home/ctrl.home"));
const ctrl_user_1 = __importDefault(require("./users/ctrl.user"));
const ctrl_langs_1 = __importDefault(require("./langs/ctrl.langs"));
const ctrl_service_1 = __importDefault(require("./services/ctrl.service"));
const ctrl_posts_1 = __importDefault(require("./posts/ctrl.posts"));
const controllers = [
    ctrl_home_1.default.router,
    ctrl_user_1.default.router,
    ctrl_langs_1.default.router,
    ctrl_service_1.default.router,
    ctrl_posts_1.default.router
];
exports.default = controllers;
//# sourceMappingURL=router.js.map