import { IQuery } from "../../infrastructure/abstractions/messaging/IQuery";

export class GetAllJenisSPPDQuery implements IQuery {
    public take: number|null;
    public skip: number|null;
    constructor(
        take:number|null = null,
        skip:number|null = null,
    ) {
      this.take = take
      this.skip = skip
    }
}