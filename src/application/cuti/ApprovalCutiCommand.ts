import { StatusCuti } from "../../domain/enum/StatusCuti";
import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class ApprovalCutiCommand extends Command {
    public id: number;
    public type: StatusCuti;
    public note: string|null;
    
    constructor(
      id:number,
      type:StatusCuti,
      note:string|null
    ) {
      super();
      this.id = id
      this.type = type
      this.note = note
    }
  }