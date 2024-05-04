import { StatusClaimAbsen } from "../../domain/enum/StatusClaimAbsen";
import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class ApprovalClaimAbsenCommand extends Command {
    public id: number;
    public type: StatusClaimAbsen;
    
    constructor(
      id:number,
      type:StatusClaimAbsen,
    ) {
      super();
      this.id = id
      this.type = type
    }
  }