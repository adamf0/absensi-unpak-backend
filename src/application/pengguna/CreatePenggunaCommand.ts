import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class CreatePenggunaCommand extends Command {
    public username: string;
    public password: string;
    public nama: string;
    public level: string;
    public nidn: string;
    
    constructor(
      username:string,
      password:string,
      nama:string,
      level:string,
      nidn:string,
    ) {
      super();
      this.username = username
      this.password = password
      this.nama = nama
      this.level = level
      this.nidn = nidn
    }
}