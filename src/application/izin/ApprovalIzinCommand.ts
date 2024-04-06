import { StatusIzin } from "../../domain/enum/StatusIzin";
import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class ApprovalIzinCommand extends Command {
    public id: number;
    public type: StatusIzin;
    public note: string|null;
    
    constructor(
      id:number,
      type:StatusIzin,
      note:string|null
    ) {
      super();
      this.id = id
      this.type = type
      this.note = note
    }
  }