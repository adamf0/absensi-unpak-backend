import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class DeleteIzinCommand extends Command {
    public id: number;
    
    constructor(
      id:number,
    ) {
      super();
      this.id = id
    }
  }