import { IQuery } from "../../infrastructure/abstractions/messaging/IQuery";

export class GetJenisCutiQuery implements IQuery {
    public id: number;
    
    constructor(
      id: number
    ) {
      this.id = id;
    }
}