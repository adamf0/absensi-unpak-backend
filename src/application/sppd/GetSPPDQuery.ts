import { IQuery } from "../../infrastructure/abstractions/messaging/IQuery";

export class GetSPPDQuery implements IQuery {
    public id: number;
    
    constructor(
      id: number
    ) {
      this.id = id;
    }
}