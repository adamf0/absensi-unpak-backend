import { IQuery } from "../../infrastructure/abstractions/messaging/IQuery";

export class GetAllCutiQuery implements IQuery {
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