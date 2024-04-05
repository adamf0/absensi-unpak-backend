import { IQuery } from "../../infrastructure/abstractions/messaging/IQuery";

export class GetUserQuery implements IQuery {
    public id: number;
    
    constructor(
      id: number
    ) {
      this.id = id;
    }
}