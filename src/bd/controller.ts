import { Request, Response } from "express";

export interface DocEntity {
    controller: string;
    url: string;
    method: string;
    description: string;
    fields: DocFieldsEntity[]
}
export interface DocFieldsEntity {
    field: string;
    require: boolean;
    type: string;
    description: string | any;
}

export class clasController {
    public Doc : DocEntity[];


}