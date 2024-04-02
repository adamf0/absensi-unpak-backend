import { IQuery } from "../../infrastructure/abstractions/messaging/IQuery";

export class GetAllIzinQuery implements IQuery {
    public take: number;
    public skip: number;
    constructor(
        take:number,
        skip:number,
    ) {
      this.take = take
      this.skip = skip
    }
}