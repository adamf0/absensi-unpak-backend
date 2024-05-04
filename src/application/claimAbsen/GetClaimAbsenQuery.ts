import { IQuery } from "../../infrastructure/abstractions/messaging/IQuery";

export class GetClaimAbsenQuery implements IQuery {
    public id: number;
    
    constructor(
      id: number
    ) {
      this.id = id;
    }
}