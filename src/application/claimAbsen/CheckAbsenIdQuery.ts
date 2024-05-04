import { IQuery } from "../../infrastructure/abstractions/messaging/IQuery";

export class CheckAbsenIdQuery implements IQuery {
    public absenId: string;
    
    constructor(
      absenId: string,
    ) {
      this.absenId = absenId;
    }
}