"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const ResponseString_1 = require("./../../libs/ResponseString");
const URLS = {
    "REGISTER": "http://localhost:9999/register",
    "LOGIN": "http://localhost:9999/login",
    "LOGOUT": "http://localhost:9999/logout"
};
describe("ctrl.user", () => {
    const RequestAction = (url, data) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (new Promise((resolve) => {
            request_1.default.post(url, { form: data }, (error, response, body) => resolve({ error, response, body }));
        }));
    });
    it("should register user response httpcode 422", () => {
        return RequestAction(URLS.REGISTER, {}).then((data) => {
            const result = !data.error && data.response && data.response.statusCode === 422;
            expect(result).toBeTruthy();
        });
    });
    it("should register user response httpcode 422", () => {
        return RequestAction(URLS.REGISTER, {}).then((data) => {
            const result = !data.error && data.response && data.response.statusCode === 422;
            expect(data.body.error).toContain(ResponseString_1.ResponseString.NOT_ARGUMENT);
        });
    });
});
//# sourceMappingURL=user.spect.js.map