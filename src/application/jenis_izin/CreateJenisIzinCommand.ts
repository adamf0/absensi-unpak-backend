import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class CreateJenisIzinCommand extends Command {
    public nama: string;
    
    constructor(
      nama: string,
    ) {
      super();
      this.nama = nama
    }
}