import { IQuery } from "../../infrastructure/abstractions/messaging/IQuery";

export class GetPenggunaQuery implements IQuery {
    public id: number;
    
    constructor(
      id: number
    ) {
      this.id = id;
    }
}